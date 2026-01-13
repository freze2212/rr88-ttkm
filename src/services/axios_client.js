import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://192.168.16.83:1236";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Tự động thêm token vào header nếu có
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || "An error occurred",
        status: error.response.status,
      });
    } else if (error.request) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: null,
      });
    } else {
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        status: null,
      });
    }
  }
);

export default axiosInstance;
