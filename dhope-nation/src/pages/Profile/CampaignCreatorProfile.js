import React, { useEffect, useState } from "react";
import { getCampaignCreatorProfile, getCampaignsByCreator } from "../api/Campaign";

function CampaignCreatorProfile() {
  const [user, setUser] = useState(null); // Dados do criador de campanha
  const [campaigns, setCampaigns] = useState([]); // Lista de campanhas
  const [loading, setLoading] = useState(true); // Indicador de carregamento
  const [error, setError] = useState(null); // Indicador de erro

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token de autenticação não encontrado.");
        setLoading(false);
        return;
      }

      try {
        //Dados do criador de campanha
        const userProfileResponse = await getCampaignCreatorProfile(token);
        setUser(userProfileResponse.data);

        //Campanhas criadas pelo criador
        const campaignsResponse = await getCampaignsByCreator(token);
        setCampaigns(campaignsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setError("Ocorreu um erro ao carregar os dados.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#B9D3B4] min-h-screen flex flex-col items-center py-8">
      {/* Profile Section */}
      <div className="w-[80%] flex flex-col items-center mb-8">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || "https://via.placeholder.com/150"} // Imagem do criador
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-[#2D2D2D]"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#2D2D2D]">{user.name}</h2>
            <p className="text-md text-[#4A4A4A]">Username: {user.username}</p>
            <p className="text-sm text-[#4A4A4A]">Joined: {user.join_date}</p>
          </div>
        </div>
        <button className="mt-4 bg-[#D9534F] text-white px-6 py-2 rounded-md shadow-md">
          Delete Account
        </button>
      </div>

      {/* Create Campaign Button */}
      <div className="w-[80%] mb-6">
        <button className="w-full bg-[#8FB98F] text-white text-lg py-4 rounded-md shadow-md font-bold">
          CREATE CAMPAIGN
        </button>
      </div>

      {/* Campaigns List */}
      <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white shadow-md rounded-lg overflow-hidden relative"
          >
            {/* Image Section */}
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: `url(${campaign.image || "https://via.placeholder.com/300x150"})` }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">{campaign.name}</h3>
                  <p className="text-sm">Goal: {campaign.goal}€</p>
                  <p className="text-xs">Deadline: {campaign.deadline}</p>
                </div>
              </div>
            </div>

            {/* Manage Campaign Section */}
            <div className="p-4 flex flex-col items-center">
              <button className="bg-[#8FB98F] text-white py-2 px-4 rounded-md shadow-md w-full mb-4">
                Manage Campaign
              </button>
              <div className="w-full">
                <p className="text-sm text-[#2D2D2D] mb-1">
                  {campaign.raised}€ raised
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#8FB98F] h-3 rounded-full"
                    style={{
                      width: `${
                        (campaign.raised / campaign.goal) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignCreatorProfile;