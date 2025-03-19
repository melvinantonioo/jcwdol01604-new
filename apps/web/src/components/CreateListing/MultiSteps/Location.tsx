"use client";

import React from 'react';
import { useFormikContext } from 'formik';
import Heading from '@/utils/Heading';
import CountrySelect from '@/utils/Inputs/CountrySelect';

interface StepLocationProps {
    errors: any;
    touched: any;
}

const StepLocation: React.FC<StepLocationProps> = ({ errors, touched }) => {
    const { values, setFieldValue } = useFormikContext<{
        location: string;
        region: string;
    }>();

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Di mana lokasi tempat Anda?"
                subtitle="Alamat Anda hanya akan diberitahukan kepada tamu setelah mereka melakukan reservasi"
            />

            {/* <CountrySelect 
                onChange={(value) => }
            /> */}

            <div className="flex flex-col gap-2">
                <label>Lokasi (Negara/Kota)</label>
                <input
                    type="text"
                    className="border rounded p-2"
                    value={values.location}
                    onChange={(e) => setFieldValue('location', e.target.value)}
                />
                {errors.location && touched.location && (
                    <div className="text-red-500 text-sm">{errors.location}</div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label>Region / Provinsi</label>
                <input
                    type="text"
                    className="border rounded p-2"
                    value={values.region}
                    onChange={(e) => setFieldValue('region', e.target.value)}
                />
                {errors.region && touched.region && (
                    <div className="text-red-500 text-sm">{errors.region}</div>
                )}
            </div>
        </div>
    );
};

export default StepLocation;
