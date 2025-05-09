import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../Layout";

// ✅ Move the data outside the component
const audiobooks = [
    {
        id: 1,
        title: "The Wedding People",
        author: "Alison Espach",
        image: "https://i.pinimg.com/736x/f3/8e/bb/f38ebb2eaee240fbcae7620f4cf5f2ac.jpg",
    },
    {
        id: 2,
        title: "The Next Conversation",
        author: "Jefferson Fisher",
        image: "https://i.pinimg.com/736x/5a/09/ca/5a09ca347396333d07dab50da5336ffb.jpg",
    },
    {
        id: 3,
        title: "The Housemaid",
        author: "Freida McFadden",
        image: "https://i.pinimg.com/736x/db/0f/0a/db0f0a7b0326304e6a077e695b64f487.jpg",
    },
    {
        id: 4,
        title: "The Serpent and the Wings of Night",
        author: "Carissa Broadbent",
        image: "https://i.pinimg.com/736x/02/28/93/0228931c70f8c6f0d2ad58abf3679803.jpg",
    },
    {
        id: 5,
        title: "Careless People",
        author: "Sarah Wyn-Williams",
        image: "https://i.pinimg.com/736x/84/0d/8a/840d8af06ae8f6dfb92bb788aa35bfb1.jpg",
    },
    {
        id: 6,
        title: "A Very Good Murder",
        author: "Ronan Farrow",
        image: "https://i.pinimg.com/736x/27/5f/2b/275f2b3f195dcbc2b9c1d1b3d71e93b9.jpg",
    },
    {
        id: 7,
        title: "The Wedding People",
        author: "Alison Espach",
        image: "https://i.pinimg.com/736x/f3/8e/bb/f38ebb2eaee240fbcae7620f4cf5f2ac.jpg",
    },
    {
        id: 8,
        title: "The Wedding People",
        author: "Alison Espach",
        image: "https://i.pinimg.com/736x/f3/8e/bb/f38ebb2eaee240fbcae7620f4cf5f2ac.jpg",
    },
];

export default function AudiobookDetail() {
    const { id } = useParams();
    const audiobookId = parseInt(id, 10);
    const audiobook = audiobooks.find((book) => book.id === audiobookId);

    if (!audiobook) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Audiobook Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The audiobook you're looking for doesn't exist in our collection.
                    </p>
                    <Link
                        to="/ui/Audiobooks"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Audiobooks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/Audiobooks"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Audiobooks
                    </Link>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-100">
                                <img
                                    src={audiobook.image}
                                    alt={audiobook.title}
                                    className="rounded-lg object-cover w-64 h-64 hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="md:w-2/3 p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{audiobook.title}</h1>
                                        <p className="text-lg text-gray-600 mb-4">By {audiobook.author}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 my-6"></div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {audiobook.description ||
                                        `This is a premium audiobook of "${audiobook.title}" by ${audiobook.author}. Enjoy high-quality narration that brings the story to life.`}
                                </p>

                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Now Playing</h3>
                                            <p className="text-sm text-gray-600">Chapter 1: Introduction</p>
                                        </div>
                                        <button className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                            ▶
                                        </button>
                                    </div>
                                    <div className="mt-3">
                                        <div className="relative pt-1">
                                            <span className="text-xs text-blue-600">15:30 / 45:00</span>
                                            <div className="h-2 mt-1 bg-blue-200 rounded overflow-hidden">
                                                <div className="h-full w-1/3 bg-blue-600"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                        Play Now
                                    </button>
                                    <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                                        Add to Library
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
