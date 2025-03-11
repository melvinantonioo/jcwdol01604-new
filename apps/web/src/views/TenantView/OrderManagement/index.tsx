import OrderSectionManagement from '@/components/TenantDashboard/OrderManagemnt'
import ClientCompopnent from '@/layouts/ClientComponent'
import AdminLayout from '@/layouts/TenantLayouts'
import React from 'react'

export default function OrderManagementView() {
    return (
        <ClientCompopnent>
            <AdminLayout>
                <OrderSectionManagement />
            </AdminLayout>
        </ClientCompopnent>
    )
}
