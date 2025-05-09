import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { AiFillMessage } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoIosBook } from 'react-icons/io';

const Lower = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // Get current path (alternative to Next.js usePathname)
    const currentPath = window.location.pathname;

    const links = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "EBooks",
            href: "/EBook",
        },
        {
            label: "ShopLists",
            href: "/shopLists",
        },
        {
            label: "Textbooks",
            href: "/textbooks",
        },
        {
            label: "Audiobooks",
            href: "/audiobooks",
        },
    ];

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-gray-100 p-2">
            <div className="flex justify-between md:justify-around items-center mx-2">
                <div className="hidden md:flex gap-5">
                    {links.map((link) => (
                        <Link
                            to={link.href}
                            key={link.label}
                            className={`text-gray-600 block py-2 hover:text-gray-900 hover:rounded-md ${currentPath === link.href ? "text-gray-900 font-medium" : ""
                                }`}
                            onClick={toggleMenu}
                        >
                            {link.label}
                            {link.icon && <span className="ml-1">{link.icon}</span>}
                        </Link>
                    ))}
                </div>

                {/* Mobile menu button would go here */}
            </div>

            {/* Mobile menu */}
            <div
                className={`fixed top-0 right-0 h-full w-2/4 bg-gray-100 z-50 transition-transform ${menuOpen ? "translate-x-0" : "translate-x-full"
                    } md:hidden`}
            >
                <div className="flex flex-col items-start p-4">
                    {links.map((link) => (
                        <Link
                            to={link.href}
                            key={link.label}
                            className={`text-purple-600 block py-2 w-full hover:text-gray-900 hover:bg-teal-100 hover:rounded-md hover:p-2 ${currentPath === link.href ? "text-gray-900 font-medium" : ""
                                }`}
                            onClick={toggleMenu}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Lower;