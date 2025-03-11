"use client";

import React from 'react';
import { useFormikContext } from 'formik';
import Heading from '@/utils/Heading';

interface StepInfoProps {
    errors: any;
    touched: any;
}

const StepInfo: React.FC<StepInfoProps> = ({ errors, touched }) => {
    const { values, setFieldValue } = useFormikContext<{
        name: string;
        description: string;
    }>();

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Informasi Dasar"
                subtitle="Berikan nama properti dan deskripsi singkat"
            />

            <div className="flex flex-col gap-4">
                <label>Nama Properti</label>
                <input
                    type="text"
                    className="border rounded p-2"
                    value={values.name}
                    onChange={(e) => setFieldValue('name', e.target.value)}
                />
                {errors.name && touched.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                )}

                <label>Deskripsi</label>
                <textarea
                    className="border rounded p-2"
                    value={values.description}
                    onChange={(e) => setFieldValue('description', e.target.value)}
                />
                {errors.description && touched.description && (
                    <div className="text-red-500 text-sm">{errors.description}</div>
                )}
            </div>
        </div>
    );
};

export default StepInfo;
