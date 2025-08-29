import axios from "axios"

const adminApi=axios.create({
    baseURL:import.meta.env.VITE_BASE_LINK,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post<{ token: string }>(
          "http://localhost:3000/api/admin/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;
        console.log(newToken)
        localStorage.setItem("adminToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return adminApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi