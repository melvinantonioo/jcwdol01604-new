"use client";
import React, { useCallback, useState } from 'react';
import { AiOutlineMenu } from "react-icons/ai"
import Avatar from '@/utils/Avatar';
import MenuItem from './MenuItem';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/AuthStores';


const UserMenu = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const { user, clearAuth } = useAuthStore(); 

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])


    const handleLogout = () => {
        clearAuth();
        router.push("/");
    };

    return (
        <div className='relative'>
            <div className='flex flex-row items-center gap-3'>

                <div
                    onClick={() => router.push('/admin/create')}
                    className='
                hidden
                md:block
                text-sm
                font-semibold
                py-3
                px-4
                rounded-full
                hover:bg-neutral-300
                transition
                cursor-pointer
                '
                >
                    Peluangkan Propertymu
                </div>

                <div
                    onClick={toggleOpen}
                    className='
                p-4
                md:py-1
                md:px-2
                border-[1px]
                border-neutral-200
                flex
                flex-row
                items-center
                gap-3
                rounded-full
                cursor-pointer
                hover:shadow-md
                transition
                '
                >
                    <AiOutlineMenu />
                    <div className='hidden md:block'>
                        <Avatar />
                    </div>
                </div>

            </div>
            {isOpen && (
                <div
                    className='
                absolute
                rounded-xl
                shadow-md
                w-[40vw]
                md:w-3/4
                bg-white
                overflow-hidden
                right-0
                top-12
                text-sm
                '
                >
                    <div className='flex flex-col cursor-pointer'>
                        <>
                            <MenuItem onClick={() => router.push("/login")} label="Login" />
                            <MenuItem onClick={() => router.push("/register")} label="Sign Up" />
                            <MenuItem onClick={() => router.push("/profile")} label="Profile" />
                            <MenuItem onClick={() => router.push("/admin")} label="Management" />
                            <MenuItem
                                onClick={handleLogout}
                                label='Log Out'
                            />
                        </>
                    </div>

                </div>
            )}
        </div>
    )
}

export default UserMenu