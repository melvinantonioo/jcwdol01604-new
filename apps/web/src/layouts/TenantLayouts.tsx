import Navbar from '@/components/TenantDashboard/TenantNavbar';
import Sidebar from '@/components/TenantDashboard/SideBar';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex">  
            <Sidebar />
            <div className="flex-1 md:ml-64">
                <Navbar />
                <main className="p-4 bg-gray-100 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;