// Components/BestSeller/BestSeller.jsx
import React, { useContext, useEffect, useState } from "react";
import { MdStarRate } from "react-icons/md";
import { DataContext } from "../../DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BestSeller = () => {
    const [state, dispatch] = useContext(DataContext);
    const [productData, setProducts] = useState([]);


    useEffect(() => {
        fetch("/best.json")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => {
                console.error("Error fetching best sellers:", err);
                toast.error("Failed to load products.");
            });
    }, []);

    const addToCart = async (product) => {
        // 1. Add to context state for UI responsiveness
        dispatch({
            type: Type.ADD_TO_BASKET,
            item: {
                id: product._id,
                img: product.img,
                title: product.title,
                subtitle: product.subtitle,
                type: product.type,
                rating: product.rating,
                description: product.description,
            },
        });

        toast.success("Item added to cart!");

        // 2. Try to sync with backend if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("User not logged in — item stored in local state only.");
            return;
        }

        try {
            await axios.post(
                "https://bookcompass.onrender.com/api/cart/createCart",
                {
                    bookId: product._id,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Cart updated on backend.");
        } catch (err) {
            console.error("Backend sync failed:", err);
            toast.error("Failed to sync with backend cart.");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl md:text-4xl my-6 font-bold text-gray-800 tracking-tight">
                Best Sellers
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {productData.map((product, index) => (
                    <div
                        key={index}
                        className="group flex flex-col sm:flex-row transition-all duration-300 hover:shadow-xl rounded-xl bg-white overflow-hidden"
                    >
                        {/* Image Section */}
                        <div className="relative sm:w-2/5">
                            <img
                                src={product.img}
                                alt={product.title}
                                className="h-64 sm:h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {product.discountPrice && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {Math.round(
                                        (1 - product.discountPrice / product.price) * 100
                                    )}
                                    % OFF
                                </span>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col p-4 sm:w-3/5 gap-4">
                            {/* Tag and Rating */}
                            <div className="flex items-center justify-between">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {product.type}
                                </span>
                                <div className="flex items-center gap-1 text-orange-500">
                                    <MdStarRate size={20} />
                                    <span className="font-medium">{product.rating}</span>
                                </div>
                            </div>

                            {/* Title and Description */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {product.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    {product.subtitle}
                                </p>
                            </div>

                            {/* Author and Price */}
                            <div className="mt-auto flex items-center justify-between">
                                <p className="font-serif text-gray-700">{product.author}</p>
                                <div className="text-right">
                                    {product.discountPrice ? (
                                        <div>
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className="ml-2 text-xl font-bold text-gray-600">
                                                ${product.discountPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xl font-bold text-gray-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => addToCart(product)}
                                className="mt-4 w-full py-2 bg-gray-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-700"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
