import React, { useContext, useState, useEffect, useRef } from "react";
import { ShoppingCart, LogOut, User, Heart, ListOrdered, HelpCircle, Mail, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DataContext } from "../../DataProvider/DataProvider";
import { FaUserCircle } from "react-icons/fa";
import { Type } from "../../Utility/action.type";

const NavRouter = ({ isMobile = false, onNavigate }) => {
    const [activeDropdown, setActiveDropdown] = useState(null); // 'profile' or 'help'
    const navRef = useRef(null);
    const [cartAnim, setCartAnim] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState({ help: false, profile: false });

    const NavLink = [
        { label: "Help", to: "/help", isDropdown: true },
    ];

    const helpLinks = [
        { label: "Terms of Use", to: "/termsOfUse", icon: BookOpen },
        { label: "Contact US", to: "/contactPage", icon: Mail },
        { label: "FAQ", to: "/FaqPage", icon: MessageCircle },
    ];

    const [{ basket, user }, dispatch] = useContext(DataContext);
    const totalItem = basket?.reduce((amount, item) => amount + item.amount, 0);

    // Animate cart badge when count changes
    useEffect(() => {
        if (totalItem > 0) {
            setCartAnim(true);
            const timeout = setTimeout(() => setCartAnim(false), 400);
            return () => clearTimeout(timeout);
        }
    }, [totalItem]);

    const profileLinks = user
        ? [
            { label: "Your Profile", to: "/account", icon: User },
            // { label: "Your Orders", to: "/ui/orders", icon: ListOrdered },
            // { label: "Wishlist", to: "/ui/wishlist", icon: Heart },
            { label: "Sign out", to: "/", isButton: true, icon: LogOut },
        ]
        : [
            { label: "Sign In", to: "/login", icon: User },
        ];

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch({ type: Type.SET_USER, user: null });
        setActiveDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (dropdownName) => {
        if (isMobile) {
            setMobileDropdown((prev) => ({ ...prev, [dropdownName]: !prev[dropdownName] }));
        } else {
            setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
        }
    };

    return (
        <div className={`${isMobile ? '' : 'hidden md:flex'} items-center gap-6`} ref={navRef}>
            {NavLink.map((link) =>
                link.isDropdown ? (
                    isMobile ? (
                        <div key={link.label} className="w-full mb-4">
                            <button
                                className="flex items-center w-full justify-between px-5 py-3 text-base font-medium text-gray-700 hover:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg transition-all bg-white shadow border border-gray-200"
                                onClick={() => toggleDropdown("help")}
                                aria-expanded={mobileDropdown.help}
                                aria-controls="mobile-help-dropdown"
                            >
                                <span className="flex items-center gap-2"><HelpCircle className="h-5 w-5 mr-1" />{link.label}</span>
                                <svg className={`w-4 h-4 ml-2 transition-transform ${mobileDropdown.help ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div
                                id="mobile-help-dropdown"
                                className={`overflow-hidden transition-all duration-300 ${mobileDropdown.help ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="flex flex-col bg-gray-50 rounded-b-lg shadow-inner border-t border-gray-200">
                                    {helpLinks.map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            className="flex items-center gap-2 px-7 py-3 text-base text-gray-700 hover:bg-purple-100 hover:text-purple-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                                            onClick={() => {
                                                setMobileDropdown((prev) => ({ ...prev, help: false }));
                                                if (onNavigate) onNavigate();
                                            }}
                                            role="menuitem"
                                        >
                                            <item.icon className="h-5 w-5 text-purple-500" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div key={link.label} className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                onClick={() => toggleDropdown("help")}
                                aria-label={link.label}
                                aria-expanded={activeDropdown === "help"}
                            >
                                <HelpCircle className="mr-1 h-5 w-5" />
                                {link.label}
                                <span className="sr-only">Toggle {link.label} menu</span>
                            </Button>
                            <div
                                className={`absolute right-0 mt-2 w-56 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200
                                    ${activeDropdown === "help" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                                style={{ minWidth: '12rem' }}
                            >
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="help-menu">
                                    {helpLinks.map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                                            onClick={() => setActiveDropdown(null)}
                                            role="menuitem"
                                        >
                                            <item.icon className="h-4 w-4 text-purple-500" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <Link
                        key={link.label}
                        to={link.to}
                        className={`text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${isMobile ? 'block px-4 py-2' : ''}`}
                        onClick={() => {
                            if (onNavigate) onNavigate();
                        }}
                    >
                        {link.label}
                        {!isMobile && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>}
                    </Link>
                )
            )}

            <div className="relative">
                <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                        <ShoppingCart className="h-5 w-5 text-gray-700" />
                        <span
                            className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px] min-h-[20px] shadow border border-white transition-transform duration-300 ${cartAnim ? 'scale-125' : 'scale-100'}`}
                            style={{ fontSize: "0.75rem" }}
                        >
                            {totalItem}
                        </span>
                        <span className="sr-only">Cart</span>
                    </Button>
                </Link>
            </div>

            {/* Profile Dropdown (now in main nav for all sizes) */}
            <div className="relative w-full md:w-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 w-full md:w-auto justify-between md:justify-center ${isMobile ? 'px-5 py-3 bg-white shadow border border-gray-200 rounded-lg mb-4' : ''}`}
                    onClick={() => toggleDropdown("profile")}
                    aria-label="Profile"
                    aria-expanded={isMobile ? mobileDropdown.profile : activeDropdown === "profile"}
                    aria-controls={isMobile ? "mobile-profile-dropdown" : undefined}
                >
                    {user && user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover mr-2" />
                    ) : (
                        <FaUserCircle className="text-xl mr-2" />
                    )}
                    <span>{user ? (user.name || user.email) : 'Profile'}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform ${((isMobile && mobileDropdown.profile) || (!isMobile && activeDropdown === 'profile')) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </Button>
                <div
                    id={isMobile ? "mobile-profile-dropdown" : undefined}
                    className={`absolute right-0 md:right-0 mt-2 w-full md:w-56 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200
                        ${((isMobile && mobileDropdown.profile) || (!isMobile && activeDropdown === "profile")) ? "opacity-100 max-h-96 translate-y-0 pointer-events-auto" : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"}
                        ${isMobile ? 'overflow-hidden' : ''}`}
                    style={{ minWidth: isMobile ? undefined : '12rem' }}
                >
                    <div className={`py-1 ${isMobile ? 'flex flex-col bg-gray-50 rounded-b-lg shadow-inner border-t border-gray-200' : ''}`} role="menu" aria-orientation="vertical" aria-labelledby="profile-menu">
                        {profileLinks.map((link) =>
                            link.isButton ? (
                                <button
                                    key={link.label}
                                    className={`flex items-center gap-2 w-full ${isMobile ? 'px-7 py-3 text-base' : 'px-4 py-2 text-sm'} text-gray-700 hover:${isMobile ? 'bg-purple-100 text-purple-900' : 'bg-gray-100 text-gray-900'} focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all`}
                                    onClick={() => {
                                        if (link.label.toLowerCase() === "sign out") {
                                            handleSignOut();
                                        }
                                        if (isMobile) {
                                            setMobileDropdown((prev) => ({ ...prev, profile: false }));
                                        } else {
                                            setActiveDropdown(null);
                                        }
                                        if (onNavigate) onNavigate();
                                    }}
                                    role="menuitem"
                                >
                                    <link.icon className="h-5 w-5 text-purple-500" />
                                    {link.label}
                                </button>
                            ) : (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className={`flex items-center gap-2 ${isMobile ? 'px-7 py-3 text-base' : 'px-4 py-2 text-sm'} text-gray-700 hover:${isMobile ? 'bg-purple-100 text-purple-900' : 'bg-gray-100 text-gray-900'} focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all`}
                                    onClick={() => {
                                        if (isMobile) {
                                            setMobileDropdown((prev) => ({ ...prev, profile: false }));
                                        } else {
                                            setActiveDropdown(null);
                                        }
                                        if (onNavigate) onNavigate();
                                    }}
                                    role="menuitem"
                                >
                                    <link.icon className="h-5 w-5 text-purple-500" />
                                    {link.label}
                                </Link>
                            )
                        )}
                        {user && (
                            <hr className="my-2 border-t border-gray-200" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavRouter;