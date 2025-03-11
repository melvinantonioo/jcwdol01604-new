"use client";
import React, { useEffect, useState } from 'react';

interface ClientCompProps {
    children: React.ReactNode;
}

const ClientCompopnent: React.FC<ClientCompProps> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true);
    }, [])

    if (!hasMounted) {
        return null;
    };

    return (
        <>
            {children}
        </>
    )
}

export default ClientCompopnent