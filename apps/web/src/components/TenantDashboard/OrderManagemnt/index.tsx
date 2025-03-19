"use client";
import { useState } from "react";
import SearchBar from "./component/SearchBar";
import OrderList from "./component/OrderList";

const OrderSectionManagement: React.FC = () => {
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
            <h1 className="text-3xl font-bold mb-4">Order Management</h1>
            <OrderList />
        </div>
    );
};

export default OrderSectionManagement;
