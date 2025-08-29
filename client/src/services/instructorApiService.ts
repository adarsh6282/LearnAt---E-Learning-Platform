import axios from "axios";
import { instructorRefreshTokenS } from "./instructor.services";

const instructorApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_LINK,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instructorApi.interceptors.request.use((config) => {
  const latestToken = localStorage.getItem("instructorsToken");
  config.headers = config.headers || {};

  if (latestToken) {
    config.headers.Authorization = `Bearer ${latestToken}`;
  }

  return config;
});


instructorApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await instructorRefreshTokenS()

        const newToken = res.data.token;
        localStorage.setItem("instructorsToken", newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return instructorApi(originalRequest);
      } catch (err) {
        localStorage.removeItem("instructorsToken");
        window.location.href = "/instructors/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instructorApi;
