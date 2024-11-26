import { useEffect, useState } from "react";
import DonatorLayout from "../../layouts/DonatorLayout";
import profileIcon from "../../assets/images/profile-big-icon.png";
import medalIcon from "../../assets/images/medal.png";
import hexagon from "../../assets/images/hexagon.png";
import LevelBorder from "../../components/LevelBorder.js";
import Hexagon from "../../components/Hexagon.js";
import LinearProgressBar from "../../components/LevelProgressBar.js";
import { getDonorProfile } from "../../api/Profile";
import LevelSystem from "../../utils/LevelSystem";
import { format } from "date-fns";
import { deleteProfile } from "../../api/Profile";

function CampaignCreatorProfile() {
  const [profileStats, setProfileStats] = useState({});
  const [profileData, setProfileData] = useState({});

  const getProfileStats = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getDonorProfile(token);
      setProfileStats(response.data.donator);
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  const getProfileData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getDonorProfile(token);
      setProfileData(response.data.donator.user);
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  const getLevelBorderColor = (level) => {
    if (level >= 0 && level <= 9) return "#FFF584";
    if (level >= 10 && level <= 24) return "#84FF8A";
    if (level >= 25 && level <= 49) return "#FF8494";
    if (level >= 50 && level <= 99) return "#9F84FF";
    return "#84F1FF";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy 'at' HH:mm");
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "Invalid date";
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      await deleteProfile(token);
      localStorage.removeItem("authToken");
      alert("Conta excluída com sucesso.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao excluir a conta:", error);
      alert(
        error.response?.data?.error ||
          "Erro ao excluir a conta. Por favor, tente novamente."
      );
    }
  };

  useEffect(() => {
    getProfileStats();
    getProfileData();
  }, [profileStats.xp]);

  return (
    <DonatorLayout>
      <div className="flex flex-row items-center justify-between pr-24 pl-24 2xl:pl-48 2xl:pr-48">
        <div className="text-[#303934] flex flex-row">
         
            COMEÇAR PÁGINA

        </div>
      </div>
    </DonatorLayout>
  );
}

export default CampaignCreatorProfile;