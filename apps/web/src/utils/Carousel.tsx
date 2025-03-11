"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import style Swiper
import 'swiper/css';
import 'swiper/css/pagination';

interface CarouselProps {
    banners: string[]; // Array URL gambar banner
}

const Carousel: React.FC<CarouselProps> = ({ banners }) => {
    return (
        <div className="carousel-container">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3000, // slide berganti setiap 3 detik
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={banner}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-auto object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Carousel;
