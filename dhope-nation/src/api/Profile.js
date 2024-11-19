import axios from "axios";

export const getProfile = (token) => {
  return axios.get("http://127.0.0.1:8000/profile/donator/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const deleteProfile = (token) => {
  return axios.delete("http://127.0.0.1:8000/donator/delete/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};
