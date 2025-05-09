// components/Carousel.js
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {

    const settings = {
        infinite: true,
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        focusOnSelect: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const slides = [
        {
            image: 'https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg',
            title: 'Be yourself & Never Surrender',
            subtitle: 'Inspirational Journey',
        },
        {
            image: 'https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg',
            title: 'Theory: Is Alien Real',
            subtitle: 'Explore the Unknown',
        },
        {
            image: 'https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg',
            title: 'The Unseen',
            subtitle: 'Discover Hidden Mysteries',
        },
    ];

    return (
        <div className="w-full lg:w-4/5 mx-auto py-10">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="p-2">
                        <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                            {/* Image with overlay */}
                            <img
                                src={slide.image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75"></div>

                            {/* Best Seller Tag */}
                            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold text-xs">
                                Best Seller
                            </div>

                            {/* Text Content */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-xl font-bold mb-1">{slide.title}</h3>
                                <p className="text-sm opacity-80">{slide.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
