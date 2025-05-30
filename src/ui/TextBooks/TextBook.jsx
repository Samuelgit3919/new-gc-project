import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../Layout";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TextBook = () => {
    const [textbooks, setTextbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filter toggle on mobile
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // State for collapsible filter sections
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isBookFormatOpen, setIsBookFormatOpen] = useState(true);
    const [isPublisherOpen, setIsPublisherOpen] = useState(false);
    const [isYearsOpen, setIsYearsOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    // State for filter values
    const [selectedCategory, setSelectedCategory] = useState("All Genres");
    const [selectedFormat, setSelectedFormat] = useState("All Format");
    const [selectedYear, setSelectedYear] = useState("");
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [publisherSearch, setPublisherSearch] = useState("");

    const categories = [
        "All Genres",
        "Fiction",
        "Self Development",
        "Children's Books",
        "Cookbooks, Food & Wine",
        "History",
        "Literature & Fiction",
        "Romance",
        "Science Fiction & Fantasy",
        "Other",
    ];


    const bookFormats = [
        "All Format",
        "Hard Cover",
        "Paper Back",
        "E-Book",
        "Large Print",
    ];

    // Generate years from current year back to 2010
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());

    useEffect(() => {
        const fetchTextbooks = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(
                    "https://bookcompass.onrender.com/api/books/getPhysicalBooks"
                );
                setTextbooks(response.data);
                setLoading(false);
                console.log(response.data)
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error("Error fetching textbooks:", err);
            }
        };

        fetchTextbooks();
    }, []);

    // Get all unique publishers from textbooks
    const publishers = [...new Set(textbooks.map(book => book.publisher))].filter(Boolean);

    // Filter textbooks based on selected filters
    const filteredTextbooks = textbooks.filter((book) => {
        // 1. Category match
        const matchesCategory =
            selectedCategory === "All Genres" || book.category === selectedCategory;

        // 2. Format match (based on isDigital, isAudiobook, and basic physical fallback)
        const matchesFormat =
            selectedFormat === "All Format" ||
            (selectedFormat === "E-Book" && book.isDigital) ||
            (selectedFormat === "Audiobook" && book.isAudiobook) ||
            (selectedFormat === "Hard Cover" && !book.isDigital && !book.isAudiobook) || // physical fallback
            (selectedFormat === "Paper Back" && !book.isDigital && !book.isAudiobook);  // optional, if you differentiate

        // 3. Year match (if year is present)
        const matchesYear =
            !selectedYear || book.year?.toString() === selectedYear;

        // 4. Price match using flat `price` field
        const validPrice =
            typeof book.price === "number" && !isNaN(book.price) && isFinite(book.price);
        const matchesPrice =
            validPrice && book.price >= priceRange[0] && book.price <= priceRange[1];

        // 5. Publisher match (case-insensitive)
        const matchesPublisher =
            !publisherSearch ||
            (book.publisher &&
                book.publisher.toLowerCase().includes(publisherSearch.toLowerCase()));

        // Final condition
        return (
            matchesCategory &&
            matchesFormat &&
            matchesYear &&
            matchesPrice &&
            matchesPublisher
        );
    });





    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("All Genres");
        setSelectedFormat("All Format");
        setSelectedYear("");
        setPriceRange([0, 500]);
        setPublisherSearch("");
    };

    // Format price with 2 decimal places
    const formatPrice = (price) => {
        const parsed = parseFloat(price);
        return !isNaN(parsed) && isFinite(parsed) ? parsed.toFixed(2) : '0.00';
    };


    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="space-y-8">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8">
                    <Skeleton width={128} height={192} className="rounded-md" />
                    <div className="flex-1">
                        <Skeleton width={200} height={24} className="mb-2" />
                        <Skeleton width={150} height={20} className="mb-3" />
                        <Skeleton width={80} height={24} className="mb-4" />
                        <Skeleton count={3} height={16} className="mb-4" />
                        <Skeleton width={120} height={40} />
                    </div>
                </div>
            ))}
        </div>
    );

    // Handle price range change
    const handlePriceChange = (index, value) => {
        const newPriceRange = [...priceRange];
        newPriceRange[index] = parseInt(value);

        // Ensure min doesn't exceed max
        if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
            newPriceRange[1] = newPriceRange[0];
        }
        if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
            newPriceRange[0] = newPriceRange[1];
        }

        setPriceRange(newPriceRange);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto py-8 px-4">
                {/* Filter Section */}
                <div className="w-full md:w-1/4">
                    {/* Filter Toggle Button for Mobile */}
                    <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Filter</h3>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="text-gray-600"
                        >
                            {isFilterOpen ? (
                                <MdKeyboardArrowDown className="text-2xl" />
                            ) : (
                                <MdKeyboardArrowRight className="text-2xl" />
                            )}
                        </button>
                    </div>

                    {/* Filter Content */}
                    <div
                        className={`${isFilterOpen ? "block" : "hidden"
                            } md:block p-6 bg-white rounded-lg shadow-md transition-all duration-300 sticky top-4`}
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">
                            Filter
                        </h3>

                        {/* Categories */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Categories
                                </h4>
                                <button
                                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                    className="text-gray-600"
                                >
                                    {isCategoriesOpen ? (
                                        <IoIosArrowUp className="text-2xl" />
                                    ) : (
                                        <IoIosArrowDown className="text-2xl" />
                                    )}
                                </button>
                            </div>
                            {isCategoriesOpen && (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {categories.map((category, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                id={`category-${index}`}
                                                name="category"
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="text-gray-600 focus:ring-gray-500"
                                            />
                                            <label
                                                htmlFor={`category-${index}`}
                                                className="text-gray-600 text-sm cursor-pointer hover:text-gray-800 transition-colors"
                                            >
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Book Format */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Book Format
                                </h4>
                                <button
                                    onClick={() => setIsBookFormatOpen(!isBookFormatOpen)}
                                    className="text-gray-600"
                                >
                                    {isBookFormatOpen ? (
                                        <IoIosArrowUp className="text-2xl" />
                                    ) : (
                                        <IoIosArrowDown className="text-2xl" />
                                    )}
                                </button>
                            </div>
                            {isBookFormatOpen && (
                                <div className="space-y-2">
                                    {bookFormats.map((format, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                id={`format-${index}`}
                                                name="format"
                                                value={format}
                                                checked={selectedFormat === format}
                                                onChange={(e) => setSelectedFormat(e.target.value)}
                                                className="text-gray-600 focus:ring-gray-500"
                                            />
                                            <label
                                                htmlFor={`format-${index}`}
                                                className="text-gray-600 text-sm cursor-pointer hover:text-gray-800 transition-colors"
                                            >
                                                {format}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Publisher */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Publisher</h4>
                                <button
                                    onClick={() => setIsPublisherOpen(!isPublisherOpen)}
                                    className="text-gray-600"
                                >
                                    {isPublisherOpen ? (
                                        <IoIosArrowUp className="text-2xl" />
                                    ) : (
                                        <IoIosArrowDown className="text-2xl" />
                                    )}
                                </button>
                            </div>
                            {isPublisherOpen && (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Search Publisher..."
                                        value={publisherSearch}
                                        onChange={(e) => setPublisherSearch(e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                                    />
                                    <div className="max-h-40 overflow-y-auto mt-2">
                                        {publishers
                                            .filter(publisher =>
                                                publisher.toLowerCase().includes(publisherSearch.toLowerCase()))
                                            .map((publisher, index) => (
                                                <div key={index} className="flex items-center gap-2 py-1">
                                                    <input
                                                        type="checkbox"
                                                        id={`publisher-${index}`}
                                                        checked={publisherSearch === publisher}
                                                        onChange={() => setPublisherSearch(publisher)}
                                                        className="text-gray-600 focus:ring-gray-500"
                                                    />
                                                    <label
                                                        htmlFor={`publisher-${index}`}
                                                        className="text-gray-600 text-sm cursor-pointer hover:text-gray-800 transition-colors"
                                                    >
                                                        {publisher}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Years */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Year</h4>
                                <button
                                    onClick={() => setIsYearsOpen(!isYearsOpen)}
                                    className="text-gray-600"
                                >
                                    {isYearsOpen ? (
                                        <IoIosArrowUp className="text-2xl" />
                                    ) : (
                                        <IoIosArrowDown className="text-2xl" />
                                    )}
                                </button>
                            </div>
                            {isYearsOpen && (
                                <select
                                    name="years"
                                    id="years"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                                >
                                    <option value="">All Years</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Price Range
                                </h4>
                                <button
                                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                                    className="text-gray-600"
                                >
                                    {isPriceOpen ? (
                                        <IoIosArrowUp className="text-2xl" />
                                    ) : (
                                        <IoIosArrowDown className="text-2xl" />
                                    )}
                                </button>
                            </div>
                            {isPriceOpen && (
                                <div className="px-2">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600 text-sm">${priceRange[0]}</span>
                                        <span className="text-gray-600 text-sm">${priceRange[1]}</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-sm">Min:</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="500"
                                                step="5"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceChange(0, e.target.value)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-sm">Max:</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="500"
                                                step="5"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceChange(1, e.target.value)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="bg-gray-100 p-2 rounded text-center">
                                            <span className="text-xs text-gray-600">Min: </span>
                                            <span className="font-medium">${priceRange[0]}</span>
                                        </div>
                                        <div className="bg-gray-100 p-2 rounded text-center">
                                            <span className="text-xs text-gray-600">Max: </span>
                                            <span className="font-medium">${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-900 transition w-full shadow-md"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={resetFilters}
                                className="text-gray-600 hover:text-gray-800 text-sm underline"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Textbooks List */}
                <div className="w-full md:w-3/4 py-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                            TEXTBOOKS
                        </h2>
                        <div className="text-sm text-gray-600">
                            {loading ? "Loading..." : `Showing ${filteredTextbooks.length} of ${textbooks.length} books`}
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <div className="text-center py-10">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                                <h3 className="font-bold mb-1">Error loading textbooks</h3>
                                <p className="text-sm">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-3 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : filteredTextbooks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredTextbooks.map((book) => {
                                // Get the lowest available price for the book
                                const prices = Object.values(book.format || {})
                                    .filter(val => typeof val === 'number' && val > 0);

                                const bookPrice = prices.length > 0 ? Math.min(...prices) : 0;

                                // Get available formats
                                const availableFormats = Object.entries(book.format || {})
                                    .filter(([_, price]) => typeof price === 'number' && price > 0)
                                    .map(([format]) => format);

                                return (
                                    <Link
                                        to={`/textbooks/${book._id || book.id}`}
                                        key={book._id || book.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={book.imageUrl || "https://via.placeholder.com/128x192?text=No+Image"}
                                                alt={book.title}
                                                className="h-40 w-auto object-contain"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/128x192?text=No+Image";
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                                                {book?.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">by {book.author || "Unknown Author"}</p>

                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-lg font-bold text-gray-800">
                                                    ${Number(book.price).toFixed(2)}
                                                </p>


                                                {/* <div className="text-xs text-gray-500">
                                                    {book.year || "N/A"}
                                                </div> */}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {book.category && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {book.category}
                                                    </span>
                                                )}
                                                {availableFormats.map((format, index) => (
                                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        {format}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {book.description || "No description available."}
                                            </p>

                                            <button className="w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-900 transition shadow-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    No textbooks found
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Try adjusting your search or filter to find what you're looking for.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TextBook;