import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';

export default function TrendingCarousel() {
    return (
        <div className="flex items-center justify-center h-auto bg-gray-100">
            <Swiper
                effect="cards"
                grabCursor={true}
                modules={[EffectCards]}
                className="w-60 h-80"
            >
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-red-600">
                    <img src="https://i.pinimg.com/736x/dd/73/4c/dd734c1cf9adf9ec3cf3c3abb2638321.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-blue-500">
                    <img src="https://i.pinimg.com/736x/56/6d/56/566d56acaf66f8406054199e21220cb8.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-green-500">
                    <img src="https://i.pinimg.com/736x/f1/48/e4/f148e4657416369c3ba81fdea43fb649.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-orange-600">
                    <img src="https://i.pinimg.com/736x/fe/b9/50/feb950edee3121135600e4930624147d.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-yellow-600">
                    <img src="https://i.pinimg.com/736x/39/24/cc/3924ccf353d2f452080711c145602873.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-pink-700">
                    <img src="https://i.pinimg.com/736x/16/e4/4a/16e44a1228db05d403459cc8010a4a5e.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-green-800">
                    <img src="https://i.pinimg.com/736x/0a/cb/53/0acb53df3922624786dba5fa0de5af02.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-blue-800">
                    <img src="https://i.pinimg.com/736x/58/07/a8/5807a8afa4e115a164220d8756befc44.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide className="flex items-center justify-center text-white text-xl font-bold rounded-lg bg-purple-600">
                    <img src="https://i.pinimg.com/736x/c3/0d/13/c30d13d714c7b81c6d4989c339e28bc8.jpg" alt="" />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
