"use client";

import React from "react";
import SearchForm from "@/utils/SearchForm";

const SearchQuery = () => {
    return (
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
        cursor-pointer
      "
        >

            <SearchForm />
        </div>
    );
};

export default SearchQuery;
