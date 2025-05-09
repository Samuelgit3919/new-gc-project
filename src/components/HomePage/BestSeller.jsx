import React from "react";
import { MdStarRate } from "react-icons/md";

const BestSeller = () => {
    const slides = [
        {
            image:
                "https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg",
            title: "Be yourself & Never Surrender",
            subtitle: "Inspirational Journey",
            type: "Adventure",
            rating: 4.5,
            des: "Adventure of Mount Everest",
            author: "Hanry Marlopo",
            price: 21.99,
            discountPrice: 18.99,
        },
        {
            image:
                "https://i.pinimg.com/736x/f5/4f/08/f54f0874809bfb306cefe230135cb797.jpg",
            title: "Theory: Is Alien Real",
            subtitle: "Explore the Unknown",
            type: "Fiction",
            rating: 4.2,
            des: "Life of wild",
            author: "Rick Riordan",
            price: 19.99,
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
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl md:text-4xl my-6 font-bold text-gray-800 tracking-tight">
                Best Sellers
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="group flex flex-col sm:flex-row transition-all duration-300 hover:shadow-xl rounded-xl bg-white overflow-hidden"
                    >
                        {/* Image Section - Left Side */}
                        <div className="relative sm:w-2/5">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="h-64 sm:h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {slide.discountPrice && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Sale
                                </span>
                            )}
                        </div>

                        {/* Content Section - Right Side */}
                        <div className="flex flex-col p-4 sm:w-3/5 gap-4">
                            {/* Tag and Rating */}
                            <div className="flex items-center justify-between">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {slide.type}
                                </span>
                                <div className="flex items-center gap-1 text-orange-500">
                                    <MdStarRate size={20} />
                                    <span className="font-medium">{slide.rating}</span>
                                </div>
                            </div>

                            {/* Title and Description */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">
                                    {slide.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{slide.des}</p>
                            </div>

                            {/* Author and Price */}
                            <div className="mt-auto flex items-center justify-between">
                                <p className="font-serif text-gray-700">{slide.author}</p>
                                <div className="text-right">
                                    {slide.discountPrice ? (
                                        <div>
                                            <span className="text-sm text-gray-500 line-through">
                                                ${slide.price.toFixed(2)}
                                            </span>
                                            <span className="ml-2 text-xl font-bold text-gray-600">
                                                ${slide.discountPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xl font-bold text-gray-600">
                                            ${slide.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button className="mt-4 w-full py-2 bg-gray-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-700">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
