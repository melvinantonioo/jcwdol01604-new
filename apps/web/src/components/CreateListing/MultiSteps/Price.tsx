"use client";

import React from 'react';
import { useFormikContext } from 'formik';
import Heading from '@/utils/Heading';

interface StepPriceProps {
    errors: any;
    touched: any;
}

const StepPrice: React.FC<StepPriceProps> = ({ errors, touched }) => {
    const { values, setFieldValue } = useFormikContext<{
        basePrice: string;
    }>();

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Harga Properti"
                subtitle="Atur harga dasar untuk properti Anda"
            />
            <div className="flex flex-col gap-4">
                <label>Harga Dasar (per malam)</label>
                <input
                    type="number"
                    className="border rounded p-2"
                    value={values.basePrice}
                    onChange={(e) => setFieldValue('basePrice', e.target.value)}
                />
                {errors.basePrice && touched.basePrice && (
                    <div className="text-red-500 text-sm">{errors.basePrice}</div>
                )}
            </div>
        </div>
    );
};

export default StepPrice;
