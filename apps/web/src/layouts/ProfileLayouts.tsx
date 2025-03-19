import { ReactNode } from 'react';
import ProfileSidebar from '@/components/Profile/ProfileSidebar';
import ProfileNavbar from '@/components/Profile/ProfileNavbar';

interface ProfileLayoutProps {
    children: ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
    return (
        <div className="flex">  
            <ProfileSidebar />
            <div className="flex-1 md:ml-64">
                <ProfileNavbar />
                <main className="p-4 bg-gray-100 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;