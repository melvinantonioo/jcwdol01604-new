"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/Modals/Modal";
import Button from "@/utils/Button";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { handleVerificationAlert } from "@/utils/Notification/EmailVerif";
import useAuthStore from "@/stores/AuthStores"; 

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: {
        id: string;
        rooms: { id: number; name: string; maxGuests: number }[];
    };
}

const BookingModalFix: React.FC<BookingModalProps> = ({ isOpen, onClose, property }) => {
    const router = useRouter();
    const { user } = useAuthStore(); 

    const [numRooms, setNumRooms] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(property.rooms[0]?.id || null);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);

    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const handleDateChange = (ranges: RangeKeyDict) => {
        const { selection } = ranges;
        setDateRange({
            startDate: selection.startDate || new Date(),
            endDate: selection.endDate || new Date(),
            key: "selection",
        });
    };

    useEffect(() => {
        if (isOpen) {
            if (!user) {
                
                Swal.fire({
                    title: "Login Diperlukan",
                    text: "Silakan login terlebih dahulu untuk melakukan booking.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Login",
                    cancelButtonText: "Batal",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/login"); 
                    } else {
                        onClose(); 
                    }
                });
                return;
            }

            const checkVerificationStatus = async () => {
                try {
                    const response = await axiosInstance.get("/profile/me");
                    setIsVerified(response.data.emailVerified);
                } catch (error) {
                    console.error("Gagal memeriksa status verifikasi:", error);
                    setIsVerified(false);
                }
            };

            checkVerificationStatus();
        }
    }, [isOpen, user]);

    const handleBooking = async () => {
        if (!user) {
            Swal.fire("Login Diperlukan", "Silakan login untuk booking.", "warning").then(() => {
                router.push("/login");
            });
            return;
        }
        if (!isVerified) {
            handleVerificationAlert();
            return;
        }

        try {
            const availabilityCheck = await axiosInstance.post("/api/bookings/check-availability", {
                roomId: selectedRoom,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
            });

            if (!availabilityCheck.data.isAvailable) {
                Swal.fire("Kamar Penuh", "Maaf, kamar sudah dipesan di tanggal ini.", "error");
                return;
            }
            const response = await axiosInstance.post("/api/bookings", {
                roomId: selectedRoom,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                numRooms,
            });

            Swal.fire("Berhasil!", response.data.message, "success").then(() => {
                router.push(`/payment/${response.data.bookingId}`);
            });
        } catch (error) {
            Swal.fire("Error", "Gagal melakukan booking", "error");
            console.error("Booking error:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleBooking}
            title="Booking Details"
            actionLabel="Book Now"
            body={
                <div className="flex flex-col gap-4">

                    <label className="font-medium">Select Room: Max 2 Guest</label>
                    <select
                        className="border rounded p-2"
                        value={selectedRoom || ""}
                        onChange={(e) => setSelectedRoom(Number(e.target.value))}
                    >
                        {property.rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name} - Max {room.maxGuests} guests
                            </option>
                        ))}
                    </select>


                    <label className="font-medium">Number of Rooms:</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={numRooms}
                        onChange={(e) => setNumRooms(Number(e.target.value))}
                        className="border rounded p-2"
                    />


                    <label className="font-medium">Select Dates:</label>
                    <DateRange
                        ranges={[dateRange]}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        rangeColors={["#4F46E5"]}
                    />
                </div>
            }
        />
    );
};

export default BookingModalFix;
