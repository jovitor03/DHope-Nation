import axios from "axios";

export const getProfile = (token) => {

  return axios.get("http://127.0.0.1:8000/profile/donator/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

