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
            image: 'https://images.pexels.com/photos/2228580/pexels-photo-2228580.jpeg',
            title: 'The Art of Mindfulness',
            subtitle: 'Find Your Inner Peace',
            tag: 'Best Seller'
        },
        {
            image: 'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg',
            title: 'Digital Nomad Revolution',
            subtitle: 'Work From Anywhere',
            tag: 'Trending'
        },
        {
            image: 'https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg',
            title: 'Quantum Computing Basics',
            subtitle: 'Future of Technology',
            tag: 'New Release'
        },
        {
            image: 'https://images.pexels.com/photos/3856026/pexels-photo-3856026.jpeg',
            title: 'Culinary Adventures',
            subtitle: 'Global Kitchen Stories',
            tag: 'Editor\'s Choice'
        },
        {
            image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
            title: 'Urban Photography',
            subtitle: 'City Life Through Lens',
            tag: 'Featured'
        },
        {
            image: 'https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg',
            title: 'Sustainable Living',
            subtitle: 'Eco-Friendly Lifestyle',
            tag: 'Popular'
        },
        {
            image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
            title: 'Space Exploration',
            subtitle: 'Journey to the Stars',
            tag: 'Science'
        },
        {
            image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg',
            title: 'Ancient Civilizations',
            subtitle: 'Lost Worlds Revealed',
            tag: 'History'
        }
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
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75"></div>

                            {/* Category Tag with Random Colors */}
                            <div className={`absolute top-4 left-4 ${
                                index % 4 === 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                                index % 4 === 1 ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                                index % 4 === 2 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                'bg-gradient-to-r from-blue-500 to-cyan-500'
                            } text-white px-4 py-1.5 rounded-full font-semibold text-sm shadow-lg`}>
                                {slide.tag}
                            </div>

                            {/* Text Content with Enhanced Styling */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-2xl font-bold mb-2 text-shadow-lg tracking-wide">{slide.title}</h3>
                                <p className="text-sm opacity-90 font-medium tracking-wide">{slide.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel; 