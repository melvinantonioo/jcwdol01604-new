"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import OrderCard from "./BookingCard";
import SearchBar from "./ProfileSearch";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import ProfileOrderCard2 from "./BookingCard2";

interface Booking {
    id: number;
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
    user: { name: string; email: string };
    room: { name: string; property: { name: string } };
}

interface OrderListProps {
    searchQuery: string;
    filterDate: string;
}


const ProfileOrderList = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/api/bookings/user-book", {
                params: {
                    search: searchQuery,
                    dateRange: filterDate,
                    page,
                    limit: 10,
                },
            });

            setBookings(data.bookings);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [searchQuery, filterDate, page]);

    return (
        <div>
            <SearchBar onSearch={setSearchQuery} onFilterDate={setFilterDate} />

            {/* Daftar Booking */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings found.</p>
                ) : (
                    bookings.map((booking) => (
                        <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <ProfileOrderCard2 booking={booking} />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProfileOrderList;
