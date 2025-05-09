
import { useState } from "react";
// Named import (recommended)
import { Link } from "react-router-dom";
import { IoIosBook, IoIosSearch } from "react-icons/io";
import Lower from "./Lower";
import { IoClose, IoMenu } from "react-icons/io5";
import NavRouter from "./NavRouter";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-md md:px-4">
                <div className="container mx-auto px-4 py-1 md:py-2">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <IoIosBook className="text-2xl md:text-3xl text-gray-800 transition-transform hover:scale-110" />
                            <span className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">
                                BookCompass
                            </span>
                        </Link>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search by keyword, title, author or ISBN"
                                    className="w-full py-2 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors">
                                    <IoIosSearch className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

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
                    <div className="md:hidden mt-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search books..."
                                className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600">
                                <IoIosSearch className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
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
