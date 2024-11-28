import axios from "axios";

export const getDonorProfile = (token) => {
  return axios.get("http://127.0.0.1:8000/profile/donor/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const getCampaignCreatorProfile = (token) => {
  return axios.get("http://127.0.0.1:8000/profile/campaign-creator/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const deleteProfile = (token) => {
  return axios.delete("http://127.0.0.1:8000/profile/donor/delete/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const updateLevel = (token, newLevel) => {
  return axios.post(
    "http://127.0.0.1:8000/profile/donor/edit/",
    {
      level: newLevel,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "*/*",
      },
    }
  );
};

export const getDonations = (token) => {
  return axios.get("http://127.0.0.1:8000/profile/donor/my-donations/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};

export const getTopDonationsFromDonor = (token) => {
  return axios.get("http://127.0.0.1:8000/profile/donor/my-top-donations/", {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "*/*",
    },
  });
};
