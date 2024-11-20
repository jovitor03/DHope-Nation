import { useEffect, useState } from "react";
import HomepageLayout from "../layouts/DonorLayout";
import homepageSlogan from "../assets/images/homepage-slogan.png"; // Importa a imagem desejada

function HomePage() {
  const [topDonations, setTopDonations] = useState([]);
  const [latestDonations, setLatestDonations] = useState([]);
  const [newCampaigns, setNewCampaigns] = useState([]);

  useEffect(() => {
    // Simulação de fetch das informações (substitua pelas APIs reais)
    setTopDonations([
      { name: "Campaign Name 1", value: "+0.50€" },
      { name: "Campaign Name 2", value: "+100.00€" },
      { name: "Campaign Name 3", value: "+56.87€" },
    ]);
    setLatestDonations([
      { name: "Campaign Name 1", value: "+50.70€" },
      { name: "Campaign Name 2", value: "+1 200.00€" },
      { name: "Campaign Name 3", value: "+5 605.73€" },
    ]);
    setNewCampaigns([
      { name: "Campaign Name 1", goal: "20 222.50€" },
      { name: "Campaign Name 2", goal: "3 012.00€" },
      { name: "Campaign Name 3", goal: "88 758.99€" },
    ]);
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
        <Section title="Top Donations - October" data={topDonations} />

        {/* Latest Donations */}
        <Section title="Latest Donations" data={latestDonations} />

      </div>
    </HomepageLayout>
  );
}

function Section({ title, data, isCampaigns = false }) {
  return (
    <div className="mb-6 h-[35vh] px-8 py-6">
      <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">{title}</h2>
      <div className="grid grid-cols-3 gap-6 h-full">
        {data.map((item, index) => (
          <div
            key={index}
            //Aqui colocar caminho da campanha escolhida
            // onClick={() => window.location.href = "/profile"}
            className="bg-[#E4F0EA] rounded-md p-4 shadow-md text-center flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-[#2D2D2D] mb-6 text-center">
              {item.name}
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