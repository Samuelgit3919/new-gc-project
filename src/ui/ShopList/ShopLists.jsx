import { Link } from "react-router-dom";
import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs"
// import { bookStores } from "./shopLista";
import Layout from "../../Layout"

const ShopLists = () => {
    const bookStores = [
        {
            id: 1,
            owner: "Mekdi",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.addislibrary.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "ADDIS LIBRARY",
            contact: "Office: +25111467...",
        },
        {
            id: 2,
            owner: "miki",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.africabookstore.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "AFRICA BOOK STORE",
            contact: "Office: +25111111...",
        },
        {
            id: 3,
            owner: "sami",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.africanbookshop.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "AFRICAN BOOK SHOP",
            contact: "Office: +25111111...",
        },
        {
            id: 4,
            owner: "aggam",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.aggam.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "AGGAM HEALTH, NUTRITION, CHILD CARE AND MARRIAGE COUNSELING",
            contact: "Mobile: +25191167...",
        },
        {
            id: 5,
            owner: "Fasika",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.al-aqssa.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "AL-AQSSA BOOK STORE",
            contact: "Office: +25111111...",
        },
        {
            id: 6,
            owner: "ayana",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.ayanapublishing.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "AYANA PUBLISHING P.L.C",
            contact: "Mobile: +25191194...",
        },
        {
            id: 7,
            owner: "Bisre",
            location: "Addis Ababa",
            rating: 4.5,
            website: "www.aynalem.com",
            description: "",
            imageUrl: "",
            mapEmbed:
                "https://maps.google.com/maps?q=shop&t=&z=13&ie=UTF8&iwloc=&output=embed",
            phone: "555-0123",
            email: "shop@example.com",
            name: "AYNALEM BOOK STORE",
            contact: "Office: +25111550...",
        },
    ];

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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Addis Abeba">Addis Abeba</option>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
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
                        className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-200 placeholder-gray-400"
                    />

                    {/* Book Stores List */}
                    <div className="space-y-6">
                        {bookStores.map((store) => (
                            <Link
                                key={store.id}
                                to={`/shopLists/${store.id}`}
                                className="flex justify-between items-center border-b border-gray-200 pb-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center">
                                    {/* Logo Placeholder */}
                                    <div className="w-12 h-12 bg-gray-200 mr-4 rounded-full flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">Logo</span>
                                    </div>

                                    {/* Store Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600 hover:text-purple-800 transition">
                                            {store.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{store.contact}</p>
                                        {store.website && (
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <span className="inline-block mr-1">🌐</span> Website
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* More Details Button */}
                                <div>
                                    <button className="bg-purple-200 text-gray font-semibold py-2 px-4 rounded-md hover:bg-purple-300 transition">
                                        More Details
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ShopLists;
