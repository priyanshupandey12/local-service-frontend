import { API } from "../utils/api";

export const createBooking = async (data) => {
  const response = await API.post("/booking", data);
  return response.data;
};

export const getCustomerBookings = async () => {
  const response = await API.get("/booking/customer");
  return response.data;
};

export const getProviderBookings = async () => {
  const response = await API.get("/booking/provider");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await API.get(`/booking/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id, data) => {
  const response = await API.patch(`/booking/${id}/status`, data);
  return response.data;
};

export const updateBookingImages = async (id, data) => {
  const response = await API.patch(`/booking/${id}/images`, data);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await API.patch(`/booking/${id}/cancel`);
  return response.data;
};

export const rescheduleBooking = async (id, data) => {
  const response = await API.patch(`/booking/${id}/reschedule`, data);
  return response.data;
};

export const updateJobNotes = async (id, data) => {
  const response = await API.patch(`/booking/${id}/notes`, data);
  return response.data;
};