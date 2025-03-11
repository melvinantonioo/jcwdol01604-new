"use client";
import dynamic from "next/dynamic";
import React from "react";

const SimpleLeafletMap = dynamic(() => import("@/utils/SimpleMap"), {
    ssr: false,
});

export default function TestMapPage() {
    return (
        <div style={{ height: "80vh", width: "100%" }}>
            <SimpleLeafletMap />
        </div>
    );
}