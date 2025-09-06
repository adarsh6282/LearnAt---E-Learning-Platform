import axios from "axios";

type Role = "user" | "instructor" | "admin";

interface RoleConfig {
  tokenKey: string;
  refreshUrl: string;
  loginUrl: string;
}

const roleConfigs: Record<Role, RoleConfig> = {
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

export function createApi(role: Role) {
  const config = roleConfigs[role];

  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_LINK,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((reqConfig) => {
    const token = localStorage.getItem(config.tokenKey);
    reqConfig.headers = reqConfig.headers || {};
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post<{ token: string }>(
            `http://localhost:3000/api${config.refreshUrl}`,
            {},
            { withCredentials: true }
          );

          const newToken = res.data.token;
          localStorage.setItem(config.tokenKey, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem(config.tokenKey);
          if (!window.location.pathname.includes(config.loginUrl)) {
            window.location.href = config.loginUrl;
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
