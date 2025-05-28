import { Link } from "react-router-dom";
import React from 'react';
import { AiFillMessage } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoIosBook } from 'react-icons/io';

const Lower = () => {
    const currentPath = window.location.pathname;

    const links = [
        { label: "Home", href: "/", icon: <IoIosBook className="inline ml-1" /> },
        { label: "EBooks", href: "/EBook", icon: <IoIosBook className="inline ml-1" /> },
        { label: "Shops", href: "/shopLists", icon: <AiFillMessage className="inline ml-1" /> },
        { label: "Textbooks", href: "/textbooks", icon: <IoIosBook className="inline ml-1" /> },
        { label: "Audiobooks", href: "/audiobooks", icon: <CgProfile className="inline ml-1" /> },
    ];

    return (
        <nav className="bg-gray-100 p-2 sm:p-3 shadow-sm">
            <div className="container mx-auto flex justify-center items-center">
                <div className="flex flex-wrap gap-1 sm:gap-4 md:gap-6">
                    {links.map((link) => (
                        <Link
                            to={link.href}
                            key={link.label}
                            className={`flex items-center px-3 py-2 text-xs sm:text-sm md:text-base font-medium rounded-md transition-colors ${currentPath === link.href
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            aria-current={currentPath === link.href ? "page" : undefined}
                        >
                            {link.label}
                            {/* <span className="ml-1 text-sm sm:text-base">{link.icon}</span> */}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Lower;