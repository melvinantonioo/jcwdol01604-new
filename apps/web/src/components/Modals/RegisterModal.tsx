"use client"
import React, { useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegister';
import { data } from 'cypress/types/jquery';
import axios from 'axios';
import Modal from './Modal';

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsloading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsloading(true);

        axios.post('/api/register', data)
            .then(() => {
                registerModal.onClose();
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsloading(false);
            })
    };

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}  //ini isi option dari zustand store
            title='Register'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
        />
    )
}

export default RegisterModal