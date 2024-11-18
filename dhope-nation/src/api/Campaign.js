import axios from "axios";

export const createCampaign = async (token, data) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/campaign/create/",
      data,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro na criação da campanha:", error);
    throw error;
  }
};

export const getCampaignById = async (campaignId, token) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/campaign/get?id=${campaignId}`,
      {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "*/*",
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Erro ao buscar os dados da campanha");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const donateToCampaign = async (data, authToken) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/campaign/donate/",
      data,
      {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao processar doação:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
