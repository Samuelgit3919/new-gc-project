import React from 'react';
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";

const Testimonials = () => {
    const testimony = [
        {
            start: {
                fullStar: { icon: FaStar, count: 4 }, // Example: 4 full stars
                halfStar: { icon: FaStarHalfAlt, count: 1 }, // Example: 1 half star
                emptyStar: { icon: FaRegStar, count: 0 } // Example: 0 empty stars
            },
            message: "BookCompas has transformed how I find books! The personalized recommendations from the smart system helped me discover local Ethiopian novels I’d never have found otherwise, and the chatbot’s quick help in Amharic made shopping a breeze. It`s like having a librarian in my pocket!",
            name: "Abebe Tadesse",
            title: " Addis Ababa Reader",
        },
        {
            start: {
                fullStar: { icon: FaStar, count: 3 }, // Example: 3 full stars
                halfStar: { icon: FaStarHalfAlt, count: 0 }, // Example: 0 half stars
                emptyStar: { icon: FaRegStar, count: 2 } // Example: 2 empty stars
            },
            message:"As a small bookstore owner in Nazret/Adama, BookCompas has been a game-changer. The easy inventory tools and the way it connects me to more customers have boosted my sales, all thanks to its innovative design that supports us local sellers.",
            name:  "Sara Mekonnen",
            title: "Local Bookstore Owner",
        },
        {
            start: {
                fullStar: { icon: FaStar, count: 5 }, // Example: 5 full stars
                halfStar: { icon: FaStarHalfAlt, count: 0 }, // Example: 0 half stars
                emptyStar: { icon: FaRegStar, count: 0 } // Example: 0 empty stars
            },
            message: "I love how BookCompas makes learning fun! The audiobook feature and tailored book suggestions saved me hours of searching, and the friendly chatbot answered my questions instantly. It’s the perfect companion for my studies!",
            name: "Hana Getachew",
            title: "Student",
        }
    ];

    return (
        <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Testimonials</h1>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
Real feedback from users and bookstore partners, sharing their experiences with BookCompas, highlighting how it enhances book discovery, simplifies purchases, and supports the local reading community.                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimony.map((test, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex flex-col items-center space-y-4">
                                {/* Star Ratings */}
                                <div className="flex space-x-1 text-yellow-500">
                                    {[...Array(test.start.fullStar.count)].map((_, i) => (
                                        <test.start.fullStar.icon key={`full-${i}`} className="w-6 h-6" />
                                    ))}
                                    {[...Array(test.start.halfStar.count)].map((_, i) => (
                                        <test.start.halfStar.icon key={`half-${i}`} className="w-6 h-6" />
                                    ))}
                                    {[...Array(test.start.emptyStar.count)].map((_, i) => (
                                        <test.start.emptyStar.icon key={`empty-${i}`} className="w-6 h-6" />
                                    ))}
                                </div>
                                {/* Testimonial Message */}
                                <p className="text-gray-600 text-center italic">
                                    "{test.message}"
                                </p>
                            </div>
                            {/* Name and Title */}
                            <div className="mt-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                                <p className="text-sm text-gray-500">{test.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;