
import { Link } from "react-router-dom";
// import Image from "next/image";
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { audiobooks } from "./audiobooks";
import { Button } from "@/components/ui/button";
import Layout from "../../Layout"


// Categories data (unchanged)
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
const audiobooks = [
    {
        id: 1,
        title: "The Wedding People",
        author: "Alison Espach",
        image:
            "https://i.pinimg.com/736x/f3/8e/bb/f38ebb2eaee240fbcae7620f4cf5f2ac.jpg",
    },
    {
        id: 2,
        title: "The Next Conversation",
        author: "Jefferson Fisher",
        image:
            "https://i.pinimg.com/736x/5a/09/ca/5a09ca347396333d07dab50da5336ffb.jpg",
    },
    {
        id: 3,
        title: "The Housemaid",
        author: "Freida McFadden",
        image:
            "https://i.pinimg.com/736x/db/0f/0a/db0f0a7b0326304e6a077e695b64f487.jpg",
    },
    {
        id: 4,
        title: "The Serpent and the Wings of Night",
        author: "Carissa Broadbent",
        image:
            "https://i.pinimg.com/736x/02/28/93/0228931c70f8c6f0d2ad58abf3679803.jpg",
    },
    {
        id: 5,
        title: "Careless People",
        author: "Sarah Wyn-Williams",
        image:
            "https://i.pinimg.com/736x/84/0d/8a/840d8af06ae8f6dfb92bb788aa35bfb1.jpg",
    },
    {
        id: 6,
        title: "A Very Good Murder",
        author: "Ronan Farrow",
        image:
            "https://i.pinimg.com/736x/27/5f/2b/275f2b3f195dcbc2b9c1d1b3d71e93b9.jpg",
    },
    {
        id: 7,
        title: "The Wedding People",
        author: "Alison Espach",
        image:
            "https://i.pinimg.com/736x/f3/8e/bb/f38ebb2eaee240fbcae7620f4cf5f2ac.jpg",
    },
    {
        id: 8,
        title: "The Wedding People",
        author: "Alison Espach",
        image:
            "https://i.pinimg.com/736x/f3/8e/bb/f38ebb2eaee240fbcae7620f4cf5f2ac.jpg",
    },
];

const AudioBooks = () => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <Layout>
            {/* AudioBooks Section */}
            <div className="bg-gray-100 text-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        We've got what everyone's listening to
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Bestsellers, new releases. That story you've been waiting for.
                    </p>

                    <div className="relative">
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                        >
                            <FaChevronLeft className="text-xl" />
                        </button>

                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto overflow-y-hidden space-x-4 snap-x snap-mandatory hide-scrollbar"
                        >
                            {audiobooks.map((book) => (
                                <Link
                                    key={book.id}
                                    to={`/audiobooks/${book.id}`}
                                    className="flex-shrink-0 w-40 sm:w-48 md:w-52 snap-start transition-transform duration-300"
                                >
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        width={200}
                                        height={200}
                                        unoptimized
                                        className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-md mb-2 shadow-md"
                                    />
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        By: {book.author}
                                    </p>
                                </Link>
                            ))}
                        </div>
                        {/* <Button>Click me</Button> */}
                        <Button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                        >
                            <FaChevronRight className="text-xl" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ExploreCategories Section */}
            <div className="bg-gray-100 text-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        Explore new worlds
                    </h2>
                    <p className="text-gray-400 mb-6">
                        From epic stories to self-improvement, there are audiobooks for
                        everyone.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-[#031C30] rounded-lg p-4 flex items-center justify-between transition-colors duration-300"
                            >
                                <h3 className="text-sm sm:text-base font-semibold text-white">
                                    {category.title}
                                </h3>
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    width={200}
                                    height={200}
                                    className="w-32 mb-3 object-contain"
                                    unoptimized
                                />
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
      `}</style>
        </Layout>
    );
};

export default AudioBooks;
