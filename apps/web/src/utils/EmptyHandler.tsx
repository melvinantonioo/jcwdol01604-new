"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import Heading from '@/utils/Heading';
import Button from '@/utils/Button';

interface EmptyProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const Empty: React.FC<EmptyProps> = ({
    title = " No exact Matches",
    subtitle = "try changing or remove your filters",
    showReset
}) => {
    const router = useRouter();

    return (
        <div className='
            h-[60vh]
            flex
            flex-c
            gap-2
            justify-center
            items-center
        '>
            <Heading
                center
                title={title}
                subtitle={subtitle}
            />

            <div className='w-48 mt-4'>
                {showReset && (
                    <Button
                        outline
                        label='Remove your filter'
                        onClick={() => router.push('/')}
                    />
                )}
            </div>

        </div>
    )
}

export default Empty