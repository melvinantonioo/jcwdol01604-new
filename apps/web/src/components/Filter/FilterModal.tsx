// components/Filter/FilterModal.tsx
"use client";

import React from "react";
import Modal from "@/components/Modals/Modal";
import useFilterModal from "@/hooks/useFilterModal";
import Heading from "@/utils/Heading";
import Button from "@/utils/Button";
import ClientCompopnent from "@/layouts/ClientComponent";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { filterSchema } from "./filterValidation";
import { CategoryGrid } from "@/utils/CategoryGrid";

const FilterModal = () => {
    const filterModal = useFilterModal();
    const router = useRouter();

    const initialValues = {
        name: "",
        minPrice: "",
        maxPrice: "",
        category: "",
        sort: "", // 'priceAsc' atau 'priceDesc'
    };

    // Ketika form disubmit
    function handleFormikSubmit(values: typeof initialValues) {
        const { name, minPrice, maxPrice, category, sort } = values;

        // Bikin query param
        const query = new URLSearchParams();
        if (name) query.set("name", name);
        if (minPrice) query.set("minPrice", minPrice);
        if (maxPrice) query.set("maxPrice", maxPrice);
        if (category) query.set("categoryId", category); // pakai 'categoryId' di URL
        if (sort) query.set("sort", sort);

        // Redirect ke /search
        router.push(`/search?${query.toString()}`);

        // Tutup modal
        filterModal.onClose();
    }

    return (
        <ClientCompopnent>
            <Formik
                initialValues={initialValues}
                validationSchema={filterSchema}
                onSubmit={handleFormikSubmit}
            >
                {({ resetForm, handleSubmit }) => (
                    <Modal
                        isOpen={filterModal.isOpen}
                        onClose={filterModal.onClose}
                        // Modal ini punya prop onSubmit, kita pancing agar memanggil handleSubmit-nya Formik
                        // Caranya, kita panggil handleSubmit() di sini
                        onSubmit={handleSubmit as any}
                        title="Filter"
                        actionLabel="Terapkan"
                        body={
                            <Form id="filterForm" className="flex flex-col gap-4">
                                <Heading
                                    title="Filter Pencarian"
                                    subtitle="Sesuaikan kriteria penginapan"
                                    center
                                />

                                {/* Nama Property */}
                                <div className="flex flex-col gap-2">
                                    {/* <label className="font-semibold text-sm">Nama Properti</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        className="
                                                w-full
                                                p-2
                                                border
                                                rounded-md
                                                focus:outline-none
                                                focus:ring-1
                                                focus:ring-zinc-400
                    "
                                        placeholder="Contoh: Villa Bali"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    /> */}
                                </div>

                                {/* Rentang Harga */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-sm">
                                        Rentang Harga (per malam)
                                    </label>
                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-col w-full">
                                            <Field
                                                type="number"
                                                name="minPrice"
                                                className="
                            w-full
                            p-2
                            border
                            rounded-md
                            focus:outline-none
                            focus:ring-1
                            focus:ring-zinc-400
                        "
                                                placeholder="Minimum"
                                            />
                                            <ErrorMessage
                                                name="minPrice"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Field
                                                type="number"
                                                name="maxPrice"
                                                className="
                                                    w-full
                                                    p-2
                                                    border
                                                    rounded-md
                                                    focus:outline-none
                                                    focus:ring-1
                                                    focus:ring-zinc-400
                        "
                                                placeholder="Maksimum"
                                            />
                                            <ErrorMessage
                                                name="maxPrice"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category */}
                                <CategoryGrid />

                                {/* Sorting */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-sm">Urutkan Harga</label>
                                    <Field
                                        as="select"
                                        name="sort"
                                        className="
                                            w-full
                                            p-2
                                            border
                                            rounded-md
                                            focus:outline-none
                                            focus:ring-1
                                            focus:ring-zinc-400
                    "
                                    >
                                        <option value="">(Default)</option>
                                        <option value="priceAsc">Termurah → Termahal</option>
                                        <option value="priceDesc">Termahal → Termurah</option>
                                    </Field>
                                    <ErrorMessage
                                        name="sort"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                            </Form>
                        }
                        footer={
                            <div className="flex items-center justify-end gap-4 w-full">
                                <Button
                                    outline
                                    label="Reset"
                                    onClick={() => resetForm()}
                                />
                            </div>
                        }
                    />
                )}
            </Formik>
        </ClientCompopnent>
    );
};

export default FilterModal;
