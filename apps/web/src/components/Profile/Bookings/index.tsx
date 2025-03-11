"use client";
import { useState } from "react";
import SearchBar from "./component/ProfileSearch";
import OrderList from "./component/List";
import ProfileOrderList from "./component/List";

const ProfileBooking: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [orders, setOrders] = useState([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterDate = (date: string) => {
        setFilterDate(date);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Bookings</h1>
            {/* <SearchBar onSearch={handleSearch} onFilterDate={handleFilterDate} /> */}
            <ProfileOrderList />
        </div>
    );
};

export default ProfileBooking;
