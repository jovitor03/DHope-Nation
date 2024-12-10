import { useEffect, useState } from "react";
import DonorLayout from "../../layouts/DonorLayout";
import profileIcon from "../../assets/images/profile-big-icon.png";
import medalIcon from "../../assets/images/medal.png";
import hexagon from "../../assets/images/hexagon.png";
import LevelBorder from "../../components/LevelBorder.js";
import Hexagon from "../../components/Hexagon.js";
import LinearProgressBar from "../../components/LevelProgressBar.js";
import Pagination from "../../components/Pagination";
import {
  getDonorProfile,
  deleteProfile,
  getDonations,
  getTopDonationsFromDonor,
} from "../../api/Profile.js";
import LevelSystem from "../../utils/LevelSystem.js";
import { format } from "date-fns";
import { getCampaignImages } from "../../api/Campaign.js";
import "../../styles/Profile.css";

function DonorProfile() {
  const [profileStats, setProfileStats] = useState({});
  const [profileData, setProfileData] = useState({});
  const [donorDonations, setDonorDonations] = useState([]);
  const [topDonations, setTopDonations] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 4;
  const maxXP = 25024950;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProfileStats = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getDonorProfile(token);
      setProfileStats(response.data.donor);
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
      setProfileData(response.data.donor.user);
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  const getDonorDonations = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getDonations(token);
      setDonorDonations(response.data);
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  const getTopDonations = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getTopDonationsFromDonor(token);
      setTopDonations(response.data.slice(0, 10));
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
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao excluir a conta:", error);
      alert(
        error.response?.data?.error ||
          "Erro ao excluir a conta. Por favor, tente novamente."
      );
    }
  };

  const getFirstImageCampaing = async (campaignId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getCampaignImages(campaignId);
      return response[0].image;
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  const navigateToCampaign = (campaignId) => {
    return () => {
      window.location.href = `/campaign/${campaignId}`;
    };
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = {};
      for (const donation of donorDonations) {
        const url = await getFirstImageCampaing(donation.campaign);
        urls[donation.id] = `http://127.0.0.1:8000${url}`;
      }
      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [donorDonations]);

  useEffect(() => {
    getProfileStats();
    getProfileData();
    getDonorDonations();
    getTopDonations(); // Fetch top donations
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = donorDonations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  const totalPages = Math.ceil(donorDonations.length / donationsPerPage);

  return (
    <DonorLayout>
      <div className="flex flex-row items-center justify-between pr-12 pl-12 2xl:pl-48 2xl:pr-48">
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
                onClick={openModal}
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
                  ? "text-[#fc6075]"
                  : profileStats.honor === "High Honor"
                  ? "text-[#0dcd0d]"
                  : profileStats.honor === "Neutral Honor"
                  ? "text-[#f7c23c]"
                  : profileStats.honor === "Epic Honor"
                  ? "text-[#9F84FF]"
                  : profileStats.honor === "Legendary Honor"
                  ? "text-[#00EEFF]"
                  : ""
              }`}
            >
              {profileStats.honor}
            </label>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="flex flex-row items-center ml-12 mt-8">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <label className="ml-2 text-2xl 2xl:text-3xl">
                  {profileStats.donation_count} donations
                </label>
              </div>
              <div className="flex flex-row items-center ml-12 mt-3">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <label className="ml-2 text-xl 2xl:text-2xl">
                  {profileStats.donation_value !== undefined
                    ? profileStats.donation_value.toFixed(2)
                    : "0,00"}
                  € donated
                </label>
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
            {profileStats.xp < maxXP ? (
              <div className="mt-2">
                <LinearProgressBar
                  width={250}
                  height={20}
                  fillColor={getLevelBorderColor(profileStats.level)}
                  xp={
                    profileStats.xp -
                    LevelSystem.getMaxXPForLevel(profileStats.level - 1)
                  }
                  xpToNextLevel={
                    LevelSystem.getMaxXPForLevel(profileStats.level) -
                    LevelSystem.getMaxXPForLevel(profileStats.level - 1)
                  }
                  radius={10}
                />
              </div>
            ) : (
              <div className="mt-2">
                <LinearProgressBar
                  width={250}
                  height={20}
                  fillColor={getLevelBorderColor(profileStats.level)}
                  xp={maxXP}
                  xpToNextLevel={maxXP}
                  radius={10}
                />
              </div>
            )}
            {profileStats.xp < maxXP ? (
              <label className="mt-1">
                {LevelSystem.getMaxXPForLevel(
                  LevelSystem.getLevel(profileStats.xp)
                ) - profileStats.xp}{" "}
                XP to next level
              </label>
            ) : (
              <label className="mt-1 text-xl">Maximum level reached!</label>
            )}
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
      <div className="flex flex-row justify-between gap-x-10">
        {/* <div className="flex flex-col ml-24 mt-12 mb-8 w-7/12">
          <div className="flex flex-col text-[#303934] text-center">
            <label className="font-semibold text-2xl">Donations History</label>
            <label className="text-lg mt-[-5px]">(From latest to oldest)</label>
          </div>
          <div className="flex flex-row text-[#303934] justify-center">
            <div className="flex flex-col w-full">
              {currentDonations.length > 0 ? (
                <>
                  {currentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex flex-row items-center gap-4 mt-4 cursor-pointer"
                      onClick={navigateToCampaign(donation.campaign)}
                    >
                      <div className="relative cursor-pointer">
                        <img
                          src={imageUrls[donation.id]}
                          alt={imageUrls[donation.id]}
                          className="h-32 w-48 object-cover rounded-[6px] cursor-pointer"
                        />
                        <div className="image-cover cursor-pointer">
                          <span className="donation-amount cursor-pointer">
                            +{donation.amount}€
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col cursor-pointer">
                        <label className="text-lg font-semibold underline cursor-pointer">
                          {donation.title}
                        </label>
                        <label className="text-md cursor-pointer">
                          {formatDate(donation.date)}
                        </label>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <label className="text-lg mt-2">No donations yet.</label>
              )}
            </div>
          </div>
        </div> */}
        <div className="flex flex-col ml-24 mt-12 mb-8 w-7/12">
          <div className="flex flex-col text-[#303934] text-center">
            <label className="font-semibold text-2xl">Donations History</label>
            <label className="text-lg mt-[-5px]">(From latest to oldest)</label>
          </div>
          <div className="flex flex-row text-[#303934] justify-center">
            <div className="flex flex-col w-full">
              {currentDonations.length > 0 ? (
                <>
                  {currentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex flex-row items-center gap-4 mt-4 cursor-pointer"
                      onClick={navigateToCampaign(donation.campaign)}
                    >
                      <div className="relative cursor-pointer">
                        <img
                          src={imageUrls[donation.id]}
                          alt={imageUrls[donation.id]}
                          className="h-32 w-48 object-cover rounded-[6px] cursor-pointer"
                        />
                        <div className="image-cover cursor-pointer">
                          <span className="donation-amount cursor-pointer">
                            +{donation.amount}€
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col cursor-pointer">
                        <label className="text-lg font-semibold underline cursor-pointer">
                          {donation.title}
                        </label>
                        <label className="text-md cursor-pointer">
                          {formatDate(donation.date)}
                        </label>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center mt-2">
                  <label className="text-lg">No donations yet.</label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col mr-16 mt-12 mb-8 w-5/12">
          <div className="flex flex-col text-[#303934] text-center">
            <label className="font-semibold text-2xl">
              Your All-time Top 10 Donations
            </label>
          </div>
          <div className="flex flex-row text-[#303934] justify-center">
            <div className="flex flex-col">
              {topDonations.length > 9 ? (
                topDonations.map((donation, index) => (
                  <div
                    key={donation.id}
                    className="flex flex-row items-center gap-4 mt-4"
                  >
                    <div className="flex flex-row text-white font-semibold">
                      <label
                        className={`text-${
                          index === 0
                            ? "3xl"
                            : index === 1
                            ? "3xl"
                            : index === 2
                            ? "3xl"
                            : "md"
                        }
                        } px-${index === 9 ? "3" : "4"} py-3 rounded-full z-10`}
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#d4af37"
                              : index === 1
                              ? "#c0c0c0"
                              : index === 2
                              ? "#b87333"
                              : "#4E6A56",
                        }}
                      >
                        {index + 1}º
                      </label>
                    </div>
                    <div
                      className={`bg-[#35473A] text-white w-full z-0 rounded-full
                    ${
                      index < 3
                        ? "h-14 ml-[-78px] px-12"
                        : "h-10 flex items-center justify-center"
                    }
                      `}
                    >
                      <div
                        className={`relative text-xl font-semibold ${
                          index < 3 ? "ml-6" : "justify-center"
                        }
                      `}
                      >
                        <div>
                          <span>+{donation.amount}€</span>
                        </div>
                      </div>
                      <div>
                        {index < 3 && (
                          <div>
                            <label className="text-md  ml-6">
                              {formatDate(donation.date)}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <label className="text-lg mt-2">No top donations yet.</label>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-[#f1f5f0] p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold mb-4 text-[#516158]">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-center space-x-12">
              <button
                className="bg-[#34A77F] text-white px-6 py-2 rounded-md hover:bg-[#2e8063] text-xl "
                onClick={handleDeleteAccount}
              >
                Yes, I want to delete my account
              </button>
              <button
                className="bg-[#CA0404] text-white px-6 py-2 rounded-md hover:bg-red-700 text-xl font-semibold"
                onClick={handleCancelDelete}
              >
                No, I want to stay with you
              </button>
            </div>
          </div>
        </div>
      )}
    </DonorLayout>
  );
}

export default DonorProfile;
