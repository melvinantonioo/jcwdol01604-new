"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "@/components/Modals/Modal";
import Button from "@/utils/Button";

interface OrderCardProps {
    booking: {
        id: number;
        startDate: string;
        endDate: string;
        status: string;
        totalPrice: number;
        user: { name: string; email: string };
        room: { name: string; property: { name: string; } };
        booking?: {}
    };
}

const ProfileOrderCard2: React.FC<OrderCardProps> = ({ booking }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false); // ✅ State untuk cek apakah sudah direview

    // useEffect(() => {
    //     console.log("Booking Data:", booking); // 🔍 Debugging

    //     const checkReviewStatus = async () => {
    //         try {
    //             if (!booking?.room?.id) {
    //                 console.warn("Room ID is missing!", booking);
    //                 return;
    //             }

    //             const { data } = await axiosInstance.get(`/api/reviews/room/${booking.room.id}`);
    //             setHasReviewed(data.hasReviewed);
    //         } catch (error) {
    //             console.error("Error checking review status:", error);
    //         }
    //     };

    //     checkReviewStatus();
    // }, [booking]);

    const handleUpdateStatus = async (status: string) => {
        try {
            await axiosInstance.patch(`/api/dashboard/bookings/${booking.id}`, { status });
            Swal.fire("Success", `Booking ${status}`, "success").then(() => window.location.reload());
        } catch (error) {
            Swal.fire("Error", "Failed to update booking status", "error");
        }
    };

    const formik = useFormik({
        initialValues: {
            rating: "",
            comment: "",
        },
        validationSchema: Yup.object({
            rating: Yup.number()
                .required("Rating diperlukan")
                .min(1, "Minimal 1 bintang")
                .max(5, "Maksimal 5 bintang"),
            comment: Yup.string().required("Komentar tidak boleh kosong"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await axiosInstance.post("/api/reviews/user-review", {
                    bookingId: booking.id,
                    rating: values.rating,
                    comment: values.comment,
                });

                Swal.fire("Success", "Review berhasil dikirim!", "success");
                setIsReviewModalOpen(false);
                resetForm();
            } catch (error) {
                Swal.fire("Error", "Gagal mengirim review", "error");
            }
        },
    });

    return (
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-lg font-bold">{booking.room.property.name}</h2>
            <p>Room: {booking.room.name}</p>
            {/* <p>Guest:  ({booking.user.email})</p> */}
            <p>Check-in: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Status: <span className={`font-bold ${booking.status === "WAITING_PAYMENT" ? "text-orange-500" : "text-green-500"}`}>{booking.status}</span></p>
            <p>Total Price: Rp. {booking.totalPrice.toLocaleString()}</p>

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

            {/* TOMBOL REVIEW */}
            {booking.status === "PAYMENT_CONFIRMED" && (
                <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                    disabled={hasReviewed}
                >
                    Review
                </button>
            )}

            {/* MODAL FORM REVIEW */}
            <Modal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={formik.handleSubmit}
                title="Tulis Review"
                actionLabel="Kirim Review"
                body={
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Rating</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                name="rating"
                                value={formik.values.rating}
                                onChange={formik.handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {formik.touched.rating && formik.errors.rating && (
                                <p className="text-red-500 text-sm">{formik.errors.rating}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Komentar</label>
                            <textarea
                                name="comment"
                                value={formik.values.comment}
                                onChange={formik.handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {formik.touched.comment && formik.errors.comment && (
                                <p className="text-red-500 text-sm">{formik.errors.comment}</p>
                            )}
                        </div>
                    </form>
                }
            />

        </div>
    );
};

export default ProfileOrderCard2;
