import React, { ReactNode } from 'react'
import ClientCompopnent from './ClientComponent'
import { Navbar } from '@/components/Navbar/Navbar'
import RegisterModal from '@/components/Modals/RegisterModal'
import RentModal from '@/components/Modals/RentModal'
import FilterModal from '@/components/Filter/FilterModal';
import Footer from '@/components/Footer'

interface HomeLayoutProps {
    children: ReactNode;
}


export const HomeLayouts: React.FC<HomeLayoutProps> = ({children}) => {
    return(
        <ClientCompopnent>
            <Navbar />
            <RegisterModal />
            <RentModal />
            <FilterModal />
            <div className='pb-20 pt-40'>
                {children}
            </div>
            <Footer/>
        </ClientCompopnent>
    )
}
