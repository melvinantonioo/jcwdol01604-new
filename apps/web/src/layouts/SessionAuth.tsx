"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}

// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import useAuthStore from "@/stores/AuthStores";

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const { data: session } = useSession();
//     const { onAuthSuccess, clearAuth } = useAuthStore();

//     useEffect(() => {
//         if (session?.user) {
//             onAuthSuccess(session.user, session.backendAccessToken);
//         } else {
//             clearAuth();
//         }
//     }, [session, onAuthSuccess, clearAuth]);

//     return <>{children}</>;
// };

// export default AuthProvider;