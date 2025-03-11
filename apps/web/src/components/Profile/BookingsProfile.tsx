"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import ProfileLayout from "@/layouts/ProfileLayouts";

const BookingList = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axiosInstance.get("/booking/my-bookings");
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <ProfileLayout>
            <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Daftar Booking</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p>Anda belum memiliki booking.</p>
                ) : (
                    <ul className="list-disc pl-6">
                        {bookings.map((booking) => (
                            <li key={booking.id}>
                                {booking.room.property.name} - {booking.startDate} to {booking.endDate} - {booking.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ProfileLayout>
    );
};

export default BookingList;
