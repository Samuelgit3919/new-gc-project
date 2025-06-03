

import { FaArrowRight } from "react-icons/fa";
import { HiOutlineCollection } from "react-icons/hi";
import { FaPeopleGroup } from "react-icons/fa6";
import Corousel from "../carousel/Corousel";
import Pages from "./HomePage";
import Carousel from "../carousel/Corousel";
import Layout from "../../Layout"

export default function HomeLayout() {
    return (
        <div className="bg-purple-50 py-12 ">
            <div className="container md:mx-8 mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:space-x-8 space-y-12 lg:space-y-0">
                {/* Text Section */}
                <div className="w-full lg:w-2/5 text-center lg:text-left">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-6 leading-tight">
                        Welcome to BookCompass <br /> Online Book Navigator
                    </h1>
                    <p className="text-gray-700 mb-8 text-sm md:text-base">
                        Discover a world of books with ease. BookCompass provides an
                        intuitive way to explore, compare, and purchase books online. Join a
                        thriving community of readers!
                    </p>

                    {/* Stats Section */}
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 mb-8">
                        <div className="text-center flex flex-col items-center">
                            <HiOutlineCollection
                                className="text-4xl text-gray-500 mb-2"
                                aria-label="Book Collections"
                            />
                            <p className="text-2xl font-bold text-gray-800">68+k</p>
                            <p className="text-gray-600 text-sm md:text-base">
                                Book Collections
                            </p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <FaPeopleGroup
                                className="text-4xl text-gray-500 mb-2"
                                aria-label="Customers"
                            />
                            <p className="text-2xl font-bold text-gray-800">25,567</p>
                            <p className="text-gray-600 text-sm md:text-base">Customers</p>
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="flex justify-center lg:justify-start">
                        <a
                            href="/ebook"
                            className="inline-flex items-center gap-3 px-6 py-3 text-white font-semibold bg-gray-700 hover:bg-gray-800 transition rounded-md shadow-md hover:shadow-lg"
                            aria-label="Go to Collections"
                        >
                            Go to Collections <FaArrowRight />
                        </a>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="w-full lg:w-3/5 mt-6 lg:mt-0">
                    <div className="overflow-hidden rounded-lg shadow-lg animate-fade-in">
                        <Corousel />
                    </div>
                </div>
            </div>

            {/* Additional Pages Component */}
            {/* <Pages /> */}
        </div>
    );
}
