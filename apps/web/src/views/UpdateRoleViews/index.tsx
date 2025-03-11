import UpdateRolePage from '@/components/UpdateRole';
import ClientCompopnent from '@/layouts/ClientComponent';
import { HomeLayouts } from '@/layouts/HomeLayouts';
import React from 'react'

const UpdateRoleViews = () => {
    return (
        <ClientCompopnent>
            <HomeLayouts>
                <UpdateRolePage />
            </HomeLayouts>
        </ClientCompopnent>
    )
}

export default UpdateRoleViews;