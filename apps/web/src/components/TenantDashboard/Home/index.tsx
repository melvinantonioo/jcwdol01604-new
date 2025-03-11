"use client";
import CardItem from './Card';
import useAuthStore from '@/stores/AuthStores';

const AdminHome: React.FC = () => {
    const { user, clearAuth } = useAuthStore();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Hi-hello,{user?.name} </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardItem
                    title="Create faster with AI"
                    description="Build a few Prompt to generate an Ads that's ready to publish in minutes."
                    imageSrc="/poster.webp"
                    link="/create-with-ai"
                />
                <CardItem
                    title="Sewakan Tempat Kamu"
                    description="Tentukan Kategori anda , harga , dan iklankan property kamu."
                    imageSrc="/cool-design.avif"
                    link="/admin/create"
                />
            </div>
        </div>
    );
};

export default AdminHome;