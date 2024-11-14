import axios from "axios";

export const register = (data) => {
  return axios.post("http://127.0.0.1:8000/register/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    },
  });
};

export const login = (data) => {
  return axios.post("http://127.0.0.1:8000/login/", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  });
};
