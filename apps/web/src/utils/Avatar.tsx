"use client";
import useAuthStore from '@/stores/AuthStores';
import Image from 'next/image';
import React from 'react';
import { useSession } from "next-auth/react"; 

const Avatar = () => {
    const { user, clearAuth } = useAuthStore(); //zustand
    // const { data: session } = useSession(); // NextAuth

    const avatarUrl = user?.profilePicture || "/avatar-1.jpg";
    
    return (
        <div>
            <Image
            className='rounded-full'
            height="30"
            width="30"
            alt='Avatar'
                src={avatarUrl}
                // src="/avatar-1.jpg"
            />
            <span className="hidden md:inline-block font-medium">{user?.name || "Guest"}</span>
        </div>
    )
}

export default Avatar