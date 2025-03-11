"use client";
import { useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";
import ProfileLayout from "@/layouts/ProfileLayouts";
import Button from "@/utils/Button";

const EditProfile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }

            await axiosInstance.put("/profile/update", formData);
            Swal.fire("Success", "Profile updated successfully", "success");
        } catch (error) {
            Swal.fire("Error", "Failed to update profile", "error");
        }
    };

    return (
        <ProfileLayout>
            <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
                <div className="flex flex-col gap-4">
                    <label>Name:</label>
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        className="border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Profile Picture:</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />

                    <Button label="Save Changes" onClick={handleSubmit} />
                </div>
            </div>
        </ProfileLayout>
    );
};

export default EditProfile;
