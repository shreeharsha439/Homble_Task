import axios from "axios";

// Base URL for the API
const envBaseUrl = "https://frontend-assessment-server.onrender.com/api";

const instance = axios.create({
  baseURL: envBaseUrl,
});

// GET request function
export const getRequest = async (url, params = {}, responseType = "json") => {
  try {
    const response = await instance.get(url, {
      params,
      responseType,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// POST request function
export const postRequest = async (url, data, options) => {
  try {
    if (options && options.contentType) {
      instance.defaults.headers["Content-Type"] =
        options.contentType === "multipart/form-data"
          ? undefined
          : options.contentType;
    }
    const response = await instance.post(url, data);
    instance.defaults.headers["Content-Type"] = "application/json";
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Error handling function
const handleError = (error) => {
  // You can customize this based on how you want to handle errors
  console.error("API call failed. Error: ", error);
  throw error;
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  DASHBOARD: "/dashboard",
};

export default instance