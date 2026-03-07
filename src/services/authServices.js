
import { API } from "../utils/api";
import useAuthStore from "../store/authStore";

export const register = async (data) => {
  const response = await API.post("/auth/register", data);
    const { token, userId, role } = response.data;
    useAuthStore.getState().setAuth(userId, role, token);
  return response.data;
};

export const login = async (data) => {
  const response = await API.post("/auth/login", data);
   const { token, userId, role } = response.data;
    useAuthStore.getState().setAuth(userId, role, token);
  return response.data;
};

export const logout = async () => {
   useAuthStore.getState().clearAuth();
};

export const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};