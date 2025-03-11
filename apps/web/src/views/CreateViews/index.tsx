"use client";

import React, { useState } from 'react';
import { Formik, Form } from 'formik';

import NavbarCreate from '@/components/CreateListing/Components/NavbarCreate';

// Import step components
import StepCategory from '@/components/CreateListing/MultiSteps/Category';
import StepLocation from '@/components/CreateListing/MultiSteps/Location';
import StepInfo from '@/components/CreateListing/MultiSteps/Info';
import StepRooms from '@/components/CreateListing/MultiSteps/Rooms';
import StepPrice from '@/components/CreateListing/MultiSteps/Price';
import StepImages from '@/components/CreateListing/MultiSteps/Images';
import StepReview from '@/components/CreateListing/MultiSteps/Reviews';

// Import Yup schemas
import {
    CategorySchema,
    LocationSchema,
    InfoSchema,
    RoomsSchema,
    PriceSchema,
    ImagesSchema,
    ReviewSchema,
} from '@/components/CreateListing/Validation/index';

// Import reusable Button
import Button from '@/utils/Button';
import StepRooms2 from '@/components/CreateListing/MultiSteps/Rooms2';
import axiosInstance from '@/lib/AxiosInstance';

/**
 * Kita definisikan total step (0 sampai 6).
 * Masing-masing step punya schema validasi sendiri.
 */
const validationSchemas = [
    CategorySchema,
    LocationSchema,
    InfoSchema,
    RoomsSchema,
    PriceSchema,
    ImagesSchema,
    ReviewSchema, // Step 6
];

export default function CreatePropertyPage() {
    // Step penanda multi-step
    const [step, setStep] = useState(0);

    // Initial values untuk semua field yang diperlukan
    const initialValues = {
        category: '',
        location: '',
        region: '',
        name: '',
        description: '',
        rooms: [], // ⬅️ Array kosong, akan diisi room
        // bathrooms: 1,
        // maxGuests: 1,
        basePrice: '',
        images: [] as File[], // ⬅️ File untuk upload gambar
        isDeleted: false,       // default false
    };

    // Handler untuk ke step selanjutnya
    const handleNext = async (
        validateForm: any,
        errors: any,
        setTouched: any,
        values: any
    ) => {
        // Validasi step saat ini
        const currentSchema = validationSchemas[step];
        try {
            // Validate hanya field yang relevan di step ini
            await currentSchema.validate(values, { abortEarly: false });
            // Jika lolos validasi, lanjut step
            setStep((prev) => prev + 1);
        } catch (err: any) {
            // Jika error, setTouched untuk menampilkan error
            const touchedFields = Object.keys(err.inner?.reduce?.((acc: any, curr: any) => {
                acc[curr.path] = true;
                return acc;
            }, {}) || {});
            touchedFields.forEach((field) => {
                setTouched((prev: any) => ({
                    ...prev,
                    [field]: true,
                }));
            });
        }
    };

    // Handler untuk ke step sebelumnya
    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    // ✅ Submit final (step terakhir)
    const onSubmitFinal = async (values: any) => {
        try {
            console.log("✅ Data sebelum dikirim:", values);

            // 🔹 Gunakan FormData untuk mengirim file & JSON
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("categoryId", values.category);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("region", values.region);
            formData.append("basePrice", values.basePrice);

            // 🔹 JSON.stringify untuk rooms (harus dikirim dalam string)
            formData.append("rooms", JSON.stringify(values.rooms));

            // 🔹 Upload semua gambar
            values.images.forEach((file: File) => {
                formData.append("file", file);
            });

            // 🔹 Kirim ke backend menggunakan axiosInstance
            const response = await axiosInstance.post("/property/create-listing", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ Response dari server:", response.data);
            alert("Property berhasil dibuat!");

        } catch (error: any) {
            console.error("❌ Error saat submit:", error.response?.data || error.message);
            alert("Terjadi kesalahan saat membuat property");
        }
    };
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarCreate />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Formik
                    initialValues={initialValues}
                    // Validasi di-handle manual per step (bukan di sini)
                    onSubmit={onSubmitFinal}
                >
                    {({ values, errors, touched, validateForm, setTouched }) => (
                        <Form className="max-w-lg w-full">
                            {/* Render Step Sesuai State step */}
                            {step === 0 && <StepCategory errors={errors} touched={touched} />}
                            {step === 1 && <StepLocation errors={errors} touched={touched} />}
                            {step === 2 && <StepInfo errors={errors} touched={touched} />}
                            {step === 3 && <StepRooms2 errors={errors} touched={touched} />}
                            {step === 4 && <StepPrice errors={errors} touched={touched} />}
                            {step === 5 && <StepImages />}
                            {step === 6 && <StepReview values={values} />}

                            {/* Tombol Navigasi */}
                            <div className="mt-8 flex gap-4">
                                {step > 0 && (
                                    <Button
                                        label="Kembali"
                                        outline
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleBack();
                                        }}
                                    />
                                )}

                                {step < 6 && (
                                    <Button
                                        label="Selanjutnya"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            // Lakukan validasi step
                                            await handleNext(validateForm, errors, setTouched, values);
                                        }}
                                    />
                                )}

                                {/* Step terakhir: Submit */}
                                {step === 6 && (
                                    <Button
                                        label="Simpan"
                                        onClick={() => { }}
                                        // Gunakan type="submit" agar memicu Formik onSubmit
                                        // atau panggil handleSubmit() manual
                                        // Di sini kita contohkan type="submit"
                                        // agar onSubmitFinal terpanggil
                                        // type="submit"
                                    />
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
