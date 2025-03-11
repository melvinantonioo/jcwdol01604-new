"use client";

import React from 'react';
import { useFormikContext, Field } from 'formik';
import Heading from '@/utils/Heading';
import CategoryInput from '@/utils/Inputs/CategoryInput';
import { categories } from '@/utils/DataConstant';

interface StepCategoryProps {
    errors: any;
    touched: any;
}

const StepCategory: React.FC<StepCategoryProps> = ({ errors, touched }) => {
    // Ambil values dari Formik
    const { values, setFieldValue } = useFormikContext<{ category: string }>();

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Apa tipe tempat yang bisa digunakan tamu?"
                subtitle="Pilih kategori properti Anda"
            />
            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <CategoryInput
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        selected={values.category === item.label}
                        onClick={(cat) => setFieldValue('category', cat)}
                    />
                ))}
            </div>
            {errors.category && touched.category && (
                <div className="text-red-500 text-sm">{errors.category}</div>
            )}
        </div>
    );
};

export default StepCategory;
