
import React, { useState } from 'react'
// import { useRouter } from "next/navigation"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom";

const NavRouter = () => {
    // const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [showProfileMenu, setShowProfileMenu] = useState(false)




    const NavLink = [
        { label: "SignIn", to: "/login" },
        // { label: "MyAccount", to: "/ui/Account" },
        // { label: "Basket", to: "/ui/Basket" },
        { label: "Help", to: "/help" },
    ]

    return (
        <div className="hidden md:flex items-center gap-6">
            {
                NavLink.map((link) => (
                    <Link
                        key={link.label}
                        to={link.to}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 relative group"
                    >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                ))
            }

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
                            <Link
                                to="/account"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                Your Profile
                            </Link>
                            <Link
                                to="/ui/orders"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                Your Orders
                            </Link>
                            <Link
                                to="/ui/wishlist"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                Wishlist
                            </Link>
                            <div className="border-t border-gray-100"></div>
                            <button
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => {
                                    // In a real app, this would call a logout function
                                    router.push("/")
                                    setShowProfileMenu(false)
                                }}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavRouter

