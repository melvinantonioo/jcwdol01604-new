'use client';
import ClientCompopnent from '@/layouts/ClientComponent';
import React from 'react'
import RegisterForm from './Components/RegisForm';
import Container from '@/layouts/Container';
import { HomeLayouts } from '@/layouts/HomeLayouts';


export default function RegisView() {
    return (
        <ClientCompopnent>
            <Container>
                <HomeLayouts>
                    <RegisterForm />
                </HomeLayouts>
            </Container>
        </ClientCompopnent>
    )
}