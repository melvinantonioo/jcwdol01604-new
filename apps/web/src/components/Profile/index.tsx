"use client";
import ProfileLayout from '@/layouts/ProfileLayouts';
import { useProfile } from '@/lib/FetchProfile';
import React from 'react'
import ProfileCard from './ProfileCard';

const ProfilesComponent = () => {
    const { profile, loading, error } = useProfile();

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <ProfileLayout><ProfileCard profile={profile} /></ProfileLayout>
    )
}

export default ProfilesComponent;