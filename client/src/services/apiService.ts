import axios from "axios";

const axiosInstance=axios.create({
    baseURL:"http://localhost:3000/",
    headers:{
        "Content-Type":"application/json"
    }
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403 && message.includes("blocked")) {
      localStorage.removeItem("usersToken");
      localStorage.removeItem("usersEmail");
      window.location.href = "/users/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance