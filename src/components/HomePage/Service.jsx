import React from "react";
import { FaBookOpen } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdAssistantNavigation, MdPriceChange } from "react-icons/md";

const data = [
    {
        title: "Clear Navigation",
        description:
            "Navigate with ease through an intuitive and user-friendly interface.",
        icon: <MdAssistantNavigation className="text-4xl text-gray-600" />,
        backgroundColor: "bg-gray-100",
    },
    {
        title: "Price Comparison",
        description: "Compare prices instantly and get the best deals available.",
        icon: <MdPriceChange className="text-4xl text-gray-600" />,
        backgroundColor: "bg-gray-100",
    },
    {
        title: "Personalized Service",
        description: "Enjoy a personalized experience tailored to your needs.",
        icon: <FaBookOpen className="text-4xl text-gray-600" />,
        backgroundColor: "bg-gray-100",
    },
    {
        title: "Community",
        description: "Engage with a community of book lovers and share insights.",
        icon: <FaPeopleGroup className="text-4xl text-gray-600" />,
        backgroundColor: "bg-gray-100",
    },
];

const Service = () => {
    return (
        <div className="px-5 py-10 bg-gray-50">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
                Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.map((item) => (
                    <div
                        key={item.title}
                        className={`p-6 rounded-lg shadow-lg ${item.backgroundColor} hover:bg-gray-200 transition duration-300`}
                    >
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="p-4 bg-white rounded-full shadow-md">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {item.title}
                            </h3>
                            <p className="text-gray-700">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Service;
