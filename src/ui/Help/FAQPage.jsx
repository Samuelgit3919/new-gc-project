import { useMemo, useState } from "react";
// import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Layout from "../../Layout";
import {
    ChevronDown,
    ChevronUp,
    Search,
    ShoppingBag,
    Book,
    Headphones,
    CreditCard,
    User,
    Package,
    Mail,
    X,
} from "lucide-react";


const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState("orders");
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [searchQuery, setSearchQuery] = useState("");


    const categories = [
        { id: "orders", name: "Orders", icon: ShoppingBag },
        { id: "ebooks", name: "E-Books", icon: Book },
        { id: "audiobooks", name: "Audio Books", icon: Headphones },
        { id: "payments", name: "Payments & Refunds", icon: CreditCard },
        { id: "accounts", name: "Accounts & Login", icon: User },
        { id: "shipping", name: "Shipping", icon: Package },
    ];

    const faqData = {
        orders: [
            {
                question: "How do I track my order?",
                answer: "You can track your order by logging into your account and visiting the 'My Orders' section..."
            },
            {
                question: "Can I modify or cancel my order?",
                answer: "You can modify or cancel your order within 1 hour of placing it..."
            },
            {
                question: "What should I do if my order is delayed?",
                answer: "If your order is taking longer than the estimated delivery time..."
            },
            {
                question: "How do I return a book?",
                answer: "To return a book, go to 'My Orders' in your account, select the order..."
            },
        ],
        ebooks: [
            {
                question: "How do I download my e-book?",
                answer: "After purchasing an e-book, you can download it by logging into your account..."
            },
            {
                question: "Which devices are compatible with your e-books?",
                answer: "Our e-books are compatible with most e-readers including Kindle..."
            },
            {
                question: "Can I share my e-book with family members?",
                answer: "Our Family Library feature allows you to share your e-books with up to 5 family members..."
            },
            {
                question: "What if my e-book has formatting issues?",
                answer: "If you encounter formatting issues with your e-book, try downloading it in a different format..."
            },
        ],
        audiobooks: [
            {
                question: "How do I listen to my audiobooks?",
                answer: "You can listen to your audiobooks through our mobile app or on our website..."
            },
            {
                question: "Can I listen to audiobooks offline?",
                answer: "Yes, you can download audiobooks for offline listening through our mobile app..."
            },
            {
                question: "What is the quality of your audiobooks?",
                answer: "Our audiobooks are available in standard quality (64kbps) and high quality (128kbps)..."
            },
            {
                question: "How do I adjust playback speed?",
                answer: "You can adjust the playback speed of audiobooks in our app..."
            },
        ],
        payments: [
            {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay..."
            },
            {
                question: "How do I request a refund?",
                answer: "To request a refund, go to 'My Orders' in your account..."
            },
            {
                question: "When will my credit card be charged?",
                answer: "Your credit card will be charged immediately when you place an order for e-books and audiobooks..."
            },
            {
                question: "Do you offer installment payment options?",
                answer: "Yes, for orders over $50, we offer installment payments through Affirm and Klarna..."
            },
        ],
        accounts: [
            {
                question: "How do I reset my password?",
                answer: "To reset your password, click on the 'Forgot Password' link on the login page..."
            },
            {
                question: "Can I have multiple shipping addresses?",
                answer: "Yes, you can save multiple shipping addresses in your account..."
            },
            {
                question: "How do I update my email preferences?",
                answer: "To update your email preferences, go to 'Account Settings'..."
            },
            {
                question: "What should I do if I suspect unauthorized access to my account?",
                answer: "If you suspect unauthorized access to your account, immediately change your password..."
            },
        ],
        shipping: [
            {
                question: "What are your shipping options and rates?",
                answer: "We offer Standard, Expedited, and Express Shipping..."
            },
            {
                question: "Do you ship internationally?",
                answer: "Yes, we ship to over 100 countries worldwide..."
            },
            {
                question: "How are shipping delays handled?",
                answer: "If your order is delayed beyond the estimated delivery date..."
            },
            {
                question: "Do you offer in-store pickup?",
                answer: "Yes, if you live near one of our physical bookstore locations..."
            },
        ],
    };

    const toggleQuestion = (questionId) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };
    const allFaqs = useMemo(() => {
        return Object.entries(faqData).flatMap(([categoryId, items]) =>
            items.map(item => ({ ...item, categoryId }))
        );
    }, []);

    // Filter FAQs based on search query
    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) {
            return faqData[activeCategory];
        }

        const query = searchQuery.toLowerCase();
        return allFaqs
            .filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            )
            .map(faq => ({
                ...faq,
                isFromOtherCategory: faq.categoryId !== activeCategory
            }));
    }, [searchQuery, activeCategory, allFaqs]);


    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <Layout>

            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Frequently Asked Questions
                        </h1>

                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    className="pl-10 pr-10 py-2 text-base rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Categories Sidebar */}
                        <div className="w-full md:w-1/3 lg:w-1/4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="font-semibold text-lg mb-4">FAQ Categories</h2>
                                <ul className="space-y-2">
                                    {categories.map(({ id, name, icon: Icon }) => (
                                        <li key={id}>
                                            <button
                                                onClick={() => {
                                                    setActiveCategory(id);
                                                    setExpandedQuestions({});
                                                    setSearchQuery("");
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${activeCategory === id
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-4 border-t border-gray-200">
                                    <h3 className="font-medium mb-2">Need More Help?</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Can't find what you're looking for? Our support team is here to help.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Content */}
                        <div className="w-full md:w-2/3 lg:w-3/4">
                            {(() => {
                                const category = categories.find(c => c.id === activeCategory);
                                const Icon = category?.icon;
                                return (
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        {Icon && <Icon className="h-5 w-5 text-blue-600" />}
                                        {searchQuery ? "Search Results" : `${category?.name} FAQ`}
                                    </h2>
                                );
                            })()}

                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((item, index) => {
                                        const isExpanded = expandedQuestions[index] || false;
                                        return (
                                            <div key={index} className="border-b border-gray-200 pb-4">
                                                {item.isFromOtherCategory && (
                                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                        <span>From:</span>
                                                        {(() => {
                                                            const cat = categories.find(c => c.id === item.categoryId);
                                                            const CatIcon = cat?.icon;
                                                            return (
                                                                <span className="font-medium flex items-center gap-1">
                                                                    {CatIcon && <CatIcon className="h-3 w-3" />}
                                                                    {cat?.name}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                                <button
                                                    className="flex justify-between items-center w-full text-left"
                                                    onClick={() => toggleQuestion(index)}
                                                >
                                                    <h3 className="font-medium text-gray-900">{item.question}</h3>
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </button>
                                                {isExpanded && (
                                                    <div className="mt-2 text-gray-600 pl-2">
                                                        {item.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {searchQuery ?
                                            "No results found for your search." :
                                            "No FAQs available for this category."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FAQPage;