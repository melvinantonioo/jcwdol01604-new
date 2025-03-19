"use client";
import { useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";
import Button from "@/utils/Button";

const ResendVerificationButton = () => {
    const [loading, setLoading] = useState(false);

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/profile/resend-verification");
            Swal.fire("Berhasil", response.data.message, "success");
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "Gagal mengirim ulang verifikasi", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            label="Kirim Ulang Verifikasi"
            onClick={handleResendVerification}
            disabled={loading}
        />
    );
};

export default ResendVerificationButton;
