"use client";

import React from 'react';
import { useFormikContext } from 'formik';
import Heading from '@/utils/Heading';

interface StepRoomsProps {
    errors: any;
    touched: any;
}

const StepRooms: React.FC<StepRoomsProps> = ({ errors, touched }) => {
    const { values, setFieldValue } = useFormikContext<{
        rooms: number;
        bathrooms: number;
        maxGuests: number;
    }>();

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Kapasitas dan Ruangan"
                subtitle="Tentukan jumlah ruangan dan tamu"
            />

            <div className="flex flex-col gap-4">
                <label>Jumlah Kamar</label>
                <input
                    type="number"
                    className="border rounded p-2"
                    value={values.rooms}
                    onChange={(e) => setFieldValue('rooms', +e.target.value || 1)}
                />
                {errors.rooms && touched.rooms && (
                    <div className="text-red-500 text-sm">{errors.rooms}</div>
                )}

                <label>Jumlah Kamar Mandi</label>
                <input
                    type="number"
                    className="border rounded p-2"
                    value={values.bathrooms}
                    onChange={(e) => setFieldValue('bathrooms', +e.target.value || 1)}
                />
                {errors.bathrooms && touched.bathrooms && (
                    <div className="text-red-500 text-sm">{errors.bathrooms}</div>
                )}

                <label>Jumlah Tamu Maksimal</label>
                <input
                    type="number"
                    className="border rounded p-2"
                    value={values.maxGuests}
                    onChange={(e) => setFieldValue('maxGuests', +e.target.value || 1)}
                />
                {errors.maxGuests && touched.maxGuests && (
                    <div className="text-red-500 text-sm">{errors.maxGuests}</div>
                )}
            </div>
        </div>
    );
};

export default StepRooms;
