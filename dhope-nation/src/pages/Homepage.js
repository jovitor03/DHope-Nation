import { useState, useEffect } from "react";
import DonorLayout from "../layouts/DonorLayout";
import CampaignCreatorLayout from "../layouts/CampaignCreatorLayout";
import {
  getTopDonations,
  getLatestDonations,
  getNewCampaigns,
  getCampaignImages,
} from "../api/Campaign";
import homepageSlogan from "../assets/images/homepage-slogan.png";

function HomePage() {
  const [newCampaigns, setNewCampaigns] = useState([]);
  const [topDonations, setTopDonations] = useState([]);
  const [latestDonations, setLatestDonations] = useState([]);
  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }

      try {
        const campaigns = await getNewCampaigns(token);
        setNewCampaigns(campaigns);

        const donations = await getTopDonations(token);
        setTopDonations(donations);

        const latest = await getLatestDonations(token);
        setLatestDonations(latest);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const [newCampaignsImages, setNewCampaignsImages] = useState({});
  const [topDonationsImages, setTopDonationsImages] = useState({});
  const [latestDonationsImages, setLatestDonationsImages] = useState({});

  useEffect(() => {
    const fetchImagesForCampaigns = async (campaigns, setImageState) => {
      if (!campaigns || campaigns.length === 0) return;

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token de autenticação não encontrado.");
          return;
        }

        const imagesMap = {};
        for (const campaign of campaigns) {
          const campaignImages = await getCampaignImages(campaign.id);
          if (campaignImages && campaignImages.length > 0) {
            imagesMap[
              campaign.id
            ] = `http://127.0.0.1:8000${campaignImages[0].image}`;
          }
        }
        setImageState(imagesMap);
      } catch (error) {
        console.error("Erro ao buscar imagens das campanhas:", error);
      }
    };

    if (newCampaigns.length > 0) {
      fetchImagesForCampaigns(newCampaigns, setNewCampaignsImages);
    }
    if (topDonations.length > 0) {
      fetchImagesForCampaigns(topDonations, setTopDonationsImages);
    }
    if (latestDonations.length > 0) {
      fetchImagesForCampaigns(latestDonations, setLatestDonationsImages);
    }
  }, [newCampaigns, topDonations, latestDonations]);

  // Função de navegação
  const navigateToCampaign = (id) => {
    if (id) {
      window.location.href = `/campaign/${id}`;
    } else {
      console.error("ID da campanha não encontrado.");
    }
  };

  function Section({ title, data, isCampaigns = false, images }) {
    // Retorna mensagem se não houver dados
    if (!data || data.length === 0) {
      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">{title}</h2>
          <p className="text-center text-[#4A4A4A]">No data available.</p>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">{title}</h2>
        <div className="grid grid-cols-3 gap-6">
          {data.slice(0, 3).map((item, index) => (
            <div
              key={index}
              onClick={() => navigateToCampaign(item.id)} // Vai para a página referente à campanha
              className="rounded-lg p-20 shadow-lg relative overflow-hidden"
              style={{
                backgroundImage: `url(${images[item.id] || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: images[item.id] ? "transparent" : "#E4F0EA",
              }}
            >
              {/* Camada de sobreposição */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: "rgba(0, 0, 0, 0.18)",
                  pointerEvents: "none", // Impede interferência no clique
                }}
              >
                {/* Texto */}
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  {isCampaigns ? (
                    <>
                      <p className="text-2xl text-white font-medium">Goal:</p>
                      <p className="text-xl text-white font-medium">
                        {item.goal}
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl text-white font-medium">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const Layout = userType === "Donor" ? DonorLayout : CampaignCreatorLayout;

  return (
    <Layout>
      <div className="w-full mt-3">
        <img
          src={homepageSlogan}
          alt="Homepage Slogan"
          className="w-full object-cover"
        />
      </div>

      <div className="bg-[#A0C0A2] px-8 pb-6 mt-8">
        <Section
          title="New Campaigns"
          data={newCampaigns}
          isCampaigns={true}
          images={newCampaignsImages}
        />
        <Section
          title="Top Donations - October"
          data={topDonations}
          isCampaigns={true}
          images={topDonationsImages}
        />
        <Section
          title="Latest Donations"
          data={latestDonations}
          isCampaigns={true}
          images={latestDonationsImages}
        />
      </div>
    </Layout>
  );
}

export default HomePage;
