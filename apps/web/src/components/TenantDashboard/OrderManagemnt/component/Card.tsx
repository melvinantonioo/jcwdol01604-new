"use client";
import { useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";
import Modal from "@/components/Modals/Modal";
import Empty from "@/utils/EmptyHandler";

interface OrderCardProps {
    booking: {
        id: number;
        startDate: string;
        endDate: string;
        status: string;
        totalPrice: number;
        paymentProof?: { proofUrl: string } | null;  // ✅ Bukti pembayaran
        user: { name: string; email: string };
        room: { name: string; property: { name: string } };
    };
}

const OrderCard: React.FC<OrderCardProps> = ({ booking }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdateStatus = async (status: string) => {
        try {
            await axiosInstance.patch(`/api/dashboard/bookings/${booking.id}`, { status });
            Swal.fire("Success", `Booking ${status}`, "success").then(() => window.location.reload());
        } catch (error) {
            Swal.fire("Error", "Failed to update booking status", "error");
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-lg font-bold">{booking.room.property.name}</h2>
            <p>Room: {booking.room.name}</p>
            <p>Guest: {booking.user.name} ({booking.user.email})</p>
            <p>Check-in: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Status: <span className={`font-bold ${booking.status === "WAITING_PAYMENT" ? "text-orange-500" : "text-green-500"}`}>{booking.status}</span></p>
            <p>Total Price: Rp. {booking.totalPrice.toLocaleString()}</p>

            {/* ✅ Tombol untuk melihat bukti pembayaran */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 bg-zinc-600 text-white px-4 py-2 rounded"
            >
                Lihat Bukti Pembayaran
            </button>

            {/* ✅ Tombol Accept / Reject hanya jika status "WAITING_PAYMENT" */}
            {booking.status === "WAITING_PAYMENT" && (
                <div className="mt-2 flex gap-2">
                    <button onClick={() => handleUpdateStatus("PAYMENT_CONFIRMED")} className="bg-green-500 text-white px-4 py-2 rounded">
                        Accept
                    </button>
                    <button onClick={() => handleUpdateStatus("CANCELLED")} className="bg-red-500 text-white px-4 py-2 rounded">
                        Reject
                    </button>
                </div>
            )}

            {/* ✅ Modal untuk bukti pembayaran */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Bukti Pembayaran"
                actionLabel="Tutup"
                onSubmit={() => setIsModalOpen(false)}
                body={
                    booking.paymentProof?.proofUrl ? (
                        <img src={booking.paymentProof.proofUrl} alt="Bukti Pembayaran" className="w-full h-auto rounded-md" />
                    ) : (
                        <Empty title="Belum ada bukti pembayaran" />
                    )
                }
            />
        </div>
    );
};

export default OrderCard;
