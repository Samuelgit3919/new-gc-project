import React, { useEffect, useState } from "react";
import Service from "./Service";
import Trending from "./Trending";
import BestSeller from "./BestSeller";
import FlashSale from "./FlashSale";
import Testimonials from "./Testimonials";
import Subscribe from "./Subscribe";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BookCard = ({ book }) => (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
        <img
            src={book.imageUrl || "/placeholder-book.jpg"}
            alt={book.title}
            className="w-full h-48 object-cover mb-3 rounded"
        />
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {book.description || "No description available"}
        </p>
        <div className="mt-3 flex justify-between items-center">
            <p className="font-medium text-blue-600">${book.price?.toFixed(2) || "N/A"}</p>
            <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                View Details
            </button>
        </div>
    </div>
);

const Pages = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Get search term from URL
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search") || "";

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);


    // console.log(books)

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://bookcompass.onrender.com/api/books/getAllBooks");
                setBooks(res.data.data || []);
                console.log(res.data.data)
                // console.log(books)
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

    // Filter books based on search term
    const filteredBooks = books.filter(book => {
        if (!debouncedSearchTerm) return true; // Show all if no search

        const term = debouncedSearchTerm.toLowerCase();
        return (
            book.title?.toLowerCase().includes(term) ||
            book.author?.toLowerCase().includes(term) ||
            book.isbn?.toLowerCase().includes(term) ||
            book.category?.toLowerCase().includes(term)
        );
    });

    // Scroll to top when search changes
    useEffect(() => {
        if (debouncedSearchTerm) {
            window.scrollTo(0, 0);
        }
    }, [debouncedSearchTerm]);

    return (
        <main className="space-y-8 px-4 py-6">
            {loading && <p className="text-center text-gray-500">Loading books...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {/* Show Searched Books */}
            {debouncedSearchTerm && (
                <section aria-label="Search results" className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-purple-700">
                            Search Results for "{debouncedSearchTerm}"
                        </h2>

                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-purple-600"
                        >
                            Clear Search
                        </button>
                    </div>

                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-500">
                                No books found matching

                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 text-purple-600 hover:underline"
                            >
                                Browse all books
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Regular content when not searching */}
            {!debouncedSearchTerm && (
                <>
                    <Service />
                    <BestSeller books={books} />
                    <FlashSale />
                    {/* <Trending /> */}
                    <Testimonials />
                    <Subscribe />
                </>
            )}
        </main>
    );
};

export default Pages;