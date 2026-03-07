import { API } from "../utils/api";

export const getPublicCategories = async () => {
  const response = await API.get("/categories");
  return response.data;
};