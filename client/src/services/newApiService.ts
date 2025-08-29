import axios from "axios";

type Role = "user" | "instructor" | "admin";

const roleConfigs = {
  user: {
    tokenKey: "usersToken",
    refreshUrl: "/users/refresh-token",
    loginUrl: "/users/login",
  },
  instructor: {
    tokenKey: "instructorsToken",
    refreshUrl: "/instructors/refresh-token",
    loginUrl: "/instructors/login",
  },
  admin: {
    tokenKey: "adminToken",
    refreshUrl: "/admin/refresh-token",
    loginUrl: "/admin/login",
  },
};

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const role = (config.headers?.["X-Role"] as Role) || "user";
  const token = localStorage.getItem(roleConfigs[role].tokenKey);
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const role = (originalRequest.headers?.["X-Role"] as Role) || "user";
    const { tokenKey, refreshUrl, loginUrl } = roleConfigs[role];

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post<{ token: string }>(
          `http://localhost:3000/api${refreshUrl}`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;
        localStorage.setItem(tokenKey, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(tokenKey);
        window.location.href = loginUrl;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
