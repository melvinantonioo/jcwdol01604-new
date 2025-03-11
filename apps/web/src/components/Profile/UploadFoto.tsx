"use client"
import React, { useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";

const UploadProfilePicture = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return Swal.fire("Error", "Pilih file terlebih dahulu", "error");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/profile/upload", formData);
            Swal.fire("Success", response.data.message, "success");
        } catch (error) {
            console.error("Upload error:", error);
            Swal.fire("Error", "Gagal mengunggah foto", "error");
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Foto</button>
        </div>
    );
};

export default UploadProfilePicture;