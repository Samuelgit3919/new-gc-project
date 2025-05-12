import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardView from "./DashboardView";
import BookManagementView from "./BookManagementView";
import OrderManagementView from "./OrderManagementView";
import UserManagementView from "./UserManagementView";
import SettingsView from "./SettingView";
import BookDialog from "./BookDialog";
import DeleteBookDialog from "./DeleteBookDialog";
import OrderDetailsDialog from "./OrderDetailsDialog";

// Mock Data
const mockBooks = [
    {
        id: 1,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        isbn: "978-1250301697",
        category: "Thriller",
        price: 24.99,
        stock: 45,
        status: "In Stock",
        image: "/placeholder.svg?height=40&width=40",
    },
    // ... rest of the mock books
];

const mockOrders = [
    {
        id: "ORD-7652",
        customer: "John Smith",
        email: "john.smith@example.com",
        date: "2023-05-12",
        total: 124.95,
        status: "Completed",
        items: 3,
    },
    // ... rest of the mock orders
];

const mockUsers = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        role: "Customer",
        status: "Active",
        joinDate: "2023-01-15",
        orders: 8,
        image: "/placeholder.svg?height=40&width=40",
    },
    // ... rest of the mock users
];

function BookstoreAdmin() {
    // Main state
    const [activeView, setActiveView] = useState("dashboard");
    const [books, setBooks] = useState(mockBooks);
    const [orders, setOrders] = useState(mockOrders);
    const [users, setUsers] = useState(mockUsers);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Dashboard state
    const [bookGrowth] = useState(12.5);
    const [orderGrowth] = useState(8.2);
    const [userGrowth] = useState(5.7);
    const [revenueGrowth] = useState(-2.3);

    // Book management state
    const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
    const [isDeleteBookDialogOpen, setIsDeleteBookDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deletingBookId, setDeletingBookId] = useState(null);
    const [filteredBooks, setFilteredBooks] = useState(books);
    const [bookCurrentPage, setBookCurrentPage] = useState(1);
    const [bookActiveFilters, setBookActiveFilters] = useState({
        categories: [],
        statuses: [],
    });
    const [bookFormData, setBookFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        price: 0,
        stock: 0,
        image: "/placeholder.svg?height=40&width=40",
    });
    const [bookFormErrors, setBookFormErrors] = useState({});

    // Order management state
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [orderCurrentPage, setOrderCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
    const [orderActiveFilters, setOrderActiveFilters] = useState({
        statuses: [],
    });

    // User management state
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const [userActiveFilters, setUserActiveFilters] = useState({
        roles: [],
        statuses: [],
    });

    // Settings state
    const [settings, setSettings] = useState({
        storeName: "Bookworm Haven",
        email: "contact@bookwormhaven.com",
        phone: "+1 (555) 123-4567",
        currency: "usd",
        address: "123 Bookstore Lane, Reading, CA 90210, United States",
        notifications: {
            newOrder: true,
            lowStock: true,
            customerAccount: false,
            marketing: true,
        },
    });
    const [settingsFormData, setSettingsFormData] = useState(settings);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Pagination constants
    const itemsPerPage = 5;

    // Calculate dashboard stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter((order) => order.status === "Completed").length;
    const activeUserCount = users.filter((user) => user.status === "Active").length;

    // Mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Clean up event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Book filtering
    useEffect(() => {
        let result = [...books];

        // Apply search
        if (activeView === "books" && searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    book.isbn.toLowerCase().includes(query) ||
                    book.category.toLowerCase().includes(query)
            );
        }

        // Apply category filters
        if (bookActiveFilters.categories.length > 0) {
            result = result.filter((book) => bookActiveFilters.categories.includes(book.category));
        }

        // Apply status filters
        if (bookActiveFilters.statuses.length > 0) {
            result = result.filter((book) => bookActiveFilters.statuses.includes(book.status));
        }

        setFilteredBooks(result);
        setBookCurrentPage(1); // Reset to first page when filters change
    }, [books, searchQuery, bookActiveFilters, activeView]);

    const calculateMonthlySales = () => {
        const monthlySales = Array(12).fill(0); // 12 months
        orders.forEach((order) => {
            const month = new Date(order.date).getMonth(); // 0-11
            monthlySales[month] += order.total;
        });
        return monthlySales;
    };

    const getTopSellingBooks = () => {
        // This assumes that your `orders` array contains an `items` property with book details.
        const bookSales = {};

        orders.forEach((order) => {
            if (order.itemsDetail) {
                order.itemsDetail.forEach((item) => {
                    if (!bookSales[item.title]) {
                        bookSales[item.title] = 0;
                    }
                    bookSales[item.title] += item.quantity;
                });
            }
        });

        const sortedBooks = Object.entries(bookSales)
            .sort((a, b) => b[1] - a[1])
            .map(([title, count]) => ({ title, count }));

        return sortedBooks.slice(0, 5); // Top 5 selling books
    };

    // ... rest of the useEffect hooks and functions

    // Utility functions
    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Low Stock":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Out of Stock":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "Completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Processing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "Shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Inactive":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    };
    const handleAddBook = () => {
        setEditingBook(null);
        setBookFormData({
            title: "",
            author: "",
            isbn: "",
            category: "",
            price: 0,
            stock: 0,
            image: "/placeholder.svg?height=40&width=40",
        });
        setBookFormErrors({});
        setIsBookDialogOpen(true);
    };
    const handleEditBook = (book) => {
        setEditingBook(book);
        setBookFormData({   
            title: book.title,
        


    // ... rest of the utility functions

    // Get the title based on the active view
    const getTitle = () => {
        switch (activeView) {
            case "dashboard":
                return "Dashboard";
            case "books":
                return "Book Management";
            case "orders":
                return "Order Management";
            case "users":
                return "User Management";
            case "settings":
                return "Settings";
            default:
                return "Bookstore Admin";
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <Header
                    title={getTitle()}
                    isMobile={isMobile}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* Dashboard View */}
                    {activeView === "dashboard" && (
                        <DashboardView
                            books={books}
                            orders={orders}
                            users={users}
                            bookGrowth={bookGrowth}
                            orderGrowth={orderGrowth}
                            userGrowth={userGrowth}
                            revenueGrowth={revenueGrowth}
                            calculateMonthlySales={calculateMonthlySales}
                            getTopSellingBooks={getTopSellingBooks}
                        />
                    )}

                    {/* Book Management View */}
                    {activeView === "books" && (
                        <BookManagementView
                            books={books}
                            filteredBooks={filteredBooks}
                            currentBooks={currentBooks}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            bookActiveFilters={bookActiveFilters}
                            bookCategories={bookCategories}
                            bookStatuses={bookStatuses}
                            bookCurrentPage={bookCurrentPage}
                            setBookCurrentPage={setBookCurrentPage}
                            bookTotalPages={bookTotalPages}
                            bookIndexOfFirstItem={bookIndexOfFirstItem}
                            bookIndexOfLastItem={bookIndexOfLastItem}
                            handleAddBook={handleAddBook}
                            handleEditBook={handleEditBook}
                            handleDeleteBook={handleDeleteBook}
                            toggleFilter={toggleFilter}
                            clearFilters={clearFilters}
                            setBookActiveFilters={setBookActiveFilters}
                            getStatusColor={getStatusColor}
                        />
                    )}

                    {/* ... rest of the view components */}
                </main>
            </div>

            {/* Dialogs */}
            <BookDialog
                isOpen={isBookDialogOpen}
                onOpenChange={setIsBookDialogOpen}
                editingBook={editingBook}
                bookFormData={bookFormData}
                bookFormErrors={bookFormErrors}
                handleBookFormChange={handleBookFormChange}
                handleBookNumberChange={handleBookNumberChange}
                handleBookSelectChange={handleBookSelectChange}
                handleSaveBook={handleSaveBook}
            />

            <DeleteBookDialog
                isOpen={isDeleteBookDialogOpen}
                onOpenChange={setIsDeleteBookDialogOpen}
                onConfirm={confirmDeleteBook}
            />

            <OrderDetailsDialog
                isOpen={isViewOrderDialogOpen}
                onOpenChange={setIsViewOrderDialogOpen}
                selectedOrder={selectedOrder}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
            />
        </div>
    );
}

export default BookstoreAdmin;