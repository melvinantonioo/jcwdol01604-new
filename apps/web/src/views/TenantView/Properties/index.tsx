import PropertyManagement from '@/components/TenantDashboard/PropertyManagement'
import ClientCompopnent from '@/layouts/ClientComponent'
import AdminLayout from '@/layouts/TenantLayouts'
import React from 'react'

export default function PropManagementViews() {
    return (
        <ClientCompopnent>
            <AdminLayout>
                <PropertyManagement />
            </AdminLayout>
        </ClientCompopnent>
    )
}
