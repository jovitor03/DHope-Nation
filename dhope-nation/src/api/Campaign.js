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
