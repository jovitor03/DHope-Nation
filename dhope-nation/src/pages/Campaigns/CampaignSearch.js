import { useEffect, useState } from "react";
import { getAllCampaigns } from "../../api/Campaign";
import { getDonorProfile } from "../../api/Profile";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import DonorLayout from "../../layouts/DonorLayout";

const CampaignSearch = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getAllCampaigns(
          localStorage.getItem("authToken")
        );
        setCampaigns(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
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

    fetchProfileData();
  }, []);

  const Layout = profileData.is_donor ? DonorLayout : CampaignCreatorLayout;

  return (
    <Layout>
      <h1>Campanhas</h1>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.title}</li>
        ))}
      </ul>
    </Layout>
  );
};

export default CampaignSearch;
