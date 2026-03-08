
import { API } from "../utils/api";


export const register = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};