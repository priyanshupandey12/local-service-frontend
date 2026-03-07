import { API } from "../utils/api";

export const createReview = async ( data) => {
  const response = await API.post(`/review`, data);
  return response.data;
};

export const getProviderReviews = async (providerId) => {
  const response = await API.get(`/review/provider/${providerId}`);
  return response.data;
};