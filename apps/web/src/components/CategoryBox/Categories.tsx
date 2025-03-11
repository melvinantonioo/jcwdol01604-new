"use client";
import React from 'react'
import Container from '@/layouts/Container'

import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { GiWindmill, GiIsland, GiBoatFishing, GiCastle, GiForestCamp, GiCaveEntrance } from 'react-icons/gi';
import { MdOutlineVilla, MdOutlineApartment } from 'react-icons/md';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';

import CategoryBox from './CategoryBox';
import { usePathname, useSearchParams } from 'next/navigation';

export const categories = [
    {
        label: 'Beach',
        icon: TbBeach,
        description: "This Beach"
    },
    {
        label: 'Villa',
        icon: MdOutlineVilla,
        description: " Villa"
    },
    {
        label: 'Apartment',
        icon: MdOutlineApartment,
        description: " Villa"
    },
    {
        label: 'CountrySide',
        icon: TbMountain,
        description: " This Windmill"
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: " This Windmill"
    },
    {
        label: 'Island',
        icon: GiIsland,
        description: " This Windmill"
    },
    {
        label: 'Lake',
        icon: GiBoatFishing,
        description: " This Windmill"
    },
    {
        label: 'Skiing',
        icon: FaSkiing,
        description: " This Windmill"
    },
    {
        label: 'Castles',
        icon: GiCastle,
        description: " This Windmill"
    },
    {
        label: 'Camping',
        icon: GiForestCamp,
        description: " This Windmill"
    },
    {
        label: 'Arctic',
        icon: BsSnow,
        description: " This Windmill"
    },
    {
        label: 'Cave',
        icon: GiCaveEntrance,
        description: " This Windmill"
    },

]

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');

    const pathname = usePathname();

    const isMainPage = pathname === '/';

    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div
                className='
            pt-4
            flex
            flex-row
            items-center
            justify-between
            overflow-x-auto
            '
            >
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories