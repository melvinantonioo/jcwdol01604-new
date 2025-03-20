"use client";
import React from 'react'
import Image from 'next/image';

import Link from 'next/link';

const Logo = () => {


    return (

        <Link
            className="text-orange-600 font-bold text-2xl"

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