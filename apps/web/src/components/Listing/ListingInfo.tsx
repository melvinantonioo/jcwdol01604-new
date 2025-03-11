import { IUser } from '@/stores/AuthStores';
import Avatar from '@/utils/Avatar';
import React from 'react';
import { IconType } from 'react-icons';
import CategoryListing from './CategoryListing';

interface ListingInfoProps {
    user: IUser | null;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined;
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
    return (
        <div className='col-span-4 flex flex-col gap-8'>
            <>
                <div className='flex flex-col gap-2'>
                    <div
                        className='
                        text-xl
                        font-semibold
                        flex
                        flex-row
                        items-center
                        gap-2
                    '
                    >
                        <div>Hosted by {user?.name}</div>
                        <Avatar />
                    </div>
                    <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
                        <div>{guestCount}guests</div>
                        <div>{roomCount}rooms</div>
                        <div>bathrooms</div>
                    </div>
                </div>
            </>


            <>
                {category && (
                    <CategoryListing
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                    />
                )}
            </>

            <>
                <div className='text-lg font-light text-neutral-500'>
                    {description}
                </div>
            </>

            Fetch Map Disini

        </div>
    )
}

export default ListingInfo