"use client"

import { LayoutDashboard, BookOpen, ShoppingCart, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

function Sidebar({ activeView, setActiveView }) {
    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", value: "dashboard" },
        { icon: BookOpen, label: "Books", value: "books" },
        { icon: ShoppingCart, label: "Orders", value: "orders" },
        { icon: Settings, label: "Settings", value: "settings" },
    ]

    return (
        <aside className="hidden md:flex h-screen w-64 flex-col bg-white border-r dark:bg-gray-800 dark:border-gray-700">
            <div className="flex h-16 items-center border-b px-6 dark:border-gray-700">
                <h1 className="text-lg font-semibold">Bookstore Admin</h1>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.value}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start ${activeView === item.value ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                                onClick={() => setActiveView(item.value)}
                            >
                                <item.icon className="mr-2 h-5 w-5" />
                                {item.label}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="border-t p-4 dark:border-gray-700">
                <Button variant="ghost" className="w-full justify-start text-red-500">
                    <LogOut className="mr-2 h-5 w-5" />
                    Log out
                </Button>
            </div>
        </aside>
    )
}

export default Sidebar
