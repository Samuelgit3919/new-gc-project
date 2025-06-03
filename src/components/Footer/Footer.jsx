import React from "react";
import {
    FaFacebook,
    FaXTwitter,
    FaLinkedin,
    FaInstagram,
} from "react-icons/fa6";
import { IoIosBook, IoLogoYoutube } from "react-icons/io";

const Footer = () => {
    return (
        <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <IoIosBook className="text-2xl md:text-3xl text-gray-500" />
                        <h1 className="text-2xl font-bold text-gray-500">BookCompass</h1>
                    </div>
                    <p className="text-gray-400">
                       Transforms the Ethiopian book market by offering an intuitive web-based platform that makes finding, comparing, and buying your favorite books easier than ever.
                    </p>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-400 transition-colors duration-300"
                            >
                                <FaFacebook className="w-6 h-6" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-400 transition-colors duration-300"
                            >
                                <IoLogoYoutube className="w-6 h-6" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-400 transition-colors duration-300"
                            >
                                <FaXTwitter className="w-6 h-6" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-400 transition-colors duration-300"
                            >
                                <FaLinkedin className="w-6 h-6" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-gray-400 transition-colors duration-300"
                            >
                                <FaInstagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-semibold">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                About us
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contactPage"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Contact us
                            </a>
                        </li>
                        <li>
                            <a
                                href="/textbooks"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Products
                            </a>
                        </li>
                        <li>
                            <a
                                href="/login"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Login
                            </a>
                        </li>
                        <li>
                            <a
                                href="/register"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Sign Up
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Customer Area */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-semibold">Customer Area</h3>
                    <ul className="space-y-3">
                        <li>
                            <a
                                href="/account"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                My Account
                            </a>
                        </li>
                        <li>
                            <a
                                href="/cart"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Orders
                            </a>
                        </li>
                        <li>
                            
                        </li>
                        <li>
                            <a
                                href="/termsOfUse"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Terms
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="/FaqPage"
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                            >
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Subscription */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-semibold">Don't miss the newest books</h3>
                    <p className="text-gray-400">
                        Stay updated with the latest releases and never miss a new book! Explore fresh titles handpicked just for you.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="submit"
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-800 py-8 text-center text-gray-400">
                <p>
                    &copy; {new Date().getFullYear()} BookCompass. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
