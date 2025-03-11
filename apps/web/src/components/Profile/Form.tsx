"use client";
import React, { useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";

const UpdateProfileForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put("/profile/update", formData);
            Swal.fire("Success", response.data.message, "success");
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire("Error", "Gagal memperbarui profil", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nama" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password (Opsional)" onChange={handleChange} />
            <button type="submit">Update Profil</button>
        </form>
    );
};

export default UpdateProfileForm;
