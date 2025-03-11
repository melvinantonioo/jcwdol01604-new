import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstanceGoogle = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000",
    withCredentials: true,
});

axiosInstanceGoogle.interceptors.request.use(
    async (config) => {
        const session = await getSession(); // Ambil token dari NextAuth
        const token = session?.backendAccessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstanceGoogle;
