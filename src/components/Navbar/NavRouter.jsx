import React, { useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NavRouter = () => {
    const [cartItems, setCartItems] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showHelpMenu, setShowHelpMenu] = useState(false);

    const NavLink = [
        { label: "SignIn", to: "/login" },
        { label: "Help", to: "/help", isDropdown: true }, // Mark Help as a dropdown
    ];

    const helpLinks = [
        { label: "Terms of Use", to: "/termsOfUse" },
        { label: "Contact US", to: "/contactPage" },
        { label: "FAQ", to: "/FaqPage" },
    ];

    const profileLinks = [
        { label: "Your Profile", to: "/account" },
        { label: "Your Orders", to: "/ui/orders" },
        { label: "Wishlist", to: "/ui/wishlist" },
        { label: "Sign out", to: "/", isButton: true },
    ];

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
                    <Button variant="ghost" size="icon">
                        <ShoppingCart className="h-5 w-5" />
                        {cartItems.length > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                {cartItems.length}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>
                </Link>
            </div>
            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                </Button>
                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {profileLinks.map((link) =>
                                link.isButton ? (
                                    <button
                                        key={link.label}
                                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        onClick={() => {
                                            // In a real app, this would call a logout function
                                            // router.push(link.to)
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