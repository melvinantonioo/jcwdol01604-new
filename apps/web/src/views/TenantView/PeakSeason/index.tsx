"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/layouts/TenantLayouts";
import Heading from "@/utils/Heading";
import axiosInstance from "@/lib/AxiosInstance";
import Button from "@/utils/Button";
import Modal from "@/components/Modals/Modal";
import { PeakSeasonType } from "@/types/peakSeason";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Swal from "sweetalert2";

const PeakSeasonManagement = () => {
    const [peakSeasons, setPeakSeasons] = useState<PeakSeasonType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<PeakSeasonType | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    });

    const [properties, setProperties] = useState<any[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    const [priceAdjustment, setPriceAdjustment] = useState<number | null>(null);
    const [percentageAdjustment, setPercentageAdjustment] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get("/api/peak-season");
                setPeakSeasons(data.peakSeasons);
            } catch (error) {
                console.error("Gagal mengambil data peak season:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = async (season?: PeakSeasonType) => {
        setIsModalOpen(true);
        setSelectedSeason(season || null);

        if (season) {
            // ✅ Saat Edit, isi dengan data yang sudah ada
            setSelectedProperty(season.room.property.id);
            setSelectedRoom(season.room.id);
            setDateRange({
                startDate: new Date(season.startDate),
                endDate: new Date(season.endDate),
                key: "selection",
            });
            setPriceAdjustment(season.priceAdjustment || null);
            setPercentageAdjustment(season.percentageAdjustment || null);
        } else {
            // ✅ Saat "Tambah Peak Season", kosongkan form
            setSelectedProperty(null);
            setSelectedRoom(null);
            setDateRange({
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
            });
            setPriceAdjustment(null);
            setPercentageAdjustment(null);
        }

        try {
            const { data } = await axiosInstance.get("/api/dashboard/properties");
            setProperties(data.properties);
        } catch (error) {
            console.error("Gagal mengambil daftar properti:", error);
        }

        // ✅ Fetch rooms jika sedang edit
        if (season) {
            try {
                const { data } = await axiosInstance.get(`/api/room/${season.room.property.id}/rooms`);
                setRooms(data.rooms);
            } catch (error) {
                console.error("Gagal mengambil daftar room:", error);
            }
        }
    };

    const handlePropertyChange = async (propertyId: number) => {
        setSelectedProperty(propertyId);
        setSelectedRoom(null); 

        try {
            const { data } = await axiosInstance.get(`/api/room/${propertyId}/rooms`);
            setRooms(data.rooms);
        } catch (error) {
            console.error("Gagal mengambil daftar room:", error);
        }
    };

    // Handle Delete Peak Season
    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: "Hapus Peak Season?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal"
        });

        if (confirm.isConfirmed) {
            try {
                await axiosInstance.delete(`/api/peak-season/${id}/delete`);
                setPeakSeasons(peakSeasons.filter((ps) => ps.id !== id));
                Swal.fire("Deleted!", "Peak season berhasil dihapus.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Gagal menghapus peak season.", "error");
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedRoom) {
            Swal.fire("Error", "Pilih Property & Room terlebih dahulu!", "error");
            return;
        }

        const data = {
            roomId: selectedRoom,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            priceAdjustment,
            percentageAdjustment
        };

        try {
            if (selectedSeason) {
                await axiosInstance.put(`/api/peak-season/${selectedSeason.id}`, data);
                Swal.fire("Berhasil", "Peak Season berhasil diperbarui!", "success");
            } else {
                await axiosInstance.post(`/api/peak-season`, data);
                Swal.fire("Berhasil", "Peak Season berhasil ditambahkan!", "success");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Gagal menyimpan peak season", "error");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg shadow">
                <Heading title="Kelola Peak Season & Room Availability" subtitle="Atur harga spesial & ketersediaan kamar" />
                <Button label="Tambah Peak Season" onClick={() => handleOpenModal()} />

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <table className="w-full mt-6 border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Nama Properti</th>
                                    <th className="border p-2">Nama Room</th>
                                <th className="border p-2">Tanggal Mulai</th>
                                <th className="border p-2">Tanggal Selesai</th>
                                <th className="border p-2">Kenaikan Harga</th>
                                <th className="border p-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peakSeasons.map((season) => (
                                <tr key={season.id} className="text-center">
                                    <td className="border p-2">{season.room.property.name}</td>
                                    <td className="border p-2">{season.room.name}</td> 
                                    <td className="border p-2">{new Date(season.startDate).toLocaleDateString()}</td>
                                    <td className="border p-2">{new Date(season.endDate).toLocaleDateString()}</td>
                                    <td className="border p-2">{season.priceAdjustment ? `Rp ${season.priceAdjustment}` : `${season.percentageAdjustment}%`}</td>
                                    <td className="border p-2 flex justify-center gap-2">
                                        <Button label="Edit" onClick={() => handleOpenModal(season)} small />
                                        <Button label="Hapus" onClick={() => handleDelete(season.id)} small outline />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Form */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                title={selectedSeason ? "Edit Peak Season" : "Tambah Peak Season"}
                actionLabel="Simpan"
                body={
                    <div>
                        {/* Pilih Property */}
                        <label>Property</label>
                        <select value={selectedProperty || ""} onChange={(e) => handlePropertyChange(Number(e.target.value))}>
                            <option value="">Pilih Property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>{property.name}</option>
                            ))}
                        </select>

                        {/* Pilih Room setelah memilih Property */}
                        <label>Room</label>
                        <select value={selectedRoom || ""} onChange={(e) => setSelectedRoom(Number(e.target.value))} disabled={!selectedProperty}>
                            <option value="">Pilih Room</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>

                        <DateRange
                            ranges={[dateRange]}
                            onChange={(ranges) => {
                                const { selection } = ranges;
                                setDateRange({
                                    startDate: selection.startDate || new Date(),
                                    endDate: selection.endDate || new Date(),
                                    key: "selection",
                                });
                            }}
                            minDate={new Date()}
                            rangeColors={["#FF5733"]}
                        />

                        <input type="number" placeholder="Harga tambahan" value={priceAdjustment || ""} onChange={(e) => setPriceAdjustment(Number(e.target.value))} />
                        <input type="number" placeholder="Persentase tambahan" value={percentageAdjustment || ""} onChange={(e) => setPercentageAdjustment(Number(e.target.value))} />
                    </div>
                }
            />
        </AdminLayout>
    );
};

export default PeakSeasonManagement;
