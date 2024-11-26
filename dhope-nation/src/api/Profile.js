import axios from "axios";

export const getDonorProfile = (token) => {
  return axios.get("http://127.0.0.1:8000/profile/donator/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const deleteProfile = (token) => {
  return axios.delete("http://127.0.0.1:8000/profile/donator/delete/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const updateLevel = (token, level) => {
  return axios.post("http:/127.0.0.1:8000/profile/donator/edit/", {
    level: level,
  });
};