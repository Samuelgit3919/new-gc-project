import React, { useEffect, useState } from "react";
import Service from "./Service";
import Trending from "./Trending";
import BestSeller from "./BestSeller";
import FlashSale from "./FlashSale";
import Testimonials from "./Testimonials";
import Subscribe from "./Subscribe";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../Layout"
import HomeLayout from "./HomeLayout";
const BookCard = ({ book }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-3 mx-6 w-64 my-4">
        <img
            src={book.imageUrl || "/placeholder-book.jpg"}
            alt={book.title}
            className="w-full h-40 object-cover mb-3 rounded-md"
        />
        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">by {book.author}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{book.description || "No description available"}</p>
        <div className="mt-3 flex justify-between items-center">
            <p className="font-semibold text-gray-700">${book.price?.toFixed(2) || "N/A"}</p>
            <button className="bg-gray-700 text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800 transition-all">
                View Details
            </button>
        </div>
    </div>
);


const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // console.log(books)

    // Extract and debounce search
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search") || "";
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch books once
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://bookcompass.onrender.com/api/books/getAllBooks");
                setBooks(res.data.data || []);
                // console.log(res)
                setError(null);
            } catch (err) {
                setError(`Failed to fetch books: ${err.message || err}`);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filtered results
    const filteredBooks = books.filter(book => {
        if (!debouncedSearchTerm) return true;
        const term = debouncedSearchTerm.toLowerCase();
        return (
            book.title?.toLowerCase().includes(term) ||
            book.author?.toLowerCase().includes(term) ||
            book.isbn?.toLowerCase().includes(term) ||
            book.category?.toLowerCase().includes(term)
        );
    });

    // Scroll to top on new search
    useEffect(() => {
        if (debouncedSearchTerm) window.scrollTo(0, 0);
    }, [debouncedSearchTerm]);

    return (
        <Layout className="px-4  py-8 max-w-7xl mx-auto space-y-12 ">
            {loading && <p className="text-center text-gray-500">Loading books...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {debouncedSearchTerm ? (
                <section aria-label="Search Results px-6 py-4">
                    <div className="flex justify-between items-center mb-6 mx-6 mt-2">
                        <h2 className="text-2xl font-extrabold text-gray-700-700">
                            Search Results for “{debouncedSearchTerm}”
                        </h2>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300 transition"
                        >
                            Clear Search
                        </button>
                    </div>

                    {filteredBooks.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredBooks.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-lg text-gray-600">No books found for "{debouncedSearchTerm}".</p>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-6 inline-block text-gray-700-600 font-medium hover:underline"
                            >
                                Browse all books
                            </button>
                        </div>
                    )}
                </section>
            ) : (
                <>
                    <HomeLayout />
                    <Service />
                    <BestSeller books={books} />
                    <FlashSale />
                    {/* <Trending /> */}
                    <Testimonials />
                    <Subscribe />
                </>
            )}
        </Layout>
    );
};

export default HomePage;
