"use client";

import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import SearchModal from "./SearchModal";

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    return (
        <div>
            {/* SEARCH BAR WRAPPER */}
            <div
                onClick={handleOpenModal}
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
                <div
                    className="
            flex
            flex-row
            items-center
            justify-between
            px-4
          "
                >
                    {/* Bagian kiri */}
                    <div className="text-sm font-semibold">
                        Where ?
                    </div>
                    {/* Bagian tengah (optional label) */}
                    <div className="hidden sm:block text-sm font-semibold border-x-[1px] px-4 flex-1 text-center">
                        Any Week
                    </div>
                    {/* Bagian kanan */}
                    <div className="text-sm pl-4 text-gray-600 flex flex-row items-center gap-3">
                        <div className="hidden sm:block">Add Guests</div>
                        <div
                            className="
                p-2
                bg-zinc-700
                rounded-full
                text-white
              "
                        >
                            <BiSearch size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isOpen && (
                <div>
                    <SearchModal onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}