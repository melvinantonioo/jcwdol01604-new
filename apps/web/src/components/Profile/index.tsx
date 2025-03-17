"use client";
import ProfileLayout from '@/layouts/ProfileLayouts';
import { useProfile } from '@/lib/FetchProfile';
import React, { useState } from 'react'
import ProfileCard from './ProfileCard';
import Button from '@/utils/Button';
import ChangeEmailModal from './EmailModal';
import ResendVerificationButton from './ResendVerif';

const ProfilesComponent = () => {
    const { profile, loading, error } = useProfile();
    const [isModalOpen, setIsModalOpen] = useState(false);


    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <ProfileLayout>
            <ProfileCard profile={profile} />

            <div className="mt-4 flex flex-col gap-8">
                <Button label="Ganti Email" onClick={() => setIsModalOpen(true)} />

                {!profile.emailVerified && <ResendVerificationButton />}
            </div>

            <ChangeEmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </ProfileLayout>
    )
}

export default ProfilesComponent;