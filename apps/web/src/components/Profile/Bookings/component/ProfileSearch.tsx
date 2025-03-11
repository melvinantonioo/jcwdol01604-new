"use client";
import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilterDate: (date: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterDate }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    return (
        <div className="flex gap-4 mb-4">
            {/* Input Search Bar */}
            <input
                type="text"
                placeholder="Search by name, email, or event name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />

            {/* Dropdown Filter (Date Range) */}
            <select
                onChange={(e) => onFilterDate(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2"
            >
                <option value="">Past 3 months</option>
                <option value="6months">Past 6 months</option>
                <option value="1year">Past 1 year</option>
            </select>
        </div>
    );
};

export default SearchBar;