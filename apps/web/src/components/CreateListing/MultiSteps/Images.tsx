"use client";
import React, { useState } from "react";
import { useFormikContext } from "formik";
import Heading from "@/utils/Heading";

const StepImages: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<{ images: File[] }>();
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        setFieldValue("images", fileArray);

        // Preview Gambar
        setPreviews(fileArray.map(file => URL.createObjectURL(file)));
    };

    return (
        <div className="flex flex-col gap-8">
            <Heading title="Upload Gambar" subtitle="Tambahkan gambar untuk properti Anda" />

            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="border p-2" />

            <div className="grid grid-cols-3 gap-4">
                {previews.map((src, index) => (
                    <img key={index} src={src} alt="Preview" className="w-full h-32 object-cover rounded" />
                ))}
            </div>
        </div>
    );
};

export default StepImages;
