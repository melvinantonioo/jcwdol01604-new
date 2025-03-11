"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/AxiosInstance";
import Button from "@/utils/Button";
import Modal from "@/components/Modals/Modal";
import AdminLayout from "@/layouts/TenantLayouts";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Room {
    id: number;
    name: string;
    description: string;
    price: number;
    maxGuests: number;
}

const RoomManagement = () => {
    const { propertyId } = useParams();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get(`/api/room/${propertyId}/rooms`);
            setRooms(response.data.rooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            Swal.fire("Error", "Gagal mengambil data kamar", "error");
        }
    };

    // ✅ Konfirmasi sebelum menghapus kamar
    const handleDelete = async (roomId: number) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Kamar ini akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/api/room/${roomId}/delete`);
                    fetchRooms();
                    Swal.fire("Berhasil", "Kamar berhasil dihapus", "success");
                } catch (error) {
                    console.error("Error deleting room:", error);
                    Swal.fire("Error", "Gagal menghapus kamar", "error");
                }
            }
        });
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Room Management</h1>
                <Button label="Tambah Kamar" onClick={() => {
                    setSelectedRoom(null);
                    setIsModalOpen(true);
                }} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {rooms.map((room) => (
                        <div key={room.id} className="border p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{room.name}</h2>
                            <p>{room.description}</p>
                            <p>Max Guests: {room.maxGuests}</p>
                            <p className="text-lg font-bold">Rp{room.price.toLocaleString()}</p>
                            <div className="mt-2 flex gap-2">
                                <Button label="Edit" onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }} />
                                <Button label="Hapus" outline onClick={() => handleDelete(room.id)} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Edit / Tambah Room dengan Formik */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={() => { }}
                    title={selectedRoom ? "Edit Room" : "Tambah Room"}
                    actionLabel="Simpan"
                    body={
                        <Formik
                            initialValues={{
                                name: selectedRoom?.name || "",
                                description: selectedRoom?.description || "",
                                price: selectedRoom?.price || 0,
                                maxGuests: selectedRoom?.maxGuests || 1,
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string()
                                    .required("Nama kamar wajib diisi")
                                    .max(100, "Maksimal 100 karakter"),
                                description: Yup.string()
                                    .required("Deskripsi wajib diisi")
                                    .max(500, "Maksimal 500 karakter"),
                                price: Yup.number()
                                    .required("Harga wajib diisi")
                                    .positive("Harga harus lebih dari 0")
                                    .typeError("Harga harus berupa angka"),
                                maxGuests: Yup.number()
                                    .required("Jumlah tamu wajib diisi")
                                    .min(1, "Minimal 1 tamu")
                                    .typeError("Jumlah tamu harus berupa angka"),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    if (selectedRoom) {
                                        // Update room
                                        await axiosInstance.put(`/api/room/${selectedRoom.id}/update`, values);
                                        Swal.fire("Berhasil", "Kamar berhasil diperbarui", "success");
                                    } else {
                                        // Tambah room baru
                                        await axiosInstance.post(`/api/room/${propertyId}`, values);
                                        Swal.fire("Berhasil", "Kamar baru berhasil ditambahkan", "success");
                                    }
                                    setIsModalOpen(false);
                                    fetchRooms();
                                } catch (error) {
                                    console.error("Error saving room:", error);
                                    Swal.fire("Error", "Gagal menyimpan data kamar", "error");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="flex flex-col gap-4">
                                    <label className="font-medium">Nama Room</label>
                                    <Field type="text" name="name" className="border rounded p-2" />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

                                    <label className="font-medium">Deskripsi</label>
                                    <Field as="textarea" name="description" className="border rounded p-2" />
                                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />

                                    <label className="font-medium">Harga</label>
                                    <Field type="number" name="price" className="border rounded p-2" />
                                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />

                                    <label className="font-medium">Max Guests</label>
                                    <Field type="number" name="maxGuests" className="border rounded p-2" />
                                    <ErrorMessage name="maxGuests" component="div" className="text-red-500 text-sm" />

                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    }
                />
            </div>
        </AdminLayout>
    );
};

export default RoomManagement;
