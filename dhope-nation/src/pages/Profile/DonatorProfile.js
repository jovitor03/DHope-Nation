import { useEffect, useState } from "react";
import DonatorLayout from "../../layouts/DonatorLayout";
import profileIcon from "../../assets/images/profile-big-icon.png";
import medalIcon from "../../assets/images/medal.png";
import hexagon from "../../assets/images/hexagon.png";
import LevelBorder from "../../components/LevelBorder.js";
import Hexagon from "../../components/Hexagon.js";
import LinearProgressBar from "../../components/LevelProgressBar.js";
import { getProfile } from "../../api/Profile";
import LevelSystem from "../../utils/LevelSystem";
import { format } from "date-fns";
import { deleteProfile } from "../../api/Profile";

function DonatorProfile() {
  const [profileStats, setProfileStats] = useState({});
  const [profileData, setProfileData] = useState({});

  const getProfileStats = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getProfile(token);
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
      const response = await getProfile(token);
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
          <div className="flex items-center gap-3">
            <img src={profileIcon} alt="profile-icon" className="w-48"></img>
            <div className="flex flex-col h-full gap-2 2xl:gap-4">
              <div className="flex flex-col">
                <label className="font-bold text-3xl 2xl:text-4xl">
                  {profileData.username}
                </label>
                <label className="font-semibold text-xl 2xl:text-2xl">
                  ({profileData.first_name} {profileData.last_name})
                </label>
              </div>
              <label className="text-lg 2xl:text-xl">
                Joined: {formatDate(profileData.date_joined)}
              </label>
              <button
                className="bg-[#CA0404] rounded rounded-md text-white border-2 border-[#303934] font-semibold p-1 text-lg mt-2 2xl:mt-3"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <div className="w-[375px] ml-8 bg-[#4E6A56] h-64 rounded-[16px] flex flex-col text-white font-semibold border-2 border-[#1D2320]">
          <div className="flex flex-row mt-2 justify-center">
            <img src={medalIcon} alt="medal-icon" className="w-12 h-12"></img>
            <label
              className={`text-2xl 2xl:text-3xl font-semibold mt-2 ${
                profileStats.honor === "Super High Honor"
                  ? "text-[#00EEFF]"
                  : profileStats.honor === "High Honor"
                  ? "text-[#0dcd0d]"
                  : profileStats.honor === "Neutral Honor"
                  ? "text-[#f7c23c]"
                  : ""
              }`}
            >
              {profileStats.honor}
            </label>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="flex flex-row items-center ml-6 mt-4">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <label className="ml-2 text-2xl 2xl:text-3xl">
                  {profileStats.donation_count} donations
                </label>
              </div>
              <div className="flex flex-row items-center ml-6 mt-3">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <label className="ml-2 text-2xl 2xl:text-3xl">
                  {profileStats.donation_value}€ donated
                </label>
              </div>
              <div className="flex flex-row items-center ml-6 mt-3">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <div className="flex ml-2 flex-row items-center">
                  <label className="text-lg 2xl:text-xl">
                    Biggest donation:<label> </label>
                  </label>
                  <label className="text-xl ml-1 2xl:text-2xl">€</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-8 bg-[#4E6A56] h-64 w-128 rounded-[16px] flex flex-row items-center border-2 border-[#1D2320]">
          <div className="h-64 w-80 text-white flex flex-col items-center">
            <label className="text-2xl font-semibold mt-2">My Level</label>
            <label className="text-md">
              Position: {profileStats.rank}º ({profileStats.xp} XP)
            </label>
            <div className="scale-90 items-center flex flex-col relative">
              <Hexagon fillColor="#3C423A" width="112px" height="112px" />
              <label
                className={`absolute inset-0 flex items-center justify-center text-white font-bold ${
                  String(profileStats.level).length >= 3
                    ? "text-4xl"
                    : "text-5xl"
                }`}
              >
                {profileStats.level}
              </label>
              <div className="absolute bottom-[-1px]">
                <LevelBorder
                  fillColor={getLevelBorderColor(profileStats.level)}
                />
              </div>
            </div>
            <div className="mt-2">
              <LinearProgressBar
                width={250}
                height={20}
                fillColor={getLevelBorderColor(profileStats.level)}
                xp={profileStats.xp}
                xpToNextLevel={LevelSystem.getMaxXPForLevel(
                  LevelSystem.getLevel(profileStats.xp)
                )}
                minXpLevel={LevelSystem.getMaxXPForLevel(profileStats.level)}
                radius={10}
              />
            </div>
            <label className="mt-1">
              {LevelSystem.getMaxXPForLevel(
                LevelSystem.getLevel(profileStats.xp)
              ) - profileStats.xp}{" "}
              XP to next level
            </label>
          </div>
          <div className="h-64 w-48 text-white flex flex-col items-center">
            <label className="text-2xl font-semibold mt-2">Level System</label>
            <label className="text-md">1€ donated = 10 XP</label>
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#FFF584" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 1-9</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#84FF8A" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 10-24</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#FF8494" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 25-49</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#9F84FF" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 50-99</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#84F1FF" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 100+</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DonatorLayout>
  );
}

export default DonatorProfile;
