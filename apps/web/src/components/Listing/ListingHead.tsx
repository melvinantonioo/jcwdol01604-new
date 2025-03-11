"use client";
import useAuthStore, { IUser } from '@/stores/AuthStores';
import Heading from '@/utils/Heading';
import HeartButton from '@/utils/HeartButton';
import Image from 'next/image';
import React from 'react';

interface ListingHeadProps {
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
    currentUser?: IUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    locationValue,
    imageSrc,
    id,
    currentUser
}) => {
    const {user} = useAuthStore();

    return (
        <div>
            <Heading
                title={title}
                subtitle={locationValue}
            />

            <div
            className='
                w-full
                h-[60vh]
                overflow-hidden
                rounded-xl
                relative
            '
            >
                <Image 
                    alt='Image'
                    src={imageSrc}
                    fill
                    className='absolute top-5 right-5'
                />
                <div>
                    <HeartButton
                        listingId={id}
                        currentUser={user}
                    />
                </div>

            </div>

        </div>
    )
}

export default ListingHead