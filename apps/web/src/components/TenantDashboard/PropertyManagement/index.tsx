"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/AxiosInstance";
import Modal from "@/components/Modals/Modal";
import Swal from "sweetalert2";
import { PropertyTypes } from "@/types/property";
import Empty from "@/utils/EmptyHandler";
import InputsModal from "./InputModal";
import TenantPropertyCard from "@/components/Properties/TenantCardProp";

const PropertyManagement = () => {
    const [properties, setProperties] = useState<PropertyTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedProperty, setSelectedProperty] = useState<PropertyTypes | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/dashboard/properties", {
                params: { page, limit: 10 },
            });

            setProperties(response.data.properties);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Gagal mengambil data property", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [page]);
    useEffect(() => {
        fetchProperties();
    }, []);

    const [editData, setEditData] = useState<{ name: string; description: string }>({
        name: "",
        description: "",
    });

    const handleEdit = (property: PropertyTypes) => {
        setSelectedProperty(property);
        setEditData({
            name: property.name || "",
            description: property.description || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Properti akan disembunyikan, tetapi tidak benar-benar dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/api/dashboard/${id}/soft-delete`);
                    setProperties((prev) => prev.filter((prop) => prop.id !== id));
                    Swal.fire("Dihapus!", "Properti berhasil disembunyikan.", "success");
                } catch (error) {
                    console.error(error);
                    Swal.fire("Error", "Gagal menghapus properti", "error");
                }
            }
        });
    };

    const handleModalSubmit = async () => {
        try {
            await axiosInstance.put(`/api/dashboard/${selectedProperty?.id}/update`, {
                name: selectedProperty?.name,
                description: selectedProperty?.description,
            });
            setIsModalOpen(false);
            setSelectedProperty(null);
            fetchProperties();
            Swal.fire("Berhasil", "Property berhasil diperbarui", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Gagal memperbarui property", "error");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    if (!loading && properties.length === 0) {
        return (
            <Empty
                title="Jika belum listing property, segera listing"
                subtitle="Buat listing properti Anda sekarang!"
                showReset={true}
            />
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">Penginapan</h2>

            {/* Komponen Input untuk pencarian dan filter */}
            <div className="">
                {/* <Inputs /> */}
                <InputsModal />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {properties.map((property) => (
                        <div key={property.id} className="relative z-10">
                            <TenantPropertyCard
                                id={property.id}
                                name={property.name}
                                location={property.location}
                                region={property.region}
                                price={property.basePrice}
                                rating={property.rating || 0}
                                imageUrl={property.imageUrl}
                                availableDates={property.availableDates}
                                slug={property.slug}
                            />
                            {/* Tombol Edit & Delete */}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(property)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(property.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                    Next
                </button>
            </div>

            {/* Modal Edit Property */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                title="Edit Property"
                actionLabel="Simpan Perubahan"
                body={
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="border rounded p-2"
                        />

                        <label className="font-medium">Deskripsi</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="border rounded p-2"
                        />
                    </div>
                }
            />
        </div>
    );
};

export default PropertyManagement;