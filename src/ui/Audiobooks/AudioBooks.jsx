import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Layout from "../../Layout";
import { Skeleton } from "../../components/ui/skeleton";

const categories = [
    {
        title: "All categories",
        image: "",
    },
    {
        title: "Self Development",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_SeDe_3x.jpg",
    },
    {
        title: "Romance",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_Roma_3x.jpg",
    },
    {
        title: "Thrillers",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_Roma_3x.jpg",
    },
    {
        title: "Literature & Fiction",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_LiFi_3x-1.jpg",
    },
    {
        title: "Health & Wellness",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_HeWe_3x.jpg",
    },
    {
        title: "Biographies & Memoirs",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_BiMe_3x.jpg",
    },
    {
        title: "Kids",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_ChAu_3x.jpg",
    },
    {
        title: "Business",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_BuCa_3x.jpg",
    },
    {
        title: "Science Fiction",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_ScFi_3x.jpg",
    },
    {
        title: "Religion & Spirituality",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_ReHi_3x.jpg",
    },
    {
        title: "History",
        image:
            "https://m.media-amazon.com/images/G/01/Audible/en_US/images/Discover/SmNav_Gen_Hist_3x.jpg",
    },
];

const AudioBooks = () => {
    const scrollRef = useRef(null);
    const [audiobooks, setAudiobooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const fetchAudiobooks = async () => {
            try {
                const response = await fetch("https://bookcompass.onrender.com/api/books/audiobooks");
                if (!response.ok) throw new Error("Failed to fetch audiobooks.");
                const data = await response.json();
                console.log(data)
                setAudiobooks(data);
            } catch (err) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchAudiobooks();
    }, []);

    return (
        <Layout>
            {/* Audiobooks Section */}
            <div className="bg-gray-100 text-gray-800 py-6 sm:py-8 md:py-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                        We've got what everyone's listening to
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                        Bestsellers, new releases. That story you've been waiting for.
                    </p>

                    <div className="relative">
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 sm:p-4 rounded-full hover:bg-opacity-75 transition-opacity z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft className="text-lg sm:text-xl" />
                        </button>

                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto overflow-y-hidden space-x-3 sm:space-x-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                        >
                            {loading ? (
                                <div className="flex gap-3 sm:gap-4 min-h-[150px] sm:min-h-[200px] w-full">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-52">
                                            <Skeleton className="w-full h-32 sm:h-40 md:h-48 lg:h-52 mb-2 rounded-md" />
                                            <Skeleton className="h-4 w-3/4 mb-1 rounded" />
                                            <Skeleton className="h-3 w-1/2 rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center min-h-[150px] sm:min-h-[200px] w-full">
                                    <p className="text-red-500 text-sm sm:text-base">{error}</p>
                                </div>
                            ) : audiobooks.length === 0 ? (
                                <div className="flex justify-center items-center min-h-[150px] sm:min-h-[200px] w-full">
                                    <p className="text-gray-500 text-sm sm:text-base">No audiobooks found.</p>
                                </div>
                            ) : (
                                audiobooks.map((book) => (
                                    <Link
                                        key={book.id}
                                        to={`/audiobooks/${book._id}`}
                                        className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-52 snap-start transition-transform duration-300"
                                    >
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            width={150}
                                            height={150}
                                            unoptimized
                                            className="w-full h-32 sm:h-40 md:h-48 lg:h-52 object-cover rounded-md mb-2 shadow-md"
                                        />
                                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-gray-600">By: {book.author}</p>
                                    </Link>
                                ))
                            )}
                        </div>

                        <Button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 sm:p-4 rounded-full hover:bg-opacity-75 transition-opacity z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight className="text-lg sm:text-xl" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Explore Categories Section */}
            <div className="bg-gray-100 text-gray-800 py-6 sm:py-8 md:py-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                        Explore new worlds
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                        From epic stories to self-improvement, there are audiobooks for everyone.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-[#031C30] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between transition-colors duration-300"
                            >
                                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-2 sm:mb-0 sm:mr-2">
                                    {category.title}
                                </h3>
                                {category.image ? (
                                    <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            width={80}
                                            height={80}
                                            loading="lazy"
                                            className="max-w-full max-h-full object-contain rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center bg-gray-700 rounded-md">
                                        {/* <span className="text-xs text-white">No Image</span> */}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }
      `}</style>
        </Layout>
    );
};

export default AudioBooks;