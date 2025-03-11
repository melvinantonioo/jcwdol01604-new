"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SocialLogin() {
    const handleGoogleLogin = () => {
        // Panggil signIn dari next-auth dengan provider 'google'
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center"
        >
            <Image
                src="/path/to/google-icon.svg"
                alt="Google Icon"
                width={20}
                height={20}
                className="mr-2"
            />
            <span>Sign in with Google</span>
        </button>
    );
}
