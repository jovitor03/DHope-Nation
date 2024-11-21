import { useEffect, useState } from "react";
import { getTopDonations } from "../api/Campaign";
import { getLatestDonations } from "../api/Campaign";
import { getNewCampaigns } from "../api/Campaign";
import HomepageLayout from "../layouts/DonorLayout";
import homepageSlogan from "../assets/images/homepage-slogan.png"; // Importa a imagem desejada

function HomePage() {
  const [topDonations, setTopDonations] = useState([]);
  const [latestDonations, setLatestDonations] = useState([]);
  const [newCampaigns, setNewCampaigns] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }
  
      try {
        const topDonations = await getTopDonations(token);
        setTopDonations(topDonations);
  
        const latestDonations = await getLatestDonations(token);
        setLatestDonations(latestDonations);
  
        const newCampaigns = await getNewCampaigns(token);
        setNewCampaigns(newCampaigns);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
  
    fetchAllData();
  }, []);

  return (
    <HomepageLayout>
        <div className="w-full h-[35vh] mt-3">
        <img
          src={homepageSlogan}
          alt="Homepage Slogan"
          className="w-full object-cover h-full"
        />
        </div>
        <div className="bg-[#A0C0A2] min-h-screen px-8 pb-6">

        {/* New Campaigns */}
        <Section title="New Campaigns" data={newCampaigns} isCampaigns={true} />

        {/* Top Donations */}
        <Section title="Top Donations - October" data={topDonations} isCampaigns={true} />

        {/* Latest Donations */}
        <Section title="Latest Donations" data={latestDonations} isCampaigns={true} />

      </div>
    </HomepageLayout>
  );
}

function Section({ title, data, isCampaigns = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="mb-6 h-[35vh] px-8 py-6">
        <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">{title}</h2>
        <p className="text-center text-[#4A4A4A]">No data available.</p>
      </div>
    );
  }
  return (
    <div className="mb-6 h-[35vh] px-8 py-6">
      <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">{title}</h2>
      <div className="grid grid-cols-3 gap-6 h-full">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              // Redireciona para o caminho da campanha com base no ID
              window.location.href = `/campaigns/${item.key}`;
            }}
            className="bg-[#E4F0EA] rounded-md p-4 shadow-md text-center flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-[#2D2D2D] mb-6 text-center">
              {item.title}
            </h3>
            {isCampaigns ? (
              <p className="text-lg text-[#4A4A4A] font-medium">Goal: {item.goal}</p>
            ) : (
              <p className="text-lg text-[#4A4A4A] font-medium">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;