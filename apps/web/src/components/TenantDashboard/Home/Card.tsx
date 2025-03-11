"use client"
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface CardItemProps {
    title: string;
    description: string;
    imageSrc: string;
    link: string;
}

const CardItem: React.FC<CardItemProps> = ({ title, description, imageSrc, link }) => {
    const router = useRouter();

    const handleNavigation = () => {
        router.push(link);
    };
    return (
        <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="flex flex-col border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white transition-all duration-300"
            onClick={handleNavigation}
        >
            <div className="flex-grow">
                <img src={imageSrc} alt={title} className="w-full h-40 object-cover" />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
                <div className="flex items-center justify-end">
                    <div className="flex items-center justify-end text-orange-600 hover:text-orange-800">
                        <FaPlus className="mr-1" /> Create
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CardItem;