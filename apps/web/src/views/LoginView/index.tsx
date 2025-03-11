import React from 'react'
import LoginForm from './components/LoginForm'
import Container from '@/layouts/Container'
import { HomeLayouts } from '@/layouts/HomeLayouts'

export default function LoginView() {
    return (
        <HomeLayouts>
            <LoginForm />
        </HomeLayouts>
    )
}