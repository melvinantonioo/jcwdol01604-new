"use client";
import Image from "next/image";
import Button from "@/utils/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfileModal from "../Modals/EditProfile";

interface ProfileCardProps {
    profile: {
        id: number;
        name: string;
        email: string;
        emailVerified: boolean;
        profilePicture?: string;
        createdAt: string;
    };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
                <Image
                    src={profile.profilePicture || "/avatar-1.jpg"}
                    alt="Profile Picture"
                    width={80}
                    height={80}
                    className="rounded-full"
                />
                <div className="ml-4">
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <p className={`text-sm ${profile.emailVerified ? "text-green-500" : "text-red-500"}`}>
                        {profile.emailVerified ? "✅ Verified" : "❌ Not Verified"}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <Button label="Edit Profile" onClick={() => setIsModalOpen(true)} />
            </div>

            <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
        </div>
    );
};

export default ProfileCard;
