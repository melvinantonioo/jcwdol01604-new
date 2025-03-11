"use client";
import axiosInstance from '@/lib/AxiosInstance';
import useAuthStore from '@/stores/AuthStores';
import debounce from "lodash/debounce";
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaList, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

import { format } from "date-fns";
import DatePicker from 'react-datepicker';
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";  // ✅ Import CSS bawaan
import "react-date-range/dist/theme/default.css"; // ✅ Import tema bawaan

const Inputs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filterType, setFilterType] = useState<"all" | "past" | "upcoming">("all");
    const [isListView, setIsListView] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const { user } = useAuthStore();

    const tenantId = user?.id.toString();

    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });


    const fetchProperty = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/api/dashboard/query`, {
                params: {
                    search: debouncedSearchTerm?.trim() || undefined,
                    filterType: filterType !== "all" ? filterType : undefined,
                    selectedDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
                    tenantId: tenantId, // Mengirimkan organizerId
                },
            });
            console.log("All Events:", response.data.events);
            setEvents(response.data.events);
        } catch (err) {
            setError("Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan bisa mengembalikan event ini setelah dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/api/dashboard/${id}`);
                    fetchProperty();
                    Swal.fire("Dihapus!", "Event berhasil dihapus.", "success");
                } catch (error) {
                    Swal.fire("Terjadi kesalahan", "Gagal menghapus event", "error");
                }
            }
        });
    };

    const handleSearch = debounce((value: string) => {
        setDebouncedSearchTerm(value);
    }, 500);

    useEffect(() => {
        // Menangani pencarian berdasarkan nama dan lokasi
        if (searchTerm.trim().length > 0) {
            handleSearch(searchTerm);
        } else {
            setDebouncedSearchTerm(""); // Reset jika pencarian kosong
        }

        return () => {
            handleSearch.cancel();
        };
    }, [searchTerm]);

    useEffect(() => {
        // Hanya lakukan fetch jika organizerId ada
        if (tenantId) {
            fetchProperty();
        }
    }, [debouncedSearchTerm, filterType, selectedDate, tenantId]);

    return (
        <div>
            {/* Kontrol Pencarian dan Filter */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Pencarian */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari event"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute top-2.5 right-3 text-gray-500" />
                </div>

                {/* Tombol Toggle View */}
                <button
                    onClick={() => setIsListView(!isListView)}
                    className="flex items-center border border-blue-600 text-blue-600 py-1 px-3 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                    <FaList className="mr-2" /> {isListView ? "Grid" : "List"}
                </button>

                {/* Datepicker */}
                <div className="relative">
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
                        minDate={new Date()} // ✅ Tidak bisa pilih tanggal sebelum hari ini
                        rangeColors={["#FF5733"]} // ✅ Warna custom
                        className="shadow-lg rounded-lg absolute z-50 bg-white" // ✅ Tambahkan shadow dan z-index agar tidak tertutup
                    />
                </div>

                {/* Dropdown Filter */}
                <select
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as "all" | "past" | "upcoming")}
                >
                    <option value="all">Semua Event</option>
                    <option value="past">Event Lama</option>
                    <option value="upcoming">Event Mendatang</option>
                </select>
            </div>
        </div>
    )
}

export default Inputs