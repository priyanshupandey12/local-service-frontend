
import axios from "axios";
import useAuthStore from "../store/authStore";
const API_URL = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: API_URL + "/api/v1",
  withCredentials: true, 
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export { API};