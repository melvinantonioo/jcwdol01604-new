"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifying email...");

    useEffect(() => {
        if (token) {
            axiosInstance.get(`/auth/verify-email?token=${token}`)
                .then((res) => {
                    setMessage(res.data.message);
                    Swal.fire("Success!", "Email berhasil diverifikasi!", "success").then(
                        () => {
                            window.location.href = "/login";
                        }
                    );
                })
                .catch((err) => {
                    console.log("Error response:", err.response?.data || err); // Debugging error
                    setMessage("Verifikasi gagal atau token tidak valid.");
                    Swal.fire("Error!", "Verifikasi gagal.", "error");
                });
        }
    }, [token]);

    return <div className="text-center mt-10">{message}</div>;
};

export default VerifyEmail;