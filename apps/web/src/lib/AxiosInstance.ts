import axios, { AxiosInstance } from "axios";
import { getCookie } from "cookies-next";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getCookie("access_token");
        console.log("🔥 Axios Token:", token);

        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }

        return config;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;