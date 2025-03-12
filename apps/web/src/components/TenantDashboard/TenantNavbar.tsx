"use client";
import useAuthStore from '@/stores/AuthStores';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useRouter } from "next/navigation";
import Logo from '@/utils/Logo';

const Navbar: React.FC = () => {
    const router = useRouter();


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const { user, clearAuth } = useAuthStore(); //zustand

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    const handleLogout = () => {
        clearAuth();
        router.push("/");
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
            {/* Logo */}
            {/* <div className="text-orange-600 font-bold text-2xl">Tenant</div> */}
            <Logo />

            {/* Create Button */}
            <div className="hidden md:flex items-center space-x-4">
                <button className="border border-zinc-600 text-zinc-600 py-1 px-3 rounded-full hover:bg-zinc-600 hover:text-white transition">
                    + Create
                </button>
            </div>

            {/* Hamburger Menu Button */}
            <button className="md:hidden" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>


            {/* Account Menu */}
            <div className="relative">
                <button
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 space-x-2 hover:bg-gray-300 transition"
                    onClick={toggleAccountMenu}
                >
                    <div className="bg-blue-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
                        {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden md:inline-block font-medium">{user?.name || "Guest"}</span>
                    <MdKeyboardArrowDown size={20} />
                </button>

                {/* Account Dropdown */}
                {isAccountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                        <Link href="/" className="block px-4 py-2 text-sm hover:bg-gray-100">
                            User Home
                        </Link>
                        <Link href="/admin/account-settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                            Account Settings
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            Log out
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;