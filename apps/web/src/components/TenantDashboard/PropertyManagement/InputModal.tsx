"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Modal from "@/components/Modals/Modal";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const InputsModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [filterType, setFilterType] = useState<"all" | "past" | "upcoming">("all");

    // State untuk rentang tanggal
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    return (
        <div>
            {/* Tombol untuk membuka modal pencarian */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center border border-gray-400 py-2 px-4 rounded-md bg-white hover:bg-gray-100 transition"
            >
                <FaSearch className="mr-2 text-gray-500" />
                Cari Penginapan
            </button>

            {/* Modal untuk pencarian properti */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => {
                    console.log("Melakukan pencarian...");
                    setIsModalOpen(false);
                }}
                title="Cari Properti"
                actionLabel="Cari"
                body={
                    <div className="flex flex-col gap-4">
                        {/* Input Lokasi */}
                        <div>
                            <label className="font-medium">Lokasi</label>
                            <input
                                type="text"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                placeholder="Masukkan kota atau lokasi"
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Input Rentang Tanggal */}
                        <div>
                            <label className="font-medium">Tanggal Menginap</label>
                            <DateRange
                                ranges={[dateRange]}
                                onChange={(ranges: RangeKeyDict) => {
                                    const { selection } = ranges;
                                    setDateRange({
                                        startDate: selection.startDate || new Date(),
                                        endDate: selection.endDate || new Date(),
                                        key: "selection",
                                    });
                                }}
                                minDate={new Date()} // Tidak bisa pilih tanggal sebelum hari ini
                                rangeColors={["#FF5733"]}
                                className="rounded-lg"
                            />
                        </div>

                        {/* Dropdown Filter */}
                        <div>
                            <label className="font-medium">Tipe Properti</label>
                            <select
                                className="border border-gray-300 p-2 rounded-lg w-full"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as "all" | "past" | "upcoming")}
                            >
                                <option value="all">Semua Properti</option>
                                <option value="past">Properti Lama</option>
                                <option value="upcoming">Properti Baru</option>
                            </select>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default InputsModal;
