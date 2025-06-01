

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Dashboard from "./Dashboard"
import ManagementView from "./ManagementView"
import { mockBooks, mockOrders, defaultSettings } from "./data/mock-data"

export default function BookstoreAdmin() {
    const [activeView, setActiveView] = useState("dashboard")
    const [books, setBooks] = useState(mockBooks)
    const [orders, setOrders] = useState(mockOrders)
    const [settings, setSettings] = useState(defaultSettings)
    const [searchQuery, setSearchQuery] = useState("")

    const getTitle = () => {
        switch (activeView) {
            case "dashboard":
                return "Dashboard"
            case "books":
                return "Book Management"
            case "orders":
                return "Order Management"
            case "settings":
                return "Settings"
            default:
                return "Bookstore Admin"
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header title={getTitle()} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {activeView === "dashboard" && <Dashboard books={books} orders={orders} />}

                    {activeView !== "dashboard" && (
                        <ManagementView
                            activeView={activeView}
                            books={books}
                            setBooks={setBooks}
                            orders={orders}
                            setOrders={setOrders}
                            settings={settings}
                            setSettings={setSettings}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    )}
                </main>
            </div>
        </div>
    )
}
