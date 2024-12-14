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
      `http://127.0.0.1:8000/campaigns?id=${campaignId}`,
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

export const getTopDonations = async (token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/top-donations`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "*/*",
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Erro ao buscar campanhas com maiores doações");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLatestDonations = async (token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/last-donations/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "*/*",
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Erro ao buscar campanhas com últimas doações");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getNewCampaigns = async (token) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/recently-campaigns-create/`,
      {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "*/*",
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Erro ao buscar campanhas mais recentes");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const postCampaignImages = async (token, campaignId, data) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/campaign/upload-image/`,
      data,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: {
          campaign_id: campaignId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading campaign images:", error);
    throw error;
  }
};

export const getCampaignImages = async (campaignId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/image/campaigns`, {
      params: {
        id: campaignId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading campaign images:", error);
    throw error;
  }
};

export const getAllCampaigns = async (token) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/all-campaigns/", {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "*/*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
  }
};

export const getCampaignsByCategory = async (token, category) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/campaigns-by-category/`,
      {
        category: category,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns by category:", error);
    throw error;
  }
};
