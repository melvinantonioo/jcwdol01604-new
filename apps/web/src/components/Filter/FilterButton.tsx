// components/Filter/FilterButton.tsx
"use client";

import { useCallback } from "react";
import { TbAdjustmentsHorizontal } from "react-icons/tb"; // contoh icon filter
import useFilterModal from "@/hooks/useFilterModal";

export default function FilterButton() {
    const filterModal = useFilterModal();

    const onClick = useCallback(() => {
        filterModal.onOpen();
    }, [filterModal]);

    return (
        <button
            onClick={onClick}
            className="
        ml-4
        flex
        items-center
        gap-2
        border
        rounded-full
        px-4
        py-2
        transition
        hover:shadow-md
      "
        >
            <TbAdjustmentsHorizontal size={20} />
            <span className="font-medium text-sm">Filter</span>
        </button>
    );
}
