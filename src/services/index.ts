import { authStorage } from "@/lib/utils/authUtils";
import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    toast.error(error.response.data.message);
    if (error.status === 401) {
      authStorage.clearTokens();
    }
    throw error;
  }
);

export default instance;
