import ProfileBooking from '@/components/Profile/Bookings'
import ClientCompopnent from '@/layouts/ClientComponent'
import ProfileLayout from '@/layouts/ProfileLayouts'
import React from 'react'

export default function ProfilBookingView() {
    return (
        <ClientCompopnent>
            <ProfileLayout>
                <ProfileBooking />
            </ProfileLayout>
        </ClientCompopnent>
    )
}
