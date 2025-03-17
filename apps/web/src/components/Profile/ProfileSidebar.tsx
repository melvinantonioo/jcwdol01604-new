"use client"
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaFileInvoiceDollar, FaChartBar, FaCog } from 'react-icons/fa';

const ProfileSidebar: React.FC = () => {
    return (
        <aside className="w-64 h-screen bg-gray-50 shadow-md fixed top-0 left-0 hidden md:block">
            <div className="p-4 text-orange-600 font-bold text-2xl">Profiles</div>
            <nav className="mt-8">
                <Link href="/profile" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaHome className="mr-2" /> Profile Home
                </Link>
                <Link href="/profile/review" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaCalendarAlt className="mr-2" /> Reviews
                </Link>
                <Link href="/profile/bookings" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaFileInvoiceDollar className="mr-2" /> Booking & Order
                </Link>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;