import { API } from "../utils/api";

export const getProviders = async () => {
  const response = await API.get("/admin/providers");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await API.get("/admin/bookings");
  return response.data;
};

export const approveProvider = async (id, data) => {
  const response = await API.patch(`/admin/providers/${id}/approve`, data);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await API.get("/admin/categories");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await API.post("/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await API.patch(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/admin/categories/${id}`);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await API.get("/admin/reviews");
  return response.data;
};

export const toggleReviewVisibility = async (id) => {
  const response = await API.patch(`/admin/reviews/${id}/visibility`);
  return response.data;
};
export const deleteReview = async (id) => {
  const response = await API.delete(`/admin/reviews/${id}`);
  return response.data;
};

export const deleteProvider = async (id) => {
  const response = await API.delete(`/admin/providers/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};