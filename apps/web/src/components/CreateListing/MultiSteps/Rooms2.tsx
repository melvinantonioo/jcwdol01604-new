"use client";
import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import Heading from "@/utils/Heading";
import { FaTrash } from "react-icons/fa";

interface StepRoomsProps {
    errors: any;
    touched: any;
}

const StepRooms2: React.FC<StepRoomsProps> = ({ errors, touched }) => {
    const { values, setFieldValue } = useFormikContext<{
        rooms: { name: string; price: number; maxGuests: number }[];
    }>();

    useEffect(() => {
        if (values.rooms.length === 0) {
            setFieldValue("rooms", [{ name: "", price: 0, maxGuests: 1 }]);
        }
    }, [values.rooms, setFieldValue]);

    const addRoom = () => {
        setFieldValue("rooms", [...values.rooms, { name: "", price: 0, maxGuests: 1 }]);
    };

    const removeRoom = (index: number) => {
        const updatedRooms = [...values.rooms];
        updatedRooms.splice(index, 1);
        setFieldValue("rooms", updatedRooms);
    };

    return (
        <div className="flex flex-col gap-8">
            <Heading title="Tambah Kamar" subtitle="Buat daftar kamar dengan harga & kapasitas" />

            {values.rooms.map((room, index) => (
                <div key={index} className="border p-4 rounded-lg shadow">
                    <label>Nama Kamar</label>
                    <input
                        type="text"
                        className="border rounded p-2 w-full"
                        value={room.name}
                        onChange={(e) => {
                            const updatedRooms = [...values.rooms];
                            updatedRooms[index].name = e.target.value;
                            setFieldValue("rooms", updatedRooms);
                        }}
                    />
                    {errors.rooms?.[index]?.name && touched.rooms?.[index]?.name && (
                        <div className="text-red-500">{errors.rooms[index].name}</div>
                    )}

                    <label>Harga Per Malam</label>
                    <input
                        type="number"
                        className="border rounded p-2 w-full"
                        value={room.price}
                        onChange={(e) => {
                            const updatedRooms = [...values.rooms];
                            updatedRooms[index].price = +e.target.value;
                            setFieldValue("rooms", updatedRooms);
                        }}
                    />
                    {errors.rooms?.[index]?.price && touched.rooms?.[index]?.price && (
                        <div className="text-red-500">{errors.rooms[index].price}</div>
                    )}

                    <label>Kapasitas Tamu</label>
                    <input
                        type="number"
                        className="border rounded p-2 w-full"
                        value={room.maxGuests}
                        onChange={(e) => {
                            const updatedRooms = [...values.rooms];
                            updatedRooms[index].maxGuests = +e.target.value;
                            setFieldValue("rooms", updatedRooms);
                        }}
                    />
                    {errors.rooms?.[index]?.maxGuests && touched.rooms?.[index]?.maxGuests && (
                        <div className="text-red-500">{errors.rooms[index].maxGuests}</div>
                    )}

                    {values.rooms.length > 1 && (
                        <button type="button" onClick={() => removeRoom(index)}
                            className="mt-2 text-red-500 flex items-center gap-2">
                            <FaTrash /> Hapus
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addRoom}
                className="bg-blue-500 text-white p-2 rounded-lg">
                + Tambah Kamar
            </button>
        </div>
    );
};

export default StepRooms2;
