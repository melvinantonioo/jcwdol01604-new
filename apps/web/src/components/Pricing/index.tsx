"use client";
import { useState } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "@/utils/Button";

interface CheckPricingProps {
    propertyId: string;
}

const CheckPricing: React.FC<CheckPricingProps> = ({ propertyId }) => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const [pricingInfo, setPricingInfo] = useState<{
        totalNights: number;
        roomsPricing: {
            roomId: number;
            roomName: string;
            basePrice: number;
            totalRoomPrice: number;
            priceAdjustments: { date: string; type: string; amount: number }[];
        }[];
        message: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);

    const handleDateChange = (ranges: any) => {
        const { selection } = ranges;
        setDateRange({
            startDate: selection.startDate || new Date(),
            endDate: selection.endDate || new Date(),
            key: "selection",
        });
    };

    const fetchPricing = async () => {
        try {
            setLoading(true);
            setPricingInfo(null);
            const { startDate, endDate } = dateRange;
            const response = await axiosInstance.get(`/api/pricing/${propertyId}/pricing`, {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                },
            });

            setPricingInfo(response.data);
        } catch (error) {
            console.error("Error fetching pricing:", error);
            setPricingInfo(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border p-4 rounded-lg shadow-lg bg-white">
            <h2 className="text-lg font-semibold mb-2">Cek Harga Penginapan</h2>
            <DateRange
                ranges={[dateRange]}
                onChange={handleDateChange}
                minDate={new Date()}
                rangeColors={["#4F46E5"]}
            />
            <Button label="Cek Harga" onClick={fetchPricing} disabled={loading} />

            {pricingInfo && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                    <p className="text-lg font-bold text-gray-800">{pricingInfo.message}</p>
                    <p className="text-md text-gray-600">Total malam: {pricingInfo.totalNights}</p>

                    {pricingInfo.roomsPricing.map((room) => (
                        <div key={room.roomId} className="mt-4 p-3 border rounded-lg bg-white">
                            <h3 className="font-semibold text-gray-800">{room.roomName}</h3>
                            <p className="text-sm text-gray-600">Harga per malam: Rp {room.basePrice.toLocaleString()}</p>
                            <p className="text-sm font-semibold text-gray-800">Total harga: Rp {room.totalRoomPrice.toLocaleString()}</p>

                            {room.priceAdjustments.length > 0 && (
                                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded-lg">
                                    <p className="text-sm font-semibold">📌 Kenaikan Harga:</p>
                                    {room.priceAdjustments.map((adjustment, index) => (
                                        <p key={index} className="text-sm text-gray-700">
                                            🔹 {adjustment.date} - {adjustment.type}: Rp {adjustment.amount.toLocaleString()}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CheckPricing;
