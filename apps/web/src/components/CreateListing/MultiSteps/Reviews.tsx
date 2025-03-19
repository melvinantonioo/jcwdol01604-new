"use client";

import React from 'react';
import Heading from '@/utils/Heading';

interface StepReviewProps {
    values: any;
}

const StepReview: React.FC<StepReviewProps> = ({ values }) => {
    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Review Data"
                subtitle="Periksa kembali data sebelum disimpan"
            />
            <div className="flex flex-col gap-2">
                <p><strong>Kategori:</strong> {values.category}</p>
                <p><strong>Lokasi:</strong> {values.location}</p>
                <p><strong>Region:</strong> {values.region}</p>
                <p><strong>Nama Properti:</strong> {values.name}</p>
                <p><strong>Deskripsi:</strong> {values.description}</p>
                <ul>
                    {values.rooms.map((room: any, index: number) => (
                        <li key={index}>
                            <p><strong>Nama Kamar:</strong> {room.name}</p>
                            <p><strong>Harga:</strong> Rp {room.price}</p>
                            <p><strong>Kapasitas:</strong> {room.maxGuests} orang</p>
                        </li>
                    ))}
                </ul>
                {/* <p><strong>Jumlah Kamar Mandi:</strong> {values.bathrooms}</p> */}
                <p><strong>Tamu Maksimal:</strong> {values.maxGuests}</p>
                <p><strong>Harga Dasar:</strong> {values.basePrice}</p>
                <p><strong>Foto:</strong> {values.images.length} file(s)</p>
            </div>
            <div className="text-red-500">
                *Pastikan semua data sudah benar sebelum menekan tombol "Simpan"
            </div>
        </div>
    );
};

export default StepReview;
