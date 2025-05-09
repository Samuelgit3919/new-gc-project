import React from "react";
import { FaStoreAlt } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { TbBooks } from "react-icons/tb";

const Subscribe = () => {
    return (
        <div>
            <div className="md:flex md:flex-row flex flex-col bg-gray-950 text-white p-8 justify-center gap-24">
                <div className="flex flex-col py-2 gap-2 items-center">
                    <span className="flex items-center gap-2">
                        <FaStoreAlt className="text-4xl" />
                        <h3 className="text-2xl">268</h3>
                    </span>
                    <p className="text-gray-400">Our stores around Ethiopia</p>
                </div>
                <div className="flex flex-col py-2 gap-2  items-center">
                    <span className="flex items-center gap-2">
                        <BsPeopleFill className="text-4xl" />
                        <h3 className="text-2xl">25, 634</h3>
                    </span>
                    <p className="text-gray-400">Our happy customers</p>
                </div>
                <div className="flex flex-col py-2 gap-2  items-center">
                    <span className="flex items-center gap-2">
                        <TbBooks className="text-4xl" />
                        <h3 className="text-2xl">68+k</h3>
                    </span>
                    <p className="text-gray-400">Book Collections</p>
                </div>
            </div>
            <div className="bg-gray-500 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl flex md:flex-row flex-col gap-4  md:flex items-center">
                    <p className="text-center p-2 text-white text-2xl  max-w-2xl md:w-1/3 mx-auto">
                        Subscribe to our newsletter to get the latest news and updates.
                    </p>

                    <form className="flex items-center gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-white text-gray text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-300"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
