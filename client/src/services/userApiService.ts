import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_LINK,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("usersToken");
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post<{ token: string }>(
          "http://localhost:3000/api/users/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;
        console.log(newToken)
        localStorage.setItem("usersToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return userApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("usersToken");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/users/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default userApi;
