import React, { useEffect, useState, useContext } from "react";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import DonorLayout from "../../layouts/DonorLayout";
import "../../styles/Campaigns.css";
import shareIcon from "../../assets/images/share.png";
import { getCampaignById, getCampaignImages } from "../../api/Campaign";
import LinearProgressBar from "../../components/LevelProgressBar.js";
import { useParams, useNavigate } from "react-router-dom";
import { getDonorProfile } from "../../api/Profile";
import crossIcon from "../../assets/images/cross.png";
import { NotificationContext } from "../../context/NotificationContext.js";
import Notification from "../../components/Notification.js";

function CampaignDetails() {
  const [textareaHeight, setTextareaHeight] = useState("150px");
  const [campaign, setCampaign] = useState(null);
  const { id: campaignId } = useParams();
  const [profileData, setProfileData] = useState({});
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { notifications } = useContext(NotificationContext);

  const navigate = useNavigate();

  useEffect(() => {
    const updateTextareaHeight = () => {
      if (window.innerHeight > 800 && window.innerHeight <= 900) {
        setTextareaHeight("150px");
      } else if (window.innerHeight > 900 && window.innerHeight <= 1000) {
        setTextareaHeight("100px");
      } else if (window.innerHeight > 1000) {
        setTextareaHeight("100px");
      } else {
        setTextareaHeight("100px");
      }
    };

    updateTextareaHeight();
    window.addEventListener("resize", updateTextareaHeight);

    return () => window.removeEventListener("resize", updateTextareaHeight);
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      const data = await getCampaignById(
        campaignId,
        localStorage.getItem("authToken")
      );
      if (!data) {
        navigate("/homepage");
      } else {
        setCampaign(data);
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
        console.log(data);
        setImages(data);
      }
    };

    fetchImages();
  }, [campaignId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }
      try {
        const response = await getDonorProfile(token);
        setProfileData(response.data.donor.user);
      } catch (error) {
        console.error("Erro ao obter os dados do perfil:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!campaign || !profileData) {
    return <div>Carregando...</div>;
  }

  const formattedDeadline = campaign.end_date
    ? new Date(Date.parse(campaign.end_date)).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Data indisponível";

  const Layout = profileData.is_donor ? DonorLayout : CampaignCreatorLayout;

  const navigateToDonation = () => {
    navigate(`/campaign/${campaignId}/donate`);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <Layout>
      {notifications.length > 0 && (
        <Notification notifications={notifications} />
      )}
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
                  className="h-36 w-full 2xl:h-[191px] object-cover border-t border-black cursor-pointer"
                  onClick={() =>
                    handleImageClick(`http://127.0.0.1:8000${images[0].image}`)
                  }
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
                      className="w-40 h-24 2xl:h-36 2xl:w-52 object-cover border-t border-black cursor-pointer"
                      onClick={() =>
                        handleImageClick(`http://127.0.0.1:8000${image.image}`)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex flex-row mt-4 justify-end ml-16 mr-8 w-2/3">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row mb-6 w-full items-center mt-4 space-x-12 justify-center">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row text-[#35473A]">
                  <h3 className="text-2xl font-semibold">Deadline: </h3>
                  <label className="text-2xl ml-1">{formattedDeadline}</label>
                </div>
                <img src={shareIcon} className="h-9" alt="share"></img>
              </div>
            </div>
            <div className="flex flex-col w-full text-[#28372C] mt-[-20px]">
              <div>
                <p
                  className="bg-transparent focus:outline-none w-full text-xl placeholder-gray-500 resize-none text-justify"
                  style={{ height: textareaHeight }}
                >
                  {campaign.description}
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <label className="text-[#35473A] text-xl font-semibold">
                Raised: {campaign.current_amount}€
              </label>
            </div>
            <div className="ml-2 mr-2">
              <LinearProgressBar
                width="100%"
                height={40}
                fillColor={"#C8E5B3"}
                xp={campaign.current_amount}
                xpToNextLevel={campaign.goal}
                minXpLevel={0}
                radius={25}
              />
            </div>
            <div className="flex flex-row justify-center space-x-16 text-[#35473A] text-xl">
              <label className="font-semibold">Goal: {campaign.goal}€</label>
              <label className="font-semibold">
                Donations: {campaign.total_donors}
              </label>
            </div>
            <div className="flex w-full">
              <button
                onClick={navigateToDonation}
                className="flex-grow h-14 border-2 border-white rounded-md bg-[#4A6B53] text-white text-3xl font-semibold mb-[-10px] shadow-y"
              >
                DONATE HERE!
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected Campaign"
              className="max-w-[900px] max-h-[500px] min-w-[500px] min-h-[550px] border-4 border-white object-cover"
            />
            <img
              src={crossIcon}
              alt="Close"
              className="absolute top-2 right-2 text-white text-[100px] custom-border w-16 cursor-pointer"
              onClick={handleCloseModal}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CampaignDetails;
