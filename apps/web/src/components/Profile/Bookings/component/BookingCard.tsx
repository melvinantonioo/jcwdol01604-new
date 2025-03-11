"use client";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";

interface OrderCardProps {
    booking: {
        id: number;
        startDate: string;
        endDate: string;
        status: string;
        totalPrice: number;
        user: { name: string; email: string };
        room: { name: string; property: { name: string } };
    };
}

const ProfileOrderCard: React.FC<OrderCardProps> = ({ booking }) => {
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
            {/* <p>Guest: {booking.user.name} ({booking.user.email})</p> */}
            <p>Check-in: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Status: <span className={`font-bold ${booking.status === "WAITING_PAYMENT" ? "text-orange-500" : "text-green-500"}`}>{booking.status}</span></p>
            <p>Total Price: Rp. {booking.totalPrice}</p>

            {booking.status === "WAITING_PAYMENT" && (
                <div className="mt-2 flex gap-2">
                    <button onClick={() => handleUpdateStatus("PAYMENT_CONFIRMED")} className="bg-green-500 text-white px-4 py-2 rounded">
                        Bayar
                    </button>
                    <button onClick={() => handleUpdateStatus("CANCELLED")} className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel 
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileOrderCard;
