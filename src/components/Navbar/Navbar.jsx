import { useState, useEffect, useRef } from "react";
// Named import (recommended)
import { Link } from "react-router-dom";
import { IoIosBook, IoIosSearch, IoIosHelpCircle, IoIosCart, IoIosPerson } from "react-icons/io";
import Lower from "./Lower";
import { IoClose, IoMenu } from "react-icons/io5";
import NavRouter from "./NavRouter";
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const mobileMenuRef = useRef(null);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on outside click
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const handleClick = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isMobileMenuOpen]);

    // Close mobile menu on navigation
    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-md md:px-4 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-1 md:py-2 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <IoIosBook className="text-2xl md:text-3xl text-gray-800 transition-transform hover:scale-110" />
                        <span className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">
                            BookCompass
                        </span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full max-w-md hidden md:block"
                        role="search"
                        aria-label="Site search"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by keyword, title, author or ISBN"
                            className="w-full py-2 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                            aria-label="Search books"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            aria-label="Submit search"
                        >
                            <IoIosSearch className="h-5 w-5" />
                        </button>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <NavRouter onNavigate={handleNavClick} />
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600 hover:text-purple-800 transition-colors p-1"
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMobileMenuOpen ? (
                            <IoClose className="h-6 w-6" />
                        ) : (
                            <IoMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 md:hidden"
                        aria-hidden="true"
                        onClick={toggleMobileMenu}
                    />
                )}

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    ref={mobileMenuRef}
                    className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-xs z-50 transform transition-transform duration-300 ease-in-out flex flex-col
                        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
                        bg-gradient-to-b from-white via-purple-50 to-white shadow-2xl rounded-l-2xl focus:outline-none max-h-screen`}
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b">
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded" onClick={handleNavClick}>
                            <IoIosBook className="text-2xl text-gray-800" />
                            <span className="font-bold text-lg text-gray-900 tracking-tight">BookCompass</span>
                        </Link>
                        <button
                            className="text-gray-600 hover:text-purple-800 p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
                            onClick={toggleMobileMenu}
                            aria-label="Close menu"
                        >
                            <IoClose className="h-6 w-6" />
                        </button>
                    </div>
                    {/* Mobile Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="relative w-full px-6 mt-4"
                        role="search"
                        aria-label="Site search"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by keyword, title, author or ISBN"
                            className="w-full py-2 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                            aria-label="Search books"
                        />
                        <button
                            type="submit"
                            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded p-2"
                            aria-label="Submit search"
                        >
                            <IoIosSearch className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="flex flex-col pt-8 px-6 gap-6 flex-1 overflow-y-auto min-h-0">
                        {/* Pass onNavigate to NavRouter so it closes menu on link click */}
                        <NavRouter onNavigate={handleNavClick} isMobile={true} />
                        <hr className="my-6 border-t border-gray-200" />
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
