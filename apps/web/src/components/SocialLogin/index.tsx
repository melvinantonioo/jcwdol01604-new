"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function SocialLogin() {
    const { data: session } = useSession();

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="flex flex-col items-center">
            {session ? (
                <>
                    <div className="flex items-center space-x-4">
                        <Image src={session.user?.image || "/avatar-1.jpg"} alt="Avatar" width={30} height={30} className="rounded-full" />
                        <p className="text-lg font-semibold">{session.user?.name}</p>
                    </div>
                    <button onClick={handleLogout} className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg">
                        Logout
                    </button>
                </>
            ) : (
                <button onClick={handleGoogleLogin} className="bg-zinc-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <Image src="/google-icon-logo-svgrepo-com.svg" alt="Google Icon" width={20} height={20} className="mr-2" />
                    Sign in with Google
                </button>
            )}
        </div>
    );
}
