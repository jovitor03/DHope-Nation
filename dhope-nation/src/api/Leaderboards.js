import axios from "axios";

export const getLeaderboards = async (token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/top-10-donors/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "*/*",
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Erro ao buscar os dados dos leaderboards");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLeaderboardsLast30Days = async (token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/top-10-donors-last-30-days/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "*/*",
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Erro ao buscar os dados dos leaderboards dos últimos 30 dias");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
