"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "@/lib/AxiosInstance";
import { useRouter, useSearchParams } from "next/navigation";
import { BiSearch } from "react-icons/bi";

const SearchSchema = Yup.object().shape({
    name: Yup.string().optional(),
    location: Yup.string().optional(),
    categoryId: Yup.number().nullable().optional(),
    startDate: Yup.date().nullable().optional(),
    endDate: Yup.date().nullable().optional(),
    sort: Yup.string().optional(),
});

export interface ISearchFormValues {
    name: string;
    location: string;
    categoryId: number | undefined;
    startDate: string;
    endDate: string;
    sort: string;
}

export default function SearchForm() {
    const router = useRouter();

    const initialValues: ISearchFormValues = {
        name: "",
        location: "",
        categoryId: undefined,
        startDate: "",
        endDate: "",
        sort: "",
    };

    const onSubmit = async (values: ISearchFormValues) => {
        // Bentuk query param
        const queryParams = new URLSearchParams();

        if (values.name) queryParams.set("name", values.name);
        if (values.location) queryParams.set("location", values.location);
        if (values.categoryId) queryParams.set("categoryId", String(values.categoryId));
        if (values.startDate) queryParams.set("startDate", values.startDate);
        if (values.endDate) queryParams.set("endDate", values.endDate);
        if (values.sort) queryParams.set("sort", values.sort);

        // Cara 1: Langsung fetch data
        // or
        // Cara 2: Redirect ke page search, misal /search?...

        // Contoh: langsung fetch:
        try {
            const { data } = await axios.get(`/property/search?${queryParams.toString()}`);
            console.log("Search result:", data);
            // Tampilkan data di UI (Anda bisa pass ke state di parent, dsb)
        } catch (error) {
            console.error("Failed to search property:", error);
        }
    };

    return (
        /**
     * Wrapper utama (div) 
     * Meniru styling snippet: border 1px, rounded-full, shadow, dll.
     */
        <div
            className="
        border-[1px]
        w-full
        md:w-auto
        py-2
        rounded-full
        shadow-sm
        hover:shadow-lg
        transition
      "
        >
            <Formik
                initialValues={initialValues}
                validationSchema={SearchSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, handleSubmit }) => (
                    /**
                     * Kita jadikan form dalam 1 baris (flex row).
                     * Boleh diatur responsive (misal: di mobile jadi 2 baris).
                     */
                    <Form
                        onSubmit={handleSubmit}
                        className="
              flex 
              flex-row
              items-center 
              justify-between
              px-2  /* spacing dalam */
              gap-2
            "
                    >
                        {/* Bagian kiri: label text 'Search' (optional) */}
                        <div className="text-sm font-semibold px-2 hidden md:block">
                            Search
                        </div>

                        {/* Field 'name' */}
                        <div className="flex-1">
                            <Field
                                name="name"
                                placeholder="Nama Properti..."
                                className="
                  text-sm
                  bg-transparent
                  outline-none
                  border-none
                  w-full
                "
                            />
                            {errors.name && touched.name && (
                                <p className="text-red-500 text-xs">{errors.name}</p>
                            )}
                        </div>

                        {/* Garis pembatas vertical (opsional), meniru border-x di snippet */}
                        <div className="hidden sm:block border-x-[1px] h-5 mx-2" />

                        {/* Field 'location' */}
                        <div className="flex-1">
                            <Field
                                name="location"
                                placeholder="Lokasi?"
                                className="
                  text-sm
                  bg-transparent
                  outline-none
                  border-none
                  w-full
                "
                            />
                            {errors.location && touched.location && (
                                <p className="text-red-500 text-xs">{errors.location}</p>
                            )}
                        </div>

                        {/* 
              * Field lain (kategori, date) bisa dibuat dropdown 
              * atau pop-up modal, dsb. 
              * Di snippet Anda ada 'Add' / 'Halo' placeholder - 
              * silakan custom jika diperlukan.
            */}

                        {/* Tombol submit search (ikon) */}
                        <button
                            type="submit"
                            className="
                p-2
                bg-zinc-700
                rounded-full
                text-white
              "
                        >
                            <BiSearch size={18} />
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}