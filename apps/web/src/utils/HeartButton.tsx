"use client";
import { IUser } from '@/stores/AuthStores';
import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface HeartButtonProps {
    listingId: string;
    currentUser?: IUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
    listingId,
    currentUser
}) => {
    const hasFavorited = false;
    const toggleFavorite = () => { }

    return (
        <div
            onClick={toggleFavorite}
            className='
                relative
                hover:opacity-80
                transition
                cursor-pointer
            '
        >
            <AiOutlineHeart
                size={28}
                className='
                    fill-white
                    absolute
                    -top-[2px]
                    -right-[2px]
                '
            />
            <AiFillHeart 
                size={24}
                className={hasFavorited ? 'fill-rose-500' : 'fill-neutra-500/700'}
            />
        </div>
    )
}

export default HeartButton