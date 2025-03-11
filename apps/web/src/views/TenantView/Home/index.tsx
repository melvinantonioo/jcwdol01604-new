import AdminHome from '@/components/TenantDashboard/Home'
import ClientCompopnent from '@/layouts/ClientComponent'
import AdminLayout from '@/layouts/TenantLayouts'
import React from 'react'

export default function TenantHomeView() {
    return (
        <ClientCompopnent>
            <AdminLayout>
                <AdminHome />
            </AdminLayout>
        </ClientCompopnent>

    )
}