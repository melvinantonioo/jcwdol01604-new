'use client';
import React, { useMemo, useState } from 'react'
import Modal from './Modal';
import useRentModal from '@/app/hooks/useRent';
import Heading from '@/utils/Heading';
import { categories } from '@/components/CategoryBox/Categories';
import CategoryInput from '../utility/CategoryInput';
import { FieldValues, useForm } from 'react-hook-form';
// import CountrySelect from '@/utils/Inputs/CountrySelect';
// import Map from '@/utils/Map';
// import Map2 from '@/utils/Map2';

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);

    //integrated with Form 
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const category = watch('category');
    const location = watch('location')

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Back';
    }, [step])

    //changable content
    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='Jadikan Propertymu Peluang'
                subtitle='Pilih Category'
            />
            <div
                className='
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto
            '
            >
                {categories.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        {/* {item.label} */}
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={false}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}


                {/* <CountrySelect
                    onChange={(value) => setCustomValue('location', value)}
                    value={location}
                />

                <Map2 /> */}

            </div>

        </div>

    )

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={rentModal.onClose}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Renting Your Property!'
            body={bodyContent}
        />
    )
}

export default RentModal