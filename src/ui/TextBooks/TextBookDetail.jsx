import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share, Star, BookOpen, MapPin, Phone, Globe } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import Layout from "@/Layout";
import axios from "axios";
import { DataContext } from "@/DataProvider/DataProvider";
import { Type } from "@/Utility/action.type";

export default function TextBookDetail() {
    const [textbook, setTextbook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        title: "",
        review: "",
    });
    const [visibleReviews, setVisibleReviews] = useState(2);
    const [reviews, setReviews] = useState([]); // Separate state for reviews
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [reviewErrorMessage, setReviewErrorMessage] = useState("");
    const navigate = useNavigate();
    const [{ basket }, dispatch] = useContext(DataContext);
    const [reviewSort, setReviewSort] = useState("date");
    const [relatedSort, setRelatedSort] = useState("price");

    const { id } = useParams();

    // Fetch textbook data
    const fetchTextbook = async () => {
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

            const response = await axios.get(
                `https://bookcompass.onrender.com/api/books/singleBook/${id}`,
                { headers }
            );

            const data = response.data?.data || response.data;
            if (!data) {
                throw new Error("No book data returned");
            }

            // Format the textbook data
            const formattedTextbook = {
                id: data._id,
                title: data.title || "Unknown Title",
                author: data.author || "Unknown Author",
                price: data.price || 0,
                imageUrl: data.imageUrl || "https://dummyimage.com/300x450/cccccc/000000&text=No+Image",
                description: data.description || "No description available",
                category: data.category || "General",
                format: { hardcover: data.price || 29.99 },
                averageRating: data.averageRating || 0,
                numReviews: data.numReviews || 0,
                isbn: data.isbn || "N/A",
                publisher: data.publisher || "Unknown Publisher",
                pages: data.pages || 0,
                language: data.language || "English",
                stock: data.stock || 0,
                year: new Date(data.createdAt).getFullYear() || new Date().getFullYear(),
                shopName: "BookCompass Store",
                location: "Online",
                contact: "+1234567890",
                website: "https://bookcompass.onrender.com",
                dimensions: "Unknown",
                featured: false,
            };

            setTextbook(formattedTextbook);

            // Fetch related books
            try {
                const relatedResponse = await axios.get(
                    "https://bookcompass.onrender.com/api/books/getPhysicalBooks",
                    { headers }
                );
                const allBooks = relatedResponse.data?.data || relatedResponse.data || [];
                const filteredRelated = allBooks
                    .filter(book => book._id !== id && book.category === data.category)
                    .slice(0, 5)
                    .map(book => ({
                        id: book._id,
                        title: book.title,
                        author: book.author,
                        imageUrl: book.imageUrl || "https://dummyimage.com/300x450/cccccc/000000&text=No+Image",
                        price: book.price || 29.99,
                    }));
                setRelatedBooks(filteredRelated);
            } catch (err) {
                console.error("Error fetching related books:", err);
                setRelatedBooks([]);
            }

        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to load textbook details");
        } finally {
            setLoading(false);
        }
    };

    // Fetch reviews for the textbook
    const fetchReviews = async () => {
        setReviewLoading(true);
        setReviewError(null);
        try {
            const sami = await axios.get(
                `https://bookcompass.onrender.com/api/reviews/${id}/reviews`
            );
            setReviews(Array.isArray(sami.data) ? sami.data : []);
            console.log(sami.data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setReviewError("Failed to load reviews");
        } finally {
            setReviewLoading(false);
        }
    };
    const postReview = async (reviewData) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            const response = await axios.post(
                `https://bookcompass.onrender.com/api/reviews/${id}/reviews`,
                reviewData,
                { headers }
            );
            return response.data;
        } catch (err) {
            console.error("Error posting review:", err);
            throw new Error(err.response?.data?.message || "Failed to post review");
        }
    };

    useEffect(() => {
        fetchTextbook();
        fetchReviews();
        postReview();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !textbook) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-semibold">Textbook Not Found</h2>
                    <p className="mt-2 text-muted-foreground">
                        {error || "The textbook you're looking for doesn't exist or has been removed."}
                    </p>
                    <Button asChild className="mt-6">
                        <Link to="/textbooks">Back to Textbooks</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    // Utility functions


    const handleAddToCart = () => {
        dispatch({
            type: Type.ADD_TO_BASKET,
            item: {
                id: textbook.id,
                title: textbook.title,
                price: textbook.price,
                imageUrl: textbook.imageUrl,
                amount: 1,
                type: "textbook",
            },
        });
        showNotification("Added to cart", `${textbook.title} - $${textbook.price.toFixed(2)}`);
    };

    const handleBuyNow = () => {
        // Add to cart if not already in basket
        if (!basket.find(item => item.id === textbook.id)) {
            handleAddToCart();
        }
        navigate("/chapaCheckout");
    };

    const handleToggleWishlist = async () => {
        const token = localStorage.getItem("token");
        if (!textbook || !token) return;
        try {
            if (!isWishlisted) {
                // Add to wishlist via POST
                const res = await fetch('https://bookcompass.onrender.com/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookId: textbook.id }),
                });
                if (!res.ok) throw new Error('Failed to add to wishlist');
                setIsWishlisted(true);
                showNotification("Added to wishlist", textbook.title);
            } else {
                // Remove from wishlist via DELETE
                const res = await fetch(`https://bookcompass.onrender.com/api/wishlist/${textbook.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error('Failed to remove from wishlist');
                setIsWishlisted(false);
                showNotification("Removed from wishlist", textbook.title);
            }
        } catch {
            showNotification("Wishlist error", "Could not update wishlist", "error");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: textbook.title,
                text: `Check out this textbook: ${textbook.title} by ${textbook.author}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showNotification("Link copied", "Textbook link has been copied to clipboard");
        }
    };

    const handleLoadMoreReviews = () => {
        setVisibleReviews(reviews.length);
    };

    const handleReviewInputChange = (e) => {
        const { name, value } = e.target;
        setReviewFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRatingChange = (rating) => {
        setReviewFormData((prev) => ({
            ...prev,
            rating,
        }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewErrorMessage("");
        if (!reviewFormData.name || !reviewFormData.email || !reviewFormData.title || !reviewFormData.review) {
            setReviewErrorMessage("Please fill in all required fields");
            showNotification("Missing information", "Please fill in all required fields");
            return;
        }

        try {
            setReviewLoading(true);
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            // Submit review to API
            await axios.post(
                `https://bookcompass.onrender.com/api/reviews/${id}/reviews`,
                {
                    rating: reviewFormData.rating,
                    title: reviewFormData.title,
                    content: reviewFormData.review,
                    name: reviewFormData.name,
                    email: reviewFormData.email,
                },
                { headers }
            );

            showNotification(
                "Review submitted",
                "Thank you for your feedback! Your review will be published after moderation."
            );

            // Refresh reviews and textbook data
            await fetchReviews();
            await fetchTextbook();
            await postReview();

            setReviewDialogOpen(false);
            setReviewFormData({
                name: "",
                email: "",
                rating: 5,
                title: "",
                review: "",
            });
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to submit review";
            setReviewErrorMessage(msg);
            showNotification("Error submitting review", msg);
        } finally {
            setReviewLoading(false);
        }
    };

    // Sorting for reviews and related books
    const sortedReviews = Array.isArray(reviews) ? [...reviews].sort((a, b) => {
        if (reviewSort === "date") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (reviewSort === "rating") {
            return b.rating - a.rating;
        }
        return 0;
    }) : [];
    const sortedRelatedBooks = [...relatedBooks].sort((a, b) => {
        if (relatedSort === "price") {
            return a.price - b.price;
        } else if (relatedSort === "title") {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    // Simple notification utility (fallback to alert)
    function showNotification(title, description) {
        alert(`${title}\n${description}`);
    }

    return (
        <Layout>
            <div className="container px-4 py-8 md:px-6 md:py-12">
                {/* Back button */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/textbooks">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Textbooks
                        </Link>
                    </Button>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Textbook Cover */}
                    <div className="flex justify-center md:col-span-1">
                        <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg border dark:border-gray-800">
                            <img
                                src={textbook.imageUrl}
                                alt={`${textbook.title} cover`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://dummyimage.com/300x450/cccccc/000000&text=No+Image";
                                }}
                            />
                            {textbook.featured && (
                                <Badge className="absolute right-2 top-2" variant="secondary">
                                    Featured
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Textbook Details */}
                    <div className="md:col-span-1 lg:col-span-2">
                        <div className="space-y-6">
                            {/* Title and actions */}
                            <div>
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{textbook.title}</h1>
                                        <p className="text-xl text-muted-foreground">by {textbook.author}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={isWishlisted ? "default" : "outline"}
                                            size="icon"
                                            onClick={handleToggleWishlist}
                                        >
                                            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={handleShare}>
                                            <Share className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mt-4 flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(textbook.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">
                                        {textbook.averageRating.toFixed(1)} ({textbook.numReviews} reviews)
                                    </span>
                                </div>

                                {/* Categories */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge variant="secondary">{textbook.category}</Badge>
                                </div>
                            </div>

                            <Separator />

                            {/* Price and actions */}
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold">${textbook.price.toFixed(2)}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {textbook.stock > 0 ? (
                                            <span className="text-green-600">In Stock ({textbook.stock} available)</span>
                                        ) : (
                                            <span className="text-red-600">Out of Stock</span>
                                        )}
                                    </span>
                                </div>

                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                    <Button
                                        className="w-full sm:w-auto"
                                        onClick={handleAddToCart}
                                        disabled={textbook.stock <= 0}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={handleBuyNow}
                                        disabled={textbook.stock <= 0}
                                    >
                                        Buy Now
                                    </Button>
                                </div>

                                {/* Bookstore details */}
                                <div className="rounded-lg border p-4">
                                    <h3 className="font-semibold">{textbook.shopName}</h3>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <span>{textbook.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="mr-2 h-4 w-4" />
                                            <a href={`tel:${textbook.contact.replace(/[^0-9]/g, "")}`} className="hover:underline">
                                                {textbook.contact}
                                            </a>
                                        </div>
                                        <div className="flex items-center">
                                            <Globe className="mr-2 h-4 w-4" />
                                            <a
                                                href={textbook.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {textbook.website.replace(/^https?:\/\//, "")}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="description" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="mt-4 space-y-4">
                                    <p className="text-muted-foreground">{textbook.description}</p>
                                </TabsContent>
                                <TabsContent value="details" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium">Publisher</p>
                                            <p className="text-muted-foreground">{textbook.publisher}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Publication Year</p>
                                            <p className="text-muted-foreground">{textbook.year}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">ISBN</p>
                                            <p className="text-muted-foreground">{textbook.isbn}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Pages</p>
                                            <p className="text-muted-foreground">{textbook.pages}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Language</p>
                                            <p className="text-muted-foreground">{textbook.language}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Dimensions</p>
                                            <p className="text-muted-foreground">{textbook.dimensions}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="reviews" className="mt-4">
                                    <div className="flex justify-end mb-2">
                                        <select value={reviewSort} onChange={e => setReviewSort(e.target.value)} className="border rounded px-2 py-1 text-sm">
                                            <option value="date">Sort by Date</option>
                                            <option value="rating">Sort by Rating</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        {reviewLoading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : reviewError ? (
                                            <p className="text-red-500">{reviewError}</p>
                                        ) : sortedReviews.length > 0 ? (
                                            <>
                                                {sortedReviews.slice(0, visibleReviews).map((review, index) => (
                                                    <div key={index} className="rounded-lg border p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center space-x-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <h3 className="mt-2 font-semibold">{review.title || "No title"}</h3>
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    By {review.name || "Anonymous"} • {new Date(review.createdAt || new Date()).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="mt-4 text-sm text-muted-foreground">
                                                            {review.content || "No review content"}
                                                        </p>
                                                    </div>
                                                ))}
                                                {visibleReviews < sortedReviews.length && (
                                                    <Button variant="outline" onClick={handleLoadMoreReviews}>
                                                        Load More Reviews
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground">No reviews yet. Be the first to review this textbook!</p>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Related Textbooks Section */}
                {relatedBooks.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
                            <select value={relatedSort} onChange={e => setRelatedSort(e.target.value)} className="border rounded px-2 py-1 text-sm">
                                <option value="price">Sort by Price</option>
                                <option value="title">Sort by Title</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {sortedRelatedBooks.map((book) => (
                                <Link
                                    key={book.id}
                                    to={`/textbooks/${book.id}`}
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                                >
                                    <div className="aspect-[2/3] w-full overflow-hidden">
                                        <img
                                            src={book.imageUrl}
                                            alt={`${book.title} cover`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = "https://dummyimage.com/300x450/cccccc/000000&text=No+Image";
                                            }}
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="line-clamp-1 font-semibold">{book.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                                        <p className="mt-1 font-medium">${book.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Write Review Section */}
                <div className="mt-16">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
                        <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                            Write a Review
                        </Button>
                    </div>
                </div>

                {/* Write Review Dialog */}
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                                Share your thoughts about "{textbook.title}" by {textbook.author}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            {reviewErrorMessage && (
                                <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                                    {reviewErrorMessage}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={reviewFormData.name}
                                    onChange={handleReviewInputChange}
                                    placeholder="John Doe"
                                    required
                                    disabled={reviewErrorMessage === "You have already reviewed this book"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={reviewFormData.email}
                                    onChange={handleReviewInputChange}
                                    placeholder="john.doe@example.com"
                                    required
                                    disabled={reviewErrorMessage === "You have already reviewed this book"}
                                />
                                <p className="text-xs text-muted-foreground">Your email will not be published</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Rating</Label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => handleRatingChange(rating)}
                                            className="focus:outline-none"
                                            disabled={reviewErrorMessage === "You have already reviewed this book"}
                                        >
                                            <Star
                                                className={`h-6 w-6 ${rating <= reviewFormData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Review Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={reviewFormData.title}
                                    onChange={handleReviewInputChange}
                                    placeholder="Summarize your thoughts"
                                    required
                                    disabled={reviewErrorMessage === "You have already reviewed this book"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="review">Your Review</Label>
                                <Textarea
                                    id="review"
                                    name="review"
                                    value={reviewFormData.review}
                                    onChange={handleReviewInputChange}
                                    placeholder="What did you like or dislike about this textbook?"
                                    rows={5}
                                    required
                                    disabled={reviewErrorMessage === "You have already reviewed this book"}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setReviewDialogOpen(false)}
                                    disabled={reviewLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={reviewLoading || reviewErrorMessage === "You have already reviewed this book"}
                                >
                                    {reviewLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting...
                                        </div>
                                    ) : reviewErrorMessage === "You have already reviewed this book" ? "Already Reviewed" : "Submit Review"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}