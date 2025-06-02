
import { useState } from "react";
// Named import (recommended)
import { Link } from "react-router-dom";
import { IoIosBook, IoIosSearch } from "react-icons/io";
import Lower from "./Lower";
import { IoClose, IoMenu } from "react-icons/io5";
import NavRouter from "./NavRouter";
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
            setIsMobileMenuOpen(false); // Close mobile menu if open
        }
    };


    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-md md:px-4">
                <div className="container mx-auto px-4 py-1 md:py-2">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <IoIosBook className="text-2xl md:text-3xl text-gray-800 transition-transform hover:scale-110" />
                            <span className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">
                                BookCompass
                            </span>
                        </Link>

                        {/* Search Bar - Hidden on mobile */}
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by keyword, title, author or ISBN"
                                className="w-full py-2 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600">
                                <IoIosSearch className="h-5 w-5" />
                            </button>
                        </form>


                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <NavRouter />
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-600 hover:text-purple-800 transition-colors p-1"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <IoClose className="h-6 w-6" />
                            ) : (
                                <IoMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Search Bar */}
                    {isMobileMenuOpen && (
                        <form onSubmit={handleSearch} className="relative w-full px-4 mt-2 md:hidden">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by keyword, title, author or ISBN"
                                className="w-full py-2 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                            />
                            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600">
                                <IoIosSearch className="h-5 w-5" />
                            </button>
                        </form>
                    )}
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex flex-col pt-20 px-6 h-full bg-gradient-to-b from-purple-50 to-white">
                        <NavRouter />
                    </div>
                </div>
            </header>

            {/* Lower Navigation Component */}
            <div className="mt-0">
                <Lower />
            </div>
        </>
    );
};

export default Navbar;
