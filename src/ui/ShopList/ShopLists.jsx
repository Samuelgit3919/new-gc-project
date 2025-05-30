"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import Layout from "../../Layout";
import { toast } from "sonner";

const ShopLists = () => {
    const [bookStores, setBookStores] = useState([]);
    const [filteredBookStores, setFilteredBookStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch bookstores from API
    const fetchBookStores = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const headers = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch("https://bookcompass.onrender.com/api/bookshop/shopList", {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch bookstores (Status: ${response.status})`);
            }

            const data = await response.json();
            console.log("API Response:", data); // Log to inspect the response

            // Ensure data is an array
            let bookStoreArray = [];
            if (Array.isArray(data.data)) {
                bookStoreArray = data.data;
            } else if (data && typeof data === "object") {
                bookStoreArray = [data];
            } else {
                throw new Error("Unexpected response format: Data is not an array or object");
            }

            // Handle empty response
            if (bookStoreArray.length === 0) {
                setBookStores([]);
                setFilteredBookStores([]);
                setLoading(false);
                return;
            }

            // Map API response to expected structure
            const formattedBookStores = bookStoreArray.map((store) => ({
                id: store._id || `store-${Math.random()}`, // Use _id from API
                name: store.seller?.name || "Unknown Bookstore",
                owner: store.seller?.name || "Unknown Owner",
                location: store.location?.address || "Unknown Location", // Google Maps URL
                rating: store.averageRating || 0,
                website: store.website || "", // Not in API, kept for compatibility
                contact: store.contact?.phoneNumber || "No contact info",
                email: store.contact?.email || "No email",
                phone: store.contact?.phoneNumber || "No phone",
                mapEmbed: store.location?.address || "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
                description: store.description || "", // Not in API, kept for compatibility
                imageUrl: store.images?.logo || "", // Use logo from images
                operatingHours: store.operatingHours || {}, // Include operating hours
                numReviews: store.numReviews || 0, // Include number of reviews
                availableBooks: store.availableBooks?.length || 0, // Number of books
            }));


            setBookStores(formattedBookStores);
            setFilteredBookStores(formattedBookStores);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "No bookstores found or failed to load bookstores.");
            setBookStores([]);
            setFilteredBookStores([]);
            toast.error(err.message || "No bookstores found or failed to load bookstores.");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchBookStores();
    }, []);

    // Apply search and filters
    useEffect(() => {
        let result = [...bookStores];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((store) =>
                store.name.toLowerCase().includes(query)
            );
        }

        // Apply location filter
        if (locationFilter) {
            result = result.filter((store) =>
                store.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        // Apply rating filter
        if (ratingFilter) {
            result = result.filter((store) => store.rating >= parseFloat(ratingFilter));
        }

        setFilteredBookStores(result);
    }, [bookStores, searchQuery, locationFilter, ratingFilter]);

    // Handle filter changes
    const handleLocationChange = (e) => {
        setLocationFilter(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRatingFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (loading) {
        return (
            <Layout className="w-full mx-auto py-8 bg-gray-50">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout className="w-full mx-auto py-8 bg-gray-50">
                <div className="text-center h-64 flex flex-col items-center justify-center gap-4">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={fetchBookStores}
                        className="bg-purple-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-purple-300 transition"
                    >
                        Retry
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout className="w-full mx-auto py-8 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
                {/* Filter Section */}
                <div className="md:w-1/4 w-full p-6 bg-white h-64 overflow-y-auto rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Filter Options
                    </h3>
                    <form className="space-y-4">
                        {/* Filter by Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Filter Location
                            </label>
                            <select
                                id="location"
                                name="location"
                                value={locationFilter}
                                onChange={handleLocationChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Locations</option>
                                {/* Hardcoded locations due to URL-based address */}
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Adama">Adama</option>
                                <option value="Bishoftu">Bishoftu</option>
                            </select>
                        </div>

                        {/* Filter by Rating */}
                        <div>
                            <label
                                htmlFor="rating"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Filter by Rating
                            </label>
                            <select
                                id="rating"
                                name="rating"
                                value={ratingFilter}
                                onChange={handleRatingChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Star</option>
                                <option value="4">4 Star</option>
                                <option value="3">3 Star</option>
                                <option value="2">2 Star</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Book Stores List Section */}
                <div className="md:w-3/4 w-full p-6 bg-white rounded-lg shadow-md">
                    {/* Header */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        BOOK STORES IN ETHIOPIA
                    </h2>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search by shop name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-200 placeholder-gray-400"
                    />

                    {/* Book Stores List */}
                    <div className="space-y-6">
                        {filteredBookStores.length > 0 ? (
                            filteredBookStores.map((store) => (
                                <Link
                                    key={store.id}
                                    to={`/shopLists/${store.id}`}
                                    className="flex justify-between items-center border-b border-gray-200 pb-4 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center">
                                        {/* Logo */}
                                        <div className="w-12 h-12 mr-4 rounded-full flex items-center justify-center overflow-hidden">
                                            {store.imageUrl ? (
                                                <img
                                                    src={store.imageUrl}
                                                    alt={`${store.name} logo`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-500 text-sm">Logo</span>
                                            )}
                                        </div>

                                        {/* Store Details */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-600 hover:text-purple-800 transition">
                                                {store.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">Contact: {store.contact}</p>
                                            {/* <p className="text-sm text-gray-600">Email: {store.email}</p> */}
                                            <p className="text-sm text-gray-600">Rating: {store.rating} ★ ({store.numReviews} reviews)</p>
                                            {/* <p className="text-sm text-gray-600">Books Available: {store.availableBooks}</p> */}
                                            {/* <p className="text-sm text-gray-600">
                                                Hours: {store.operatingHours.monday || "N/A"}
                                            </p> */}
                                            {store.website && (
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <span className="inline-block mr-1">🌐</span> Website
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* More Details Button */}
                                    <div>
                                        <button className="bg-purple-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-purple-300 transition">
                                            More Details
                                        </button>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-600">
                                0 bookstores found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ShopLists;