import React, { useState, useEffect } from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaStar,
    FaShoppingCart,
} from "react-icons/fa";

const FlashSale = () => {
    const slides = [
        {
            image:
                "https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg",
            title: "Be yourself & Never Surrender",
            subtitle: "Inspirational Journey",
            type: "Adventure",
            rating: 4.5,
            des: "Adventure of Mount Everest",
            author: "Henry Martopo",
            price: 21.99,
            discountPrice: 18.99,
            stock: 45,
        },
        {
            image:
                "https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg",
            title: "Theory: Is Alien Real",
            subtitle: "Explore the Unknown",
            type: "Fiction",
            rating: 4.2,
            des: "Life of wild",
            author: "Alan Turner",
            price: 19.99,
            discountPrice: 15.63,
            stock: 2,
        },
        {
            image:
                "https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg",
            title: "The Unseen",
            subtitle: "Discover Hidden Mysteries",
            type: "Thriller",
            rating: 4.8,
            des: "Story of Everest",
            author: "Stephen King",
            price: 24.99,
            discountPrice: 21.99,
            stock: 45,
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState({
        hours: 5,
        minutes: 42,
        seconds: 19,
    });

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(slideInterval);
    }, [slides.length]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) {
                    seconds = 59;
                    minutes--;
                } else if (hours > 0) {
                    seconds = 59;
                    minutes = 59;
                    hours--;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="bg-gray-600 text-white w-full h-auto md:h-[400px] flex flex-col md:flex-row gap-4">
            {/* Text Section */}
            <div className="p-6 md:p-8 w-full md:w-1/3 md:ml-12 text-center md:text-left flex flex-col justify-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    Flash Sale
                </h1>
                <p className="py-4 text-sm sm:text-base max-w-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="inline-flex items-center justify-center rounded-lg bg-white/10 p-4 space-x-6 shadow-lg">
                    <span className="flex flex-col items-center">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                            {String(timeLeft.hours).padStart(2, "0")}
                        </h2>
                        <p className="text-xs sm:text-sm">Hours</p>
                    </span>
                    <span className="flex flex-col items-center">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                            {String(timeLeft.minutes).padStart(2, "0")}
                        </h2>
                        <p className="text-xs sm:text-sm">Minutes</p>
                    </span>
                    <span className="flex flex-col items-center">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </h2>
                        <p className="text-xs sm:text-sm">Seconds</p>
                    </span>
                </div>
            </div>

            {/* Sliding Card Section */}
            <div className="relative w-full md:w-2/3 py-4 h-[300px] md:h-full flex items-center justify-center">
                {/* Slide Cards */}
                <div className="w-full h-full overflow-hidden relative">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 flex gap-4 justify-center items-center ${index === currentSlide ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            {/* Card 1 */}
                            <div className="w-1/2 md:w-1/3 h-[250px] md:h-[300px] bg-white/10 rounded-lg p-4 flex flex-col">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-1/2 object-cover rounded-md"
                                />
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                                            {slide.type}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <FaStar size={14} />
                                            <FaStar size={14} />
                                            <FaStar size={14} />
                                            <FaStar size={14} />
                                            <span className="text-white text-xs">
                                                ({slide.rating})
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold">{slide.title}</h3>
                                    <p className="text-xs text-gray-300">{slide.author}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">
                                            $
                                            {slide.discountPrice
                                                ? slide.discountPrice.toFixed(2)
                                                : slide.price.toFixed(2)}
                                        </span>
                                        {slide.discountPrice && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ${slide.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-300 rounded-full h-2">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full"
                                                style={{ width: `${(slide.stock / 50) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs">{slide.stock} books left</span>
                                    </div>
                                    <button className="mt-2 flex items-center justify-center gap-2 px-3 py-1 bg-gray-500 rounded-md hover:bg-gray-400 transition-colors">
                                        <FaShoppingCart size={14} />
                                        <span className="text-sm">Add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Card 2 (Duplicate for display) */}
                            <div className="hidden md:block w-1/3 h-[250px] md:h-[300px] bg-white/10 rounded-lg p-4 flex flex-col">
                                <img
                                    src={slides[(index + 1) % slides.length].image}
                                    alt={slides[(index + 1) % slides.length].title}
                                    className="w-full h-1/2 object-cover rounded-md"
                                />
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                                            {slides[(index + 1) % slides.length].type}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <FaStar size={14} />
                                            <FaStar size={14} />
                                            <FaStar size={14} />
                                            <FaStar size={14} />
                                            <span className="text-white text-xs">
                                                ({slides[(index + 1) % slides.length].rating})
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold">
                                        {slides[(index + 1) % slides.length].title}
                                    </h3>
                                    <p className="text-xs text-gray-300">
                                        {slides[(index + 1) % slides.length].author}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">
                                            $
                                            {slides[(index + 1) % slides.length].discountPrice
                                                ? slides[
                                                    (index + 1) % slides.length
                                                ].discountPrice.toFixed(2)
                                                : slides[(index + 1) % slides.length].price.toFixed(2)}
                                        </span>
                                        {slides[(index + 1) % slides.length].discountPrice && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ${slides[(index + 1) % slides.length].price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-300 rounded-full h-2">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full"
                                                style={{
                                                    width: `${(slides[(index + 1) % slides.length].stock / 50) *
                                                        100
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs">
                                            {slides[(index + 1) % slides.length].stock} books left
                                        </span>
                                    </div>
                                    <button className="mt-2 flex items-center justify-center gap-2 px-3 py-1 bg-gray-500 rounded-md hover:bg-gray-400 transition-colors">
                                        <FaShoppingCart size={14} />
                                        <span className="text-sm">Add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <FaArrowLeft size={16} className="text-gray-600" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <FaArrowRight size={16} className="text-gray-600" />
                </button>

                {/* Dots for Navigation */}
                <div className="absolute top-4 right-4 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlashSale;
