"use client";
import { useSession } from "next-auth/react";

export const useAuth = () => {
    const { data: session } = useSession();
    return { token: session?.accessToken };
};

//ini untuk sisipin Token Bearer Header 

//contoh
// import { useAuth } from "@/hooks/useAuth";

// const { token } = useAuth();

// const fetchProperties = async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     const data = await response.json();
//     console.log(data);
// };