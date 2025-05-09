
import { Link, useParams } from 'react-router-dom';
import React from 'react';
// import { bookStores } from '../shopLista';

const ShopListDetail = () => {
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

    const { id } = useParams();
    const shopLists = parseInt(id, 10); // Convert string ID to number
    const shop = bookStores.find((book) => book.id === shopLists);

    // const shop = bookStores.find((store) => store.name.toLowerCase() === shopName.toLowerCase());

    if (!shop || !shop.id) {
        return <div className="container mx-auto px-4 py-8">Shop not found</div>;
    }
    // Handle case where shop isn't found
    if (!shop) {
        return <div className="container mx-auto px-4 py-8">Shop not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Main Content Section */}
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-6">
                {/* Info Section */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">{shop.name}</h1>
                    <p className="text-gray-600 leading-relaxed">
                        {shop.description || 'No description available'}
                    </p>

                    {/* Contact Info */}
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="text-gray-500">📞</span>
                            <Link
                                to={`tel:${shop.phone}`}
                                className="text-blue-600 hover:underline"
                            >
                                {shop.phone}
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-gray-500">✉️</span>
                            <Link
                                to={`mailto:${shop.email}`}
                                className="text-blue-600 hover:underline"
                            >
                                {shop.email}
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-gray-500">🌐</span>
                            <Link
                                to={shop.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {shop.website}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Image Section */}
                <div className="relative h-64 md:h-auto">
                    {/* <Image
                        src={shop.imageUrl || '/placeholder-image.jpg'} // Add fallback image
                        alt={`${shop.name} store`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg'; // Fallback on error
                        }}
                    /> */}
                </div>
            </div>

            {/* Map and Rating Section */}
            <div className="mt-8 grid md:grid-cols-2 gap-8">
                {/* Google Map */}
                <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                        src={shop.mapEmbed}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${shop.name} Location`}
                    />
                </div>

                {/* Rating and Reviews */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Rating</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-400 text-2xl">
                            {'★'.repeat(Math.floor(shop.rating))}
                            {'☆'.repeat(5 - Math.floor(shop.rating))}
                        </span>
                        <span className="text-gray-600">{shop.rating}/5</span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Leave a Review
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ShopListDetail;