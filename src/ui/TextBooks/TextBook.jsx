

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../Layout"


const TextBook = () => {

    const textbooks = [
        {
            id: 1,
            title: "Harriet Tubman: Live in Concert",
            author: "Bob the Drag Queen",
            price: 29.03,
            image:
                "https://i.pinimg.com/736x/79/f3/1d/79f31d18f1620f68409ca3a2556557ab.jpg",
            description:
                "The first from TV host and RuPaul's Drag Race winner Bob The Drag Queen vibes with energy and humor but never wavers in its focus on the resilience and power of Black Americans, 'made out of something stronger than steel and diamonds combined,' and the universal passion for liberation.",
            category: "Biography & Memory",
            format: {
                hardcover: 29.03,
                paperback: 29.03,
                ebook: 39.03,
            },
            year: 2023,
            shopName: "City Books",
            length: "1.2 miles away",
            location: "123 Main St, Downtown",
            map: "",
            contact: "123-456-7890",
            website: "https://www.citybooks.com",
            BookPage: "432",
            language: "English",
            publisher: "City Books Publishing",
            isbn: "978-3-16-148410-0",
            dimention: "8.5 x 11 inches",
        },
        {
            id: 2,
            title: "The Instability of Truth",
            author: "Rebecca Lemov",
            price: 30.68,
            image:
                "https://i.pinimg.com/736x/70/b3/c8/70b3c8cb130c3f7638b8df28dba6c950.jpg",
            description:
                "Provocative and illuminating... Lemov's deeply researched exploration reveals how the persuasive power wielded by charismatic figures can answer, in a warped way, a person's yearning for self-reinvention and meaning... Publishers Weekly, starred review. A chilling and spellbinding history of mind control, from prison camps to online algorithms. -- Jill Lepore, author of If Then: How the Simulmatics Corporation Invented the Future.",
            category: "History",
            format: {
                hardcover: 39.03,
                paperback: 29.03,
                ebook: 9.03,
            },
            year: 2022,
            shopName: "Book Haven",
            length: "5.8 miles away",
            location: "456 Park Ave, Westside",
            map: "",
            contact: "123-456-7890",
            website: "https://www.citybooks.com",
            BookPage: "432",
            language: "English",
            publisher: "City Books Publishing",
            isbn: "978-3-16-148410-0",
            dimention: "8.5 x 11 inches",
        },
        {
            id: 3,
            title: "The Instability of Truth",
            author: "Rebecca Lemov",
            price: 30.68,
            image:
                "https://i.pinimg.com/736x/70/b3/c8/70b3c8cb130c3f7638b8df28dba6c950.jpg",
            description:
                "Provocative and illuminating... Lemov's deeply researched exploration reveals how the persuasive power wielded by charismatic figures can answer, in a warped way, a person's yearning for self-reinvention and meaning... Publishers Weekly, starred review. A chilling and spellbinding history of mind control, from prison camps to online algorithms. -- Jill Lepore, author of If Then: How the Simulmatics Corporation Invented the Future.",
            category: "History",
            format: {
                hardcover: 19.03,
                paperback: 29.03,
                ebook: 19.03,
            },
            year: 2022,
            shopName: "Book Haven",
            length: "5.8 miles away",
            location: "456 Park Ave, Westside",
            map: "",
            contact: "123-456-7890",
            website: "https://www.citybooks.com",
            BookPage: "432",
            language: "English",
            publisher: "City Books Publishing",
            isbn: "978-3-16-148410-0",
            dimention: "8.5 x 11 inches",
        },
    ];

    const categories = [
        "All Genres",
        "Arts & Photography",
        "Biography & Memory",
        "Children's Book",
        "Cookbook & Food",
        "History",
        "Literature & Fiction",
        "Romance",
        "SciFi & Fantasy",
        "Teen & Young Adult",
    ];

    const bookFormats = [
        "All Format",
        "Hard Cover",
        "Paper Back",
        "E-Book",
        "Large Print",
    ];


    // State for filter toggle on mobile
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // State for collapsible filter sections
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isBookFormatOpen, setIsBookFormatOpen] = useState(false);
    const [isYearsOpen, setIsYearsOpen] = useState(false);
    const [isPublisherOpen, setIsPublisherOpen] = useState(false);
    // State for filter values
    const [selectedCategory, setSelectedCategory] = useState("All Genres");
    const [selectedFormat, setSelectedFormat] = useState("All Format");
    const [selectedYear, setSelectedYear] = useState("");
    const [priceRange, setPriceRange] = useState([0, 500]);

    const years = ["2023", "2022", "2021", "2020"];

    // Filter textbooks based on selected filters
    const filteredTextbooks = textbooks.filter((book) => {
        const matchesCategory =
            selectedCategory === "All Genres" || book.category === selectedCategory;
        const matchesFormat =
            selectedFormat === "All Format" || book.format === selectedFormat;
        const matchesYear = !selectedYear || book.year.toString() === selectedYear;
        const matchesPrice =
            book.price >= priceRange[0] && book.price <= priceRange[1];
        return matchesCategory && matchesFormat && matchesYear && matchesPrice;
    });

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("All Genres");
        setSelectedFormat("All Format");
        setSelectedYear("");
        setPriceRange([0, 500]);
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
                            } md:block p-6 bg-white rounded-lg shadow-md transition-all duration-300`}
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
                                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                                                className="text-gray-600 text-sm cursor-pointer"
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
                                                className="text-gray-600 text-sm cursor-pointer"
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
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Years */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Years</h4>
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
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    <option value="">Select Year</option>
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
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                Price Range
                            </h4>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-gray-600 text-sm">${priceRange[0]}</span>
                                    <span className="text-gray-600 text-sm">${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition w-full">
                                Refine Search
                            </button>
                            <button
                                onClick={resetFilters}
                                className="text-gray-600 hover:text-gray-800 text-sm"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Textbooks List */}
                <div className="w-full md:w-3/4 py-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                        TEXTBOOKS
                    </h2>

                    {filteredTextbooks.length > 0 ? (
                        <div className="space-y-8">
                            {filteredTextbooks.map((book) => (
                                <Link
                                    to={`/textbooks/${book.id}`}
                                    key={book.id}
                                    className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8 hover:bg-gray-50 transition-all duration-300"
                                >
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="w-24 sm:w-32 h-36 sm:h-8 object-cover rounded-md shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 hover:text-gray-600 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                        <p className="text-base sm:text-lg font-bold text-gray-800 mb-3">
                                            ${book.price.toFixed(2)}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {book.description}
                                        </p>
                                        <button className="bg-gray-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-700 transition">
                                            See Details
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600 py-10">
                            <p>No textbooks found matching your criteria.</p>
                            <button
                                onClick={resetFilters}
                                className="text-gray-600 hover:text-gray-800 mt-2"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TextBook;
