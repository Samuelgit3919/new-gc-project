import React, { useContext, useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DataContext } from "../../DataProvider/DataProvider";
import { FaUserCircle } from "react-icons/fa";
import { Type } from "../../Utility/action.type";

const NavRouter = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showHelpMenu, setShowHelpMenu] = useState(false);

    const NavLink = [
        { label: "Help", to: "/help", isDropdown: true },
    ];

    const helpLinks = [
        { label: "Terms of Use", to: "/termsOfUse" },
        { label: "Contact US", to: "/contactPage" },
        { label: "FAQ", to: "/FaqPage" },
    ];

    const [{ basket, user }, dispatch] = useContext(DataContext);
    const totalItem = basket?.reduce((amount, item) => amount + item.amount, 0);

    const profileLinks = user
        ? [
            { label: "Your Profile", to: "/account" },
            { label: "Your Orders", to: "/ui/orders" },
            { label: "Wishlist", to: "/ui/wishlist" },
            { label: "Sign out", to: "/", isButton: true },
        ]
        : [
            { label: "Sign In", to: "/login" },
        ];

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch({ type: Type.SET_USER, user: null });
        setShowProfileMenu(false);
    };

    return (
        <div className="hidden md:flex items-center gap-6">
            {NavLink.map((link) =>
                link.isDropdown ? (
                    <div key={link.label} className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center"
                            onClick={() => setShowHelpMenu(!showHelpMenu)}
                            aria-label={link.label}
                            aria-expanded={showHelpMenu}
                        >
                            {link.label}
                            <span className="sr-only">Toggle {link.label} menu</span>
                        </Button>
                        {showHelpMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="help-menu">
                                    {helpLinks.map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            onClick={() => setShowHelpMenu(false)}
                                            role="menuitem"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        key={link.label}
                        to={link.to}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 relative group"
                    >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                )
            )}

            <div className="relative">
                <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5 text-gray-700" />
                        <span
                            className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px] min-h-[20px] shadow"
                            style={{ fontSize: "0.75rem" }}
                        >
                            {totalItem}
                        </span>
                        <span className="sr-only">Cart</span>
                    </Button>
                </Link>
            </div>

            <div className="relative inline-block text-left">
                <button
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex items-center space-x-2 px-4 py-2 bg-transparent text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                    <FaUserCircle className="text-xl" />
                    {user && <span>{user.name || user.email}</span>}
                </button>

                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            {profileLinks.map((link) =>
                                link.isButton ? (
                                    <button
                                        key={link.label}
                                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        onClick={() => {
                                            if (link.label.toLowerCase() === "sign out") {
                                                handleSignOut();
                                            }
                                            setShowProfileMenu(false);
                                        }}
                                        role="menuitem"
                                    >
                                        {link.label}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        onClick={() => setShowProfileMenu(false)}
                                        role="menuitem"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavRouter;