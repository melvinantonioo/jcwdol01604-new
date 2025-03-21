"use client";
import React, { useState } from "react";
import Modal from "@/components/Modals/Modal";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: {
        id: number;
        name: string;
        email: string;
        emailVerified: boolean;
        profilePicture?: string;
    };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile }) => {
    const [formData, setFormData] = useState({
        name: profile.name,
        email: profile.email,
        password: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        try {
            
            let profilePictureUrl = profile.profilePicture;
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await axiosInstance.post("/profile/upload", formData);
                profilePictureUrl = uploadRes.data.profilePicture;
            }

            const response = await axiosInstance.put("/profile/update", {
                ...formData,
                profilePicture: profilePictureUrl,
            });

            Swal.fire("Success", response.data.message, "success").then(() => {
                onClose(); 
                window.location.reload(); 
            });
        } catch (error) {
            Swal.fire("Error", "Gagal memperbarui profil", "error");
            console.error("Update error:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSave}
            title="Edit Profile"
            actionLabel="Save Changes"
            body={
                <div className="flex flex-col gap-4">
                    
                    <label className="font-medium">Upload Foto Profil:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="border rounded p-2" />

                    
                    <label className="font-medium">Nama:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded p-2"
                    />

                    <label className="font-medium">Password (Opsional):</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border rounded p-2"
                    />
                </div>
            }
        />
    );
};

export default EditProfileModal;
