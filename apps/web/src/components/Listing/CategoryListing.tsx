"use client";
import React from 'react';
import { IconType } from 'react-icons';

interface CategoryListingProps {
    icon: IconType;
    label: string;
    description: string;
}

const CategoryListing: React.FC<CategoryListingProps> = ({
    icon: Icon,
    label,
    description
}) => {
    return (
        <div className='flex flex-col gap-6'>
            
            <div className='flex flex-row items-center gap-4'>
                <Icon size={40} className='text-neutal-600' />
                <div className='flex flex-col'>
                    <div className='text-lg font-semibold'>{label}</div>
                    <div className='text-neutral-500 font-light'>{description}</div>
                </div>
            </div>

        </div>
    )
}

export default CategoryListing;