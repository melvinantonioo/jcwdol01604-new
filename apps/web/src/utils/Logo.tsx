"use client";
import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Logo = () => {
    // const router = useRouter();

    return (

        <Link
            className="text-orange-600 font-bold text-2xl"
            // onClick={() => router.push('/')}
            href={'/'}
        >
            <Image
                alt="logo"
                className='hidden md:block cursor-pointer'
                height="50"
                width="50"
                src="/MinimalistLogo.png"
            />  
        </Link>
    )
}

export default Logo