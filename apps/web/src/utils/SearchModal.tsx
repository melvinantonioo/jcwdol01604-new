"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";
import CountrySelect from "./Inputs/CountrySelect";

interface SearchModalProps {
    onClose: () => void;
}

export const SearchSchema = Yup.object().shape({
    location: Yup.string()
        .nullable()
        .optional(),

    startDate: Yup.date()
        .transform((currentValue, originalValue) => {
            // Jika originalValue adalah "" (string kosong), maka ubah ke null
            return originalValue === "" ? null : currentValue;
        })
        .nullable()
        .optional(),

    endDate: Yup.date()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable()
        .optional(),

    // guests: opsional (boleh kosong), atau jika ingin minimal 1 jika diisi
    guests: Yup.number()
        .nullable()
        .min(1, "Minimal 1 guest")
        .optional(),
});

export default function SearchModal({ onClose }: SearchModalProps) {
    const router = useRouter();

    const initialValues = {
        location: "",
        startDate: "",
        endDate: "",
        guests: 1,
    };

    // Optional: close modal when user presses ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const onSubmit = (values: typeof initialValues) => {
        // Susun query
        const query = new URLSearchParams();
        if (values.location) query.set("location", values.location);
        if (values.startDate) query.set("startDate", values.startDate);
        if (values.endDate) query.set("endDate", values.endDate);
        if (values.guests) query.set("guests", String(values.guests));

        // Arahkan ke /search
        router.push(`/search?${query.toString()}`);
        onClose();
    };

    return (
        <div
            className="
        fixed 
        inset-0 
        bg-black/30 
        flex 
        items-center 
        justify-center 
        z-50
      "
        >
            {/* Container Modal */}
            <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg relative">

                {/* Tombol close di pojok */}
                <button
                    className="absolute top-3 right-3 text-gray-600"
                    onClick={onClose}
                >
                    <AiOutlineClose size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Search Destinations</h2>

                    {/* Formik form */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SearchSchema}
                        onSubmit={onSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="flex flex-col gap-4">
                                {/* location */}
                                <div>
                                    <label className="block">Location</label>
                                    <Field
                                        name="location"
                                        className="border p-2 w-full rounded"
                                        placeholder="e.g. Bali, Jakarta"
                                    />
                                    {errors.location && touched.location && (
                                        <p className="text-red-500 text-sm">{errors.location}</p>
                                    )}
                                </div>

                                <div>
                                    {/* <CountrySelect 
                                        onChange={(value) => set}
                                    /> */}
                                </div>

                                {/* startDate */}
                                <div>
                                    <label className="block">Check In</label>
                                    <Field
                                        type="date"
                                        name="startDate"
                                        className="border p-2 w-full rounded"
                                    />
                                    {errors.startDate && touched.startDate && (
                                        <p className="text-red-500 text-sm">{errors.startDate}</p>
                                    )}
                                </div>

                                {/* endDate */}
                                <div>
                                    <label className="block">Check Out</label>
                                    <Field
                                        type="date"
                                        name="endDate"
                                        className="border p-2 w-full rounded"
                                    />
                                    {errors.endDate && touched.endDate && (
                                        <p className="text-red-500 text-sm">{errors.endDate}</p>
                                    )}
                                </div>

                                {/* guests */}
                                <div>
                                    <label className="block">Guests</label>
                                    <Field
                                        type="number"
                                        name="guests"
                                        min={1}
                                        className="border p-2 w-full rounded"
                                    />
                                    {errors.guests && touched.guests && (
                                        <p className="text-red-500 text-sm">{errors.guests}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="bg-zinc-600 text-white p-2 rounded font-semibold"
                                >
                                    Search
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}