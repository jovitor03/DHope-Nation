import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCampaignById, donateToCampaign } from "../../api/Campaign";
import "../../styles/Campaigns.css";
import Layout from "../../layouts/DonorLayout.js";
import { getCampaignImages } from "../../api/Campaign";
import LevelSystem from "../../utils/LevelSystem";
import {
  updateLevel,
  getDonorProfile,
  getDonationsLast30Days,
  updateHonor,
} from "../../api/Profile";
import { NotificationContext } from "../../context/NotificationContext.js";
import LoadingScreen from "../../components/LoadingScreen.js";

function CampaignDonation() {
  const [campaign, setCampaign] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [itemsProvided, setItemsProvided] = useState(0);
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [images, setImages] = useState([]);
  const { id: campaignId } = useParams();
  const { showNotification } = useContext(NotificationContext);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }
      try {
        setLoading(true);
        const response = await getDonorProfile(token);
        const user = response.data.donor.user;
        if (response.data.donor.level === 999) {
          console.warn(
            "User has reached the maximum level. They can still receive XP but won't level up."
          );
        }
        setProfileData(user);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao obter os dados do perfil:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getCampaignById(
          campaignId,
          localStorage.getItem("authToken")
        );
        if (!data) {
          navigate("/campaigns");
        } else {
          setCampaign(data);
        }
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
        navigate("/campaigns");
      }
    };

    fetchCampaign();
  }, [campaignId, navigate]);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await getCampaignImages(campaignId);
      if (!data) {
        console.error("Erro ao obter as imagens da campanha.");
      } else {
        setImages(data);
      }
    };

    fetchImages();
  }, [campaignId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getDonorProfile(
          localStorage.getItem("authToken")
        );
        const data = response.data;
        setUserXP(data.donor.xp);
        setUserLevel(data.donor.level);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const updateHonorOnProfile = async () => {
    const token = localStorage.getItem("authToken");
    const response = await getDonationsLast30Days(token);
    const donationsLast30Days = response.data.total_donated_last_30_days;
    const totalDonations = donationsLast30Days + parseFloat(donationAmount);

    const profileResponse = await getDonorProfile(token);
    const currentHonor = profileResponse.data.donor.honor;

    let newHonor = currentHonor;

    if (totalDonations >= 100) {
      newHonor = "Legendary Honor";
    } else if (totalDonations >= 50) {
      newHonor = "Epic Honor";
    } else if (totalDonations >= 25) {
      newHonor = "Super High Honor";
    } else if (totalDonations >= 10) {
      newHonor = "High Honor";
    }

    if (newHonor !== currentHonor) {
      await updateHonor(token, newHonor);
      showNotification(`Your honor is now ${newHonor}`, "honor");
    }
  };

  useEffect(() => {}, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleDonationAmountChange = (event) => {
    const amount = parseFloat(event.target.value) || 0;
    setDonationAmount(event.target.value);

    if (campaign && campaign.ratio) {
      const items = amount * campaign.ratio;
      setItemsProvided(Math.round(items));
    }
  };

  const handleConfirmDonation = async () => {
    const amount = parseFloat(donationAmount);

    if (amount < 0.5 || amount > 100000) {
      return;
    }

    if (!paymentMethod) {
      return;
    }

    try {
      await updateHonorOnProfile();

      await donateToCampaign(
        {
          campaign_id: campaignId,
          amount,
          payment_method: paymentMethod,
          items_provided: itemsProvided,
        },
        localStorage.getItem("authToken")
      );

      const xpGained = amount * 10;
      const newXP = userXP + xpGained;
      const newLevel = LevelSystem.getLevel(newXP);

      setUserXP(newXP);

      if (newLevel === 999) {
        showNotification(
          "Congratulations! You've reached the maximum level!",
          "level"
        );
      }

      if (userLevel !== 999) {
        if (newLevel > userLevel) {
          setUserLevel(newLevel);
          showNotification(
            `Congratulations! You've leveled up to level ${newLevel}!`,
            "level"
          );
          await updateLevel(localStorage.getItem("authToken"), newLevel);
        }
      }

      showNotification(`Gained: ${xpGained} XP.`, "xp");

      showNotification("Successful donation!", "donation");

      navigate(`/campaign/${campaignId}`);
    } catch (error) {
      console.error("Donation failed:", error);
      showNotification("Failed to process your donation.", "error");

      navigate(`/campaign/${campaignId}`);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {loading && <LoadingScreen />}
      {!loading && (
        <div className="fade-in">
          <Layout>
            <div className="flex flex-row justify-center mt-[-20px]">
              <h1 className="text-3xl 2xl:text-4xl text-[#28372C] font-semibold">
                {campaign.title}
              </h1>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-start mr-16 ml-20 items-center w-5/12">
                {images.length > 0 ? (
                  <div className="flex flex-col mt-32 2xl:mt-40 items-center mb-[-40px] border-r border-l border-b border-black">
                    <div className="w-7/12 items-center flex flex-col text-center justify-center mb-4 scale-171">
                      <img
                        src={`http://127.0.0.1:8000${images[0].image}`}
                        alt="Main"
                        className="h-36 w-full 2xl:h-[191px] object-cover border-t border-black"
                      />
                    </div>
                    <div className="flex flex-row justify-between mt-9 2xl:mt-12 z-10">
                      {images.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className={`flex justify-center items-center bg-white ${
                            index !== 0 ? "border-l border-black" : ""
                          }`}
                        >
                          <img
                            src={`http://127.0.0.1:8000${image.image}`}
                            alt={`Preview ${index + 2}`}
                            className="w-40 h-24 2xl:h-36 2xl:w-52 object-cover border-t border-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="flex flex-row justify-end ml-16 mt-12 mr-8 w-2/3 h-full text-center">
                <div className="flex flex-col gap-2 w-full bg-white p-4 border border-[#28372C]">
                  <label className="text-[#28372C] font-semibold text-3xl mt-6">
                    Your donation
                  </label>
                  <div>
                    <label
                      htmlFor="payment-method"
                      className="text-[#28372C] text-xl"
                    >
                      Payment method:
                    </label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                      className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white text-xl"
                    >
                      <option value="" disabled>
                        Select a method
                      </option>
                      <option value="credit-card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="multibanco">Multibanco</option>
                      <option value="mbway">MB Way</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#28372C] text-xl">Amount:</label>
                    <input
                      type="number"
                      value={donationAmount}
                      className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white custom-number-input placeholder-gray-400 text-center text-xl focus:outline-none"
                      placeholder="0.50€ - 100000€"
                      onChange={handleDonationAmountChange}
                    ></input>
                  </div>
                  {campaign.ratio && (
                    <div className="mt-4">
                      <p className="text-[#28372C] text-xl font-semibold">
                        Your contribution will provide {itemsProvided}{" "}
                        {campaign.sentence}.
                      </p>
                    </div>
                  )}
                  <div className="mb-6 mt-6 flex flex-row justify-center space-x-8">
                    <button
                      className="h-12 px-4 border-2 rounded-sm border-[#4A6B53] bg-[#D9D9D9] text-[#4A6B53] text-2xl font-semibold shadow-y whitespace-nowrap"
                      onClick={() => navigate(`/campaign/${campaignId}`)}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={
                        profileData.is_donor ? handleConfirmDonation : null
                      }
                      className={`${
                        profileData.is_donor
                          ? "disabled"
                          : "bg-gray-500 cursor-not-allowed"
                      } h-12 px-4 border-2 rounded-sm border-white bg-[#4A6B53] text-white text-2xl font-semibold shadow-y whitespace-nowrap`}
                    >
                      CONFIRM DONATION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      )}
    </div>
  );
}

export default CampaignDonation;
