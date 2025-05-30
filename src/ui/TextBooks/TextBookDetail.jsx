
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
    const [selectedFormat, setSelectedFormat] = useState("hardcover");

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
                headers.Authorization = `Bearer ${token} `;
            }

            const response = await axios.get(
                `https://bookcompass.onrender.com/api/books/singleBook/${id}`,
                { headers }
            );

            const data = response.data;
            console.log("API Response:", data);

            if (!data || typeof data !== "object") {
                throw new Error("Unexpected response format: No book data returned");
            }

            // Map API response to UI structure
            const formattedTextbook = {
                id: data._id || id,
                title: data.title || "Unknown Title",
                author: data.author || "Unknown Author",
                price: typeof data.format === "object" ? Math.min(...Object.values(data.format)) : data.price || 0,
                image: data.imageUrl || "https://via.placeholder.com/128x192?text=No+Image",
                description: data.description || "No description available.",
                category: data.category || "General",
                format: typeof data.format === "object" ? data.format : { [data.format?.toLowerCase() || "hardcover"]: data.price || 29.99 },
                year: data.year || new Date().getFullYear(),
                shopName: data.shop?.name || "Unknown Bookstore",
                length: data.length || "Nearby", // Fallback
                location: data.shop?.location?.address || "Unknown Location",
                map: data.shop?.location?.coordinates
                    ? `https://maps.google.com/maps?q=${data.shop.location.coordinates[1]},${data.shop.location.coordinates[0]}&z=13&ie=UTF8&iwloc=&output=embed`
                    : "",
                contact: data.shop?.contact?.phoneNumber || "No phone number",
                website: data.shop?.website || "https://www.example.com",
                pages: data.pages || 300,
                language: data.language || "English",
                publisher: data.publisher || "Unknown Publisher",
                isbn: data.isbn || "N/A",
                dimensions: data.dimensions || "Unknown",
                rating: data.rating || 0,
                reviewCount: data.numReviews || 0,
                featured: data.featured || false,
                relatedBooks: data.relatedBooksIds || [],
                reviews: data.reviews || [], // API may not provide reviews
                stock: data.stock !== undefined ? data.stock : true,
            };

            setTextbook(formattedTextbook);

            // Fetch related books if not provided
            if (!data.relatedBooksIds?.length) {
                const relatedResponse = await axios.get(
                    "https://bookcompass.onrender.com/api/books/getPhysicalBooks",
                    { headers }
                );
                const allBooks = relatedResponse.data || [];
                const filteredRelated = allBooks
                    .filter(book => book._id !== id && book.category === data.category)
                    .slice(0, 5)
                    .map(book => ({
                        id: book._id,
                        title: book.title,
                        author: book.author,
                        image: book.imageUrl || "https://via.placeholder.com/128x192?text=No+Image",
                        format: typeof book.format === "object" ? book.format : { hardcover: book.price || 29.99 },
                    }));
                setRelatedBooks(filteredRelated);
            } else {
                // Map relatedBooksIds to book objects
                const relatedBooksData = await Promise.all(
                    data.relatedBooksIds.map(async (relatedId) => {
                        try {
                            const relatedResponse = await axios.get(
                                `https://bookcompass.onrender.com/api/books/singleBook/${relatedId}`,
                                { headers }
                            );
                            return {
                                id: relatedResponse.data._id,
                                title: relatedResponse.data.title,
                                author: relatedResponse.data.author,
                                image: relatedResponse.data.imageUrl || "https://via.placeholder.com/128x192?text=No+Image",
                                format: typeof relatedResponse.data.format === "object"
                                    ? relatedResponse.data.format
                                    : { hardcover: relatedResponse.data.price || 29.99 },
                            };
                        } catch {
                            return null;
                        }
                    })
                );
                setRelatedBooks(relatedBooksData.filter(Boolean));
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to load textbook details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTextbook();
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
                    <p className="mt-2 text-muted-foreground">{error || "The textbook you're looking for doesn't exist or has been removed."}</p>
                    <Button asChild className="mt-6">
                        <Link to="/textbooks">Back to Textbooks</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    const showNotification = (title, description, type = "info") => {
        alert(`${title}\n${description}`);
        console.log(`[${type.toUpperCase()}] ${title}: ${description}`);
    };

    const handleAddToCart = () => {
        showNotification("Added to cart", `${textbook.title} - $${textbook.format[selectedFormat].toFixed(2)} (${selectedFormat})`);
    };

    const handleBuyNow = () => {
        showNotification("Proceeding to checkout", `Purchasing ${textbook.title} (${selectedFormat})`);
    };

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        showNotification(
            isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            textbook.title
        );
    };

    const handleShare = () => {
        showNotification("Share link copied", "Textbook link has been copied to clipboard");
    };

    const handleLoadMoreReviews = () => {
        setVisibleReviews(textbook.reviews.length);
        showNotification("All reviews loaded", "Showing all reviews for this textbook");
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

        if (!reviewFormData.name || !reviewFormData.email || !reviewFormData.title || !reviewFormData.review) {
            showNotification("Missing information", "Please fill in all required fields", "error");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            // Placeholder for review submission API
            // await axios.post(
            //     `https://bookcompass.onrender.com/api/reviews`,
            //     {
            //         bookId: id,
            //         name: reviewFormData.name,
            //         email: reviewFormData.email,
            //         rating: reviewFormData.rating,
            //         title: reviewFormData.title,
            //         content: reviewFormData.review,
            //     },
            //     { headers }
            // );

            showNotification(
                "Review submitted",
                "Thank you for your feedback! Your review will be published after moderation."
            );

            setReviewDialogOpen(false);
            setReviewFormData({
                name: "",
                email: "",
                rating: 5,
                title: "",
                review: "",
            });
        } catch (err) {
            showNotification("Error submitting review", err.message || "Failed to submit review", "error");
        }
    };

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
                                src={textbook.image}
                                alt={`${textbook.title} cover`}
                                className="w-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/128x192?text=No+Image";
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
                                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleShare}
                                            aria-label="Share textbook"
                                        >
                                            <Share className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mt-4 flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(textbook.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            aria-hidden="true"
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">
                                        {textbook.rating} ({textbook.reviewCount} reviews)
                                    </span>
                                </div>

                                {/* Categories */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Link to={`/textbooks?category=${encodeURIComponent(textbook.category)}`}>
                                        <Badge variant="secondary">{textbook.category}</Badge>
                                    </Link>
                                </div>
                            </div>

                            <Separator />

                            {/* Format selection */}
                            <div className="space-y-2">
                                <Label>Select Format</Label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(textbook.format).map(format => (
                                        <Button
                                            key={format}
                                            variant={selectedFormat === format ? "default" : "outline"}
                                            onClick={() => setSelectedFormat(format)}
                                            aria-label={`Select ${format} format`}
                                        >
                                            {format.charAt(0).toUpperCase() + format.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Price and actions */}
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold">${textbook.format[selectedFormat].toFixed(2)}</span>
                                    <span className="text-sm text-muted-foreground">
                                        Available at {textbook.shopName}
                                        {textbook.stock !== undefined && (
                                            <span className={`ml-2 ${textbook.stock ? "text-green-600" : "text-red-600"}`}>
                                                {textbook.stock ? "(In Stock)" : "(Out of Stock)"}
                                            </span>
                                        )}
                                    </span>
                                </div>

                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                    <Button
                                        className="w-full sm:w-auto"
                                        onClick={handleAddToCart}
                                        disabled={!textbook.stock}
                                        aria-label="Add to cart"
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={handleBuyNow}
                                        disabled={!textbook.stock}
                                        aria-label="Buy now"
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
                                            <span>{textbook.location} ({textbook.length})</span>
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
                                    <div className="space-y-4">
                                        {textbook.reviews.length ? (
                                            textbook.reviews.slice(0, visibleReviews).map((review) => (
                                                <div key={review.id} className="rounded-lg border p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center space-x-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                                        aria-hidden="true"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <h3 className="mt-2 font-semibold">{review.title}</h3>
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                By <span className="font-medium">{review.name}</span> on {review.date}
                                                            </p>
                                                        </div>
                                                        {review.verified && <Badge variant="outline">Verified Purchase</Badge>}
                                                    </div>
                                                    <p className="mt-4 text-sm text-muted-foreground">{review.content}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">No reviews yet. Be the first to review this textbook!</p>
                                        )}
                                        {visibleReviews < textbook.reviews.length && (
                                            <Button variant="outline" onClick={handleLoadMoreReviews} aria-label="Load more reviews">
                                                Load More Reviews
                                            </Button>
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
                        <h2 className="mb-6 text-2xl font-bold tracking-tight">You May Also Like</h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {relatedBooks.map((relatedTextbook) => (
                                <Link
                                    key={relatedTextbook.id}
                                    to={`/textbooks/${relatedTextbook.id}`}
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                                    aria-label={`View ${relatedTextbook.title}`}
                                >
                                    <div className="aspect-[2/3] w-full overflow-hidden">
                                        {/* <img
                                            src={relatedTextbook.image}
                                            alt={`${relatedTextbook.title} cover`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/128x192?text=No+Image";
                                            }}
                                        /> */}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="line-clamp-1 font-semibold">{relatedTextbook.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{relatedTextbook.author}</p>
                                        <p className="mt-1 font-medium">${relatedTextbook.format.hardcover?.toFixed(2) || "29.99"}</p>
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
                        <Button
                            variant="outline"
                            onClick={() => setReviewDialogOpen(true)}
                            aria-label="Write a review"
                        >
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
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={reviewFormData.name}
                                    onChange={handleReviewInputChange}
                                    placeholder="John Doe"
                                    required
                                    aria-required="true"
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
                                    aria-required="true"
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
                                            aria-label={`Rate ${rating} stars`}
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
                                    aria-required="true"
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
                                    aria-required="true"
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setReviewDialogOpen(false)}
                                    aria-label="Cancel review"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" aria-label="Submit review">
                                    Submit Review
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}