"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/AxiosInstance";

export const useProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosInstance.get("/profile/me");
                setProfile(data);
            } catch (err) {
                setError("Gagal mengambil data profil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, loading, error };
};
