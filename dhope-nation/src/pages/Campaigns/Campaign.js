import React, { useEffect, useState } from "react";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import DonatorLayout from "../../layouts/DonatorLayout";
import "../../styles/Campaigns.css";
import shareIcon from "../../assets/images/share.png";
import { getCampaignById } from "../../api/Campaign";
import LinearProgressBar from "../../components/LevelProgressBar.js";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../../api/Profile";

function CampaignDetails() {
  const [textareaHeight, setTextareaHeight] = useState("150px");
  const [campaign, setCampaign] = useState(null);
  const { id: campaignId } = useParams();
  const [profileData, setProfileData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const updateTextareaHeight = () => {
      if (window.innerHeight > 800 && window.innerHeight <= 900) {
        setTextareaHeight("350px");
      } else if (window.innerHeight > 900 && window.innerHeight <= 1000) {
        setTextareaHeight("360px");
      } else if (window.innerHeight > 1000) {
        setTextareaHeight("450px");
      } else {
        setTextareaHeight("200px");
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
        navigate("/campaigns");
      } else {
        setCampaign(data);
      }
    };

    fetchCampaign();
  }, [campaignId, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }
      try {
        const response = await getProfile(token);
        setProfileData(response.data.donator.user);
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

  const Layout = profileData.is_donator ? DonatorLayout : CampaignCreatorLayout;

  const navigateToDonation = () => {
    navigate(`/campaign/${campaignId}/donate`);
  };

  return (
    <Layout>
      <div className="flex flex-row justify-center mt-[-20px]">
        <h1 className="text-3xl 2xl:text-4xl text-[#28372C] font-semibold">
          {campaign.title}
        </h1>
      </div>
      <div className="flex flex-row justify-center ml-10 mr-8">
        <div className="flex flex-col w-1/2 gap-2">
          <div className="flex flex-row mb-6 w-full items-center mt-4 space-x-12 justify-center">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-start text-[#35473A]">
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
          <div className="ml-2 mr-2">
            <LinearProgressBar
              width="100%"
              height={40}
              fillColor={"#C8E5B3"}
              xp={campaign.current_amount}
              xpToNextLevel={campaign.goal}
              minXpLevel={0}
              radius={15}
            />
          </div>
          <div className="flex flex-row justify-center space-x-16 text-[#35473A] text-xl">
            <label className="font-semibold">Goal: {campaign.goal}€</label>
            <label className="font-semibold">
              Donations: {campaign.total_donators}
            </label>
          </div>
          <div className="flex w-full">
            <button
              onClick={navigateToDonation}
              className="flex-grow h-12 border-2 border-white rounded-md bg-[#4A6B53] text-white text-2xl font-semibold mb-[-10px] shadow-y"
            >
              DONATE HERE!
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CampaignDetails;
