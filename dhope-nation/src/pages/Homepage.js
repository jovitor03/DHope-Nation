import { useState, useEffect } from "react";
import DonorLayout from "../layouts/DonorLayout";
import CampaignCreatorLayout from "../layouts/CampaignCreatorLayout";
import {
  getTopDonations,
  getLatestDonations,
  getNewCampaigns,
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
        console.log("Campanhas carregadas:", campaigns);
        setNewCampaigns(campaigns);

        const donations = await getTopDonations(token);
        console.log("Doações principais carregadas:", donations);
        setTopDonations(donations);

        const latest = await getLatestDonations(token);
        console.log("Últimas doações carregadas:", latest);
        setLatestDonations(latest);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Componente de seção
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
                window.location.href = `/campaigns/${item.key}`;
              }}
              className="bg-[#E4F0EA] rounded-md p-4 shadow-md text-center flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold text-[#2D2D2D] mb-6 text-center">
                {item.title}
              </h3>
              {isCampaigns ? (
                <p className="text-lg text-[#4A4A4A] font-medium">
                  Goal: {item.goal}
                </p>
              ) : (
                <p className="text-lg text-[#4A4A4A] font-medium">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const Layout = userType === "Donor" ? DonorLayout : CampaignCreatorLayout;

  return (
    <Layout>
      <div className="w-full h-[35vh] mt-3">
        <img
          src={homepageSlogan}
          alt="Homepage Slogan"
          className="w-full object-cover h-full"
        />
      </div>
      <div className="bg-[#A0C0A2] min-h-screen px-8 pb-6">
        <Section title="New Campaigns" data={newCampaigns} isCampaigns={true} />
        <Section title="Top Donations - October" data={topDonations} />
        <Section title="Latest Donations" data={latestDonations} />
      </div>
    </Layout>
  );
}

export default HomePage;
