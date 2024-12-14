import { useEffect, useState } from "react";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import profileIcon from "../../assets/images/profile-big-icon.png";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  getCampaignCreatorProfile,
  deleteProfile,
  getCampaignsByCreator, // Importar a função para buscar campanhas
} from "../../api/Profile.js";
import { getCampaignImages } from "../../api/Campaign.js";
import "../../styles/Profile.css";

function CampaignCreatorProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [createdCampaigns, setCreatedCampaigns] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controle do modal de exclusão

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
      setCreatedCampaigns(response.data);

      // Buscar as imagens para cada campanha
      const campaignsWithImages = await Promise.all(
        response.data.map(async (campaign) => {
          const images = await getCampaignImages(campaign.id);
          return { ...campaign, images };
        })
      );

      // Atualizar o estado com as campanhas e suas imagens
      setCreatedCampaigns(campaignsWithImages);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
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

  const navigateToCampaign = (campaignId) => {
    return () => {
      navigate(`/campaign/${campaignId}`);
    };
  };

  useEffect(() => {
    getProfileData();
    getCampaigns();
  }, []);

  const goToCreateCampaign = () => {
    navigate("/create-campaign");
  };

  // Lógica para abrir e fechar o modal de confirmação de exclusão
  const handleDeleteAccountClick = () => {
    setIsDeleteModalOpen(true); // Abre o modal de confirmação de exclusão
  };

  const handleCancelDeleteAccount = () => {
    setIsDeleteModalOpen(false); // Fecha o modal de confirmação de exclusão
  };

  const handleConfirmDeleteAccount = () => {
    handleDeleteAccount(); // Chama a função para excluir a conta
    setIsDeleteModalOpen(false); // Fecha o modal após confirmar
  };

  return (
    <CampaignCreatorLayout>
      <div className="flex flex-row items-start justify-start p-8 gap-8">
        {/* Perfil */}
        <div className="w-1/4 text-[#303934]">
          <div className="flex flex-col items-center gap-4">
            <img
              src={profileIcon}
              alt="profile-icon"
              className="w-40 h-40"
            />
            <div className="text-center">
              <label className="font-bold text-3xl">{profileData.username}</label>
              <label className="block font-semibold text-xl">
                {profileData.first_name} {profileData.last_name}
              </label>
              <label className="text-lg">
                Joined: {formatDate(profileData.date_joined)}
              </label>
            </div>
            <button
              className="bg-[#CA0404] rounded-md text-white font-semibold px-4 py-2 text-lg"
              onClick={handleDeleteAccountClick} // Botão para excluir a conta
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

        {/* Campanhas */}
        <div className="w-3/4 flex flex-col gap-6">
          {createdCampaigns.length > 0 ? (
            createdCampaigns.map((campaign) => {
              const progressPercentage =
                (campaign.current_amount / campaign.goal) * 100;

              // Obtendo a URL da primeira imagem da campanha
              const campaignImage = campaign.images && campaign.images[0]?.image;

              return (
                <div
                  key={campaign.id}
                  className="relative mb-8 mr-4 w-full h-64 flex flex-col items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                  onClick={navigateToCampaign(campaign.id)}
                  style={{
                    backgroundImage: campaignImage
                      ? `url(http://127.0.0.1:8000${campaignImage})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Conteúdo da campanha */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-6">
                    <div className="flex flex-col items-center">
                      {/* Nome da campanha */}
                      <label className="font-semibold text-4xl text-white">
                        {campaign.title}
                      </label>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-7 mt-4">
                      <div
                        className="bg-[#C8E5B3] h-7 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    {/* Detalhes do progresso */}
                    <div className="flex justify-between mt-2 text-sm text-gray-200">
                      <span>
                        {`Raised: ${campaign.current_amount.toFixed(
                          2
                        )}€ / ${campaign.goal.toFixed(2)}€ (${progressPercentage.toFixed(2)}%)`}
                      </span>

                      {/* Deadline à esquerda da barra de progresso */}
                      <span className="text-md">
                        Deadline: {formatDate(campaign.end_date)}
                      </span>
                    </div>

                    {/* Botão Encerrar */}
                    <button
                      className="bg-[#CA0404] text-white font-semibold px-4 py-2 rounded-md mt-4"
                      onClick={() => console.log(`Encerrar campanha ${campaign.id}`)}
                    >
                      Encerrar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <label className="text-center text-lg text-gray-500">
              No campaigns created yet.
            </label>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão de Conta */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-[#f1f5f0] p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold mb-4 text-[#516158]">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-center space-x-12">
              <button
                className="bg-[#34A77F] text-white px-6 py-2 rounded-md hover:bg-[#2e8063] text-xl "
                onClick={handleConfirmDeleteAccount}
              >
                Yes, I want to delete my account
              </button>
              <button
                className="bg-[#CA0404] text-white px-6 py-2 rounded-md hover:bg-red-700 text-xl font-semibold"
                onClick={handleCancelDeleteAccount}
              >
                No, I want to stay with you
              </button>
            </div>
          </div>
        </div>
      )}
    </CampaignCreatorLayout>
  );
}

export default CampaignCreatorProfile;