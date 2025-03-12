import React from 'react';
import ClientCompopnent from '@/layouts/ClientComponent';
import AdminLayout from '@/layouts/TenantLayouts';
import TenantReviews from './ReviewTenant';

export default function TenantReviewViews() {
    return (
        <ClientCompopnent>
            <AdminLayout>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Review Properti Saya</h1>
                    <TenantReviews />
                </div>
            </AdminLayout>
        </ClientCompopnent>
    )
}