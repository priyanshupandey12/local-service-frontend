import { API } from "../utils/api";

export const createProviderProfile = async (data) => {
  const response = await API.post("/provider/profile", data);
  return response.data;
};

export const updateProviderProfile = async (data) => {
  const response = await API.patch("/provider/profile", data);
  return response.data;
};

export const toggleAvailability = async () => {
  const response = await API.patch("/provider/availability");
  return response.data;
};

export const getProviderProfile = async () => {
  const response = await API.get("/provider/profile");
  return response.data;
};

export const getAllProviders = async (params) => {
  const response = await API.get("/provider", { params });
  return response.data;
};

export const getProviderById = async (id) => {
  const response = await API.get(`/provider/${id}`);
  return response.data;
};