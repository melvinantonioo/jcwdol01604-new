"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/utils/Button'; // asumsi path komponen Button Anda
import Image from 'next/image';

const NavbarCreate = () => {
    const router = useRouter();

    const handleHelp = () => {
        router.push('/help');
    };

    const handleSaveAndExit = () => {
        // LOGIC untuk menyimpan data sementara atau confirm
        // Lalu arahkan ke halaman lain, misal ke dashboard
        router.push('/');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <div className="flex items-center justify-between p-4 border-b">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                />
                <span className="font-bold text-xl">MyProperty</span>
            </div>

            {/* Kanan */}
            <div className="flex items-center gap-4">
                <Button label="Bantuan" outline onClick={handleHelp} small />
                <Button label="Simpan & Keluar" onClick={handleSaveAndExit} small />
            </div>
        </div>
    );
};

export default NavbarCreate;
