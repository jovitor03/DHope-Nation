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
        const campaignsWithImages = await Promise.all(
          campaigns.map(async (campaign) => {
            const images = await getCampaignImages(campaign.id);
            return { ...campaign, images };
          })
        );
        setNewCampaigns(campaignsWithImages);

        const topDonations = await getTopDonations(token);
        const topDonationsWithImages = await Promise.all(
          topDonations.map(async (donation) => {
            const images = await getCampaignImages(donation.campaign);
            return { ...donation, images };
          })
        );
        setTopDonations(topDonationsWithImages);

        const latestDonations = await getLatestDonations(token);
        const latestDonationsWithImages = await Promise.all(
          latestDonations.map(async (donation) => {
            const images = await getCampaignImages(donation.campaign);
            return { ...donation, images };
          })
        );
        setLatestDonations(latestDonationsWithImages);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const navigateToCampaign = (campaignId) => () => {
    window.location.href = `/campaign/${campaignId}`;
  };

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
      <div className="flex flex-col">
        <div className="ml-24 mt-8 mr-24">
          <h2 className="text-[#062134] font-semibold text-3xl">
            New Campaigns
          </h2>
          <div className="flex flex-row justify-between space-x-12 mt-2">
            {newCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="relative mb-8 mr-4 w-1/3 h-64 flex flex-col items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                onClick={navigateToCampaign(campaign.id)}
              >
                <img
                  src={"http://127.0.0.1:8000" + campaign.images[0].image}
                  alt={campaign.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-center">
                  <h3 className="text-3xl font-bold mb-2">{campaign.title}</h3>
                  <p className="text-2xl mb-2">
                    Goal: {campaign.goal.toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-24 mt-8 mr-24">
          <h2 className="text-[#062134] font-semibold text-3xl">
            Top Donations - Last 30 Days
          </h2>
          <div className="flex flex-row justify-between space-x-12 mt-2">
            {topDonations.slice(0, 3).map((donation) => (
              <div
                key={donation.id}
                className="relative mb-8 mr-4 w-1/3 h-64 flex flex-col items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                onClick={navigateToCampaign(donation.campaign)}
              >
                <img
                  src={"http://127.0.0.1:8000" + donation.images[0].image}
                  alt={donation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-center">
                  <h3 className="text-3xl font-bold mb-2">{donation.title}</h3>
                  <p className="text-2xl mb-2">
                    +{donation.amount.toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-24 mt-8 mr-24">
          <h2 className="text-[#062134] font-semibold text-3xl">
            Last Donations
          </h2>
          <div className="flex flex-row justify-between space-x-12 mt-2">
            {latestDonations.slice(0, 3).map((donation) => (
              <div
                key={donation.id}
                className="relative mb-8 mr-4 w-1/3 h-64 flex flex-col items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                onClick={navigateToCampaign(donation.campaign)}
              >
                <img
                  src={"http://127.0.0.1:8000" + donation.images[0].image}
                  alt={donation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-center">
                  <h3 className="text-3xl font-bold mb-2">{donation.title}</h3>
                  <p className="text-2xl mb-2">
                    +{donation.amount.toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
