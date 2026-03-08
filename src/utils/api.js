
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: API_URL + "/api/v1",
});


API.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("auth"))?.state?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export { API};