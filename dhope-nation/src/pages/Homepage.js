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

  
  function Section({ title, data, isCampaigns = false }) {
    const [images, setImages] = useState({}); // Estado para armazenar imagens associadas às campanhas
  
    useEffect(() => {
      const fetchImages = async () => {
        if (!data || data.length === 0) return; // Sai imediatamente se não houver dados
  
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
          }
  
          const imagesMap = {};
          for (const campaign of data) {
            const campaignImages = await getCampaignImages(campaign.id); //Imagens para cada campanha
            if (campaignImages && campaignImages.length > 0) {
              //URL completo da primeira imagem no mapa
              imagesMap[campaign.id] = `http://127.0.0.1:8000${campaignImages[0].image}`;
            }
          }
          setImages(imagesMap); //Atualiza o estado com as imagens
        } catch (error) {
          console.error("Erro ao buscar imagens das campanhas:", error);
        }
      };
  
      fetchImages(); // Chama a função para buscar imagens
    }, [data]); // useEffect será executado sempre que "data" mudar
  
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
          {data.slice(0, 3).map((item, index) => ( // Limita a exibição a no máximo 3 campanhas
            <div
              key={index}
              onClick={() => {
                window.location.href = `/campaign/${item.id}`; //vai para a página da campanha correspondente
              }}
              className="rounded-lg shadow-lg relative overflow-hidden"
              style={{
                backgroundImage: `url(${images[item.id] || ""})`, // Define imagem como plano de fundo
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: images[item.id] ? "transparent" : "#E4F0EA", // Cor de fallback se a imagem não estiver disponível
              }}
            >
             {/* Camada de sobreposição */}
            <div
              className="rounded-md p-10 shadow-md text-center flex flex-col justify-center relative"
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                background: "rgba(0, 0, 0, 0.18)", // Transparência da sobreposição
                pointerEvents: "none", //Para que a camada não interfira em cliques
              }}
            >
              <h3 className="text-4xl font-bold text-white mb-2">{item.title}</h3>
              {isCampaigns ? (
                <><p className="text-2xl text-white font-medium"> </p><p className="text-xl text-white font-medium"> Goal: </p><p className="text-xl text-white font-medium"> {item.goal} </p></>
              ) : (
                <p className="text-3xl text-white font-medium">{item.value}</p>
              )}
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
        <Section title="New Campaigns" data={newCampaigns} isCampaigns={true} />
        <Section title="Top Donations - October" data={topDonations} isCampaigns={true} />
        <Section title="Latest Donations" data={latestDonations} isCampaigns={true} />
      </div>
    </Layout>
  );
}

export default HomePage;
