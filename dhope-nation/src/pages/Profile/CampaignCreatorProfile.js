import { useEffect, useState } from "react";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import profileIcon from "../../assets/images/profile-big-icon.png";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import LinearProgressBar from "../../components/LevelProgressBar.js";
import {
  getCampaignCreatorProfile,
  deleteProfile,
  getCampaignsByCreator,
} from "../../api/Profile.js";
import { getCampaignImages, closeCampaign } from "../../api/Campaign.js";
import "../../styles/Profile.css";
import LoadingScreen from "../../components/LoadingScreen.js";
import Pagination from "../../components/Pagination.js";

function CampaignCreatorProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({}); //Dados do campaign creator logado
  const [createdCampaigns, setCreatedCampaigns] = useState([]); //Campanhas do campaign creator logado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //Aviso para confirmação de eliminar conta
  const [loading, setLoading] = useState(true);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false); //Aviso para confirmação concluir uma campanha
  const [selectedCampaignId, setSelectedCampaignId] = useState(null); //Campanha escolhida
  const [currentPage, setCurrentPage] = useState(1); //Página atual
  const [filterActive, setFilterActive] = useState(true); //Filtar campanhas ativas ou encerradas
  const [campaignTitle, setCampaignTitle] = useState("Active Campaigns"); //Título de Ativas ou encerradas
  const campaignsPerPage = 3; //Número de campanhas por página

  const getProfileData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }
    try {
      const response = await getCampaignCreatorProfile(token);
      setProfileData(response.data.campaign_creator.user);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
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

  const getCampaigns = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }
    try {
      const response = await getCampaignsByCreator(token);
      const campaignsWithImages = await Promise.all(
        response.data.map(async (campaign) => {
          const images = await getCampaignImages(campaign.id);
          return { ...campaign, images };
        })
      );
      setCreatedCampaigns(campaignsWithImages);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  //Campanhas ativas são as que forma criadas e ainda não verificadas, e as encerradaas são as que ja estao completed e foram previamente verificadas, já não estando ativas
  const filteredCampaigns = createdCampaigns.filter((campaign) => {
    if (filterActive) {
      return (
        campaign.is_active || (!campaign.is_active && !campaign.is_verified)
      );
    } else {
      return !campaign.is_active && campaign.is_completed;
    }
  });

  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

  const hasCampaignsToShow = filteredCampaigns.length > 0;

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

  const navigateToCampaign = (campaignId) => {
    return () => {
      navigate(`/campaign/${campaignId}`);
    };
  };

  const handleCloseCampaignClick = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setIsCloseModalOpen(true);
  };

  const handleCancelCloseCampaign = () => {
    setIsCloseModalOpen(false);
    setSelectedCampaignId(null);
  };

  const handleConfirmCloseCampaign = async () => {
    if (!selectedCampaignId) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }
    try {
      await closeCampaign(token, selectedCampaignId);
      setIsCloseModalOpen(false);
      setSelectedCampaignId(null);
      getCampaigns();
    } catch (error) {
      alert(error || "Error closing the campaign.");
    }
  };

  useEffect(() => {
    setLoading(true);
    getProfileData();
    getCampaigns();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const goToCreateCampaign = () => {
    navigate("/create-campaign");
  };

  const toggleFilter = () => {
    setFilterActive(!filterActive);
    setCurrentPage(1);
    setCampaignTitle(filterActive ? "Ended Campaigns" : "Active Campaigns"); // Altera o título conforme o filtro
  };

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  return (
    <div>
      {loading && <LoadingScreen />}
      {!loading && (
        <div className="fade-in">
          <CampaignCreatorLayout>
            <div className="flex flex-row items-start justify-start p-8 gap-8">
              <div className="w-1/4 text-[#303934]">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={profileIcon}
                    alt="profile-icon"
                    className="w-40 h-40"
                  />
                  <div className="text-center">
                    <label className="font-bold text-3xl">
                      {profileData.username}
                    </label>
                    <label className="block font-semibold text-xl">
                      {profileData.first_name} {profileData.last_name}
                    </label>
                    <label className="text-lg">
                      Joined: {formatDate(profileData.date_joined)}
                    </label>
                  </div>
                  <button
                    className="bg-[#CA0404] rounded-md text-white font-semibold px-4 py-2 text-lg"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete Account
                  </button>
                  <button
                    className="bg-[#5B8C5A] rounded-md text-white font-semibold px-6 py-2 text-lg"
                    onClick={goToCreateCampaign}
                  >
                    CREATE CAMPAIGN
                  </button>
                </div>
              </div>

              <div className="w-3/4 flex flex-col gap-6">
                {/*Título e botão ao alternar entre Ativas e Fechadas*/}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-[#303934]">
                    {campaignTitle}
                  </h1>
                  <button
                    className="bg-[#5B8C5A] text-white px-4 py-2 rounded-md"
                    onClick={toggleFilter}
                  >
                    {filterActive
                      ? "Show Ended Campaigns"
                      : "Show Active Campaigns"}
                  </button>
                </div>
                {filteredCampaigns.length > 0 ? (
                  currentCampaigns.map((campaign) => {
                    const progressPercentage =
                      (campaign.current_amount / campaign.goal) * 100;

                    const campaignImage =
                      campaign.images && campaign.images[0]?.image;

                    // Verifica se a campanha está por verificar (nova)
                    const isWaitingForVerification =
                      !campaign.is_verified && !campaign.is_active;

                    return (
                      <div
                        key={campaign.id}
                        className="relative mb-8 mr-4 w-full h-64 flex flex-col items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                        onClick={
                          isWaitingForVerification
                            ? null
                            : navigateToCampaign(campaign.id)
                        } // Se estiver esperando verificação, não redireciona
                        style={{
                          backgroundImage: campaignImage
                            ? `url(http://127.0.0.1:8000${campaignImage})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-6">
                          <div className="flex flex-col items-center">
                            <label className="font-semibold text-4xl text-white">
                              {campaign.title}
                            </label>
                          </div>
                          <div className="w-full">
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
                          <div className="flex justify-between mt-2 text-sm text-gray-200">
                            <span>
                              {`Raised: ${campaign.current_amount.toFixed(
                                2
                              )}€ / ${campaign.goal.toFixed(
                                2
                              )}€ (${progressPercentage.toFixed(2)}%)`}
                            </span>
                            <span className="text-md">
                              Deadline: {formatDate(campaign.end_date)}
                            </span>
                          </div>
                          {/*Mostrar botão de concluir nas ativas, waiting nas por verificar e ended nas encerradas*/}
                          {filterActive ? (
                            campaign.is_verified ? (
                              <button
                                className="bg-[#CA0404] text-white font-semibold px-4 py-2 rounded-md mt-4"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseCampaignClick(campaign.id);
                                }}
                              >
                                Conclude Campaign
                              </button>
                            ) : (
                              <span className="text-center bg-[#7B241C] text-white px-4 py-2 rounded-md mt-4">
                                Waiting on verification by the Administration
                              </span>
                            )
                          ) : (
                            <span className="text-center bg-[#7B241C] text-white px-4 py-2 rounded-md mt-4">
                              Ended
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <label className="text-center text-lg text-gray-500">
                    {filterActive
                      ? "No active campaigns available."
                      : "No ended campaigns available."}
                  </label>
                )}
                {hasCampaignsToShow && (
                  <div className="mb-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>

            {/*Confirmar apagar a conta*/}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
                <div className="bg-[#f1f5f0] p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                  <h2 className="text-2xl font-semibold mb-4 text-[#516158]">
                    Are you sure you want to delete your account?
                  </h2>
                  <div className="flex justify-center space-x-12">
                    <button
                      className="bg-[#34A77F] text-white px-6 py-2 rounded-md hover:bg-[#2e8063] text-xl"
                      onClick={handleDeleteAccount}
                    >
                      Yes, I want to delete my account
                    </button>
                    <button
                      className="bg-[#CA0404] text-white px-6 py-2 rounded-md hover:bg-red-700 text-xl font-semibold"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      No, I want to stay with you
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isCloseModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
                <div className="bg-[#f1f5f0] p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                  <h2 className="text-2xl font-semibold mb-4 text-[#516158]">
                    Are you sure you want to end this cause so soon?
                  </h2>
                  <div className="flex justify-center space-x-12">
                    <button
                      className="bg-[#34A77F] text-white px-6 py-2 rounded-md hover:bg-[#2e8063] text-xl"
                      onClick={handleConfirmCloseCampaign}
                    >
                      Yes, I want to end this cause.
                    </button>
                    <button
                      className="bg-[#CA0404] text-white px-6 py-2 rounded-md hover:bg-red-700 text-xl font-semibold"
                      onClick={handleCancelCloseCampaign}
                    >
                      No, I will continue gathering hope!
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CampaignCreatorLayout>
        </div>
      )}
    </div>
  );
}

export default CampaignCreatorProfile;
