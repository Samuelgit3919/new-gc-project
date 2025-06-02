"use client";

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Calendar, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";

const ShopDetail = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        comment: "",
    });

    useEffect(() => {
        const fetchStoreDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                };
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(`https://bookcompass.onrender.com/api/bookshop/${id}`, {
                    headers
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Failed to fetch store details (Status: ${response.status})`);
                }

                const data = await response.json();
                console.log("API Response:", data);

                if (!data.data) {
                    throw new Error("Store data not found in response");
                }

                // Format the store data according to the API response structure
                const formattedStore = {
                    id: data.data._id,
                    name: data.data.name || "Unknown Bookstore",
                    tagline: data.data.description || "Your literary destination",
                    description: data.data.description || "A wonderful bookstore with a great collection",
                    image: data.data.images?.background || "https://images.unsplash.com/photo-1589998059171-988d887df646",
                    logo: data.data.images?.logo || "https://images.unsplash.com/photo-1575470888645-5c5e277247b0",
                    address: data.data.location?.address || "Address not specified",
                    coordinates: data.data.location?.coordinates || [],
                    phone: data.data.contact?.phoneNumber || "Not available",
                    email: data.data.contact?.email || "Not available",
                    website: data.data.website || "",
                    rating: data.data.averageRating || 0,
                    numReviews: data.data.numReviews || 0,
                    distance: "Nearby", // You might calculate this based on user location
                    features: data.data.services || [],
                    hours: data.data.operatingHours ? [
                        { day: "Monday", hours: data.data.operatingHours.monday || "Closed" },
                        { day: "Tuesday", hours: data.data.operatingHours.tuesday || "Closed" },
                        { day: "Wednesday", hours: data.data.operatingHours.wednesday || "Closed" },
                        { day: "Thursday", hours: data.data.operatingHours.thursday || "Closed" },
                        { day: "Friday", hours: data.data.operatingHours.friday || "Closed" },
                        { day: "Saturday", hours: data.data.operatingHours.saturday || "Closed" },
                        { day: "Sunday", hours: data.data.operatingHours.sunday || "Closed" }
                    ] : [],
                    inventory: data.data.availableBooks?.map(book => ({
                        id: book._id,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        cover: book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
                        inStock: book.stock > 0,
                        description: book.description,
                        genre: book.genre,
                        pages: book.pages,
                        publisher: book.publisher,
                        isbn: book.isbn,
                        rating: book.averageRating || 0,
                        publishDate: book.publishDate,
                        language: book.language
                    })) || [],
                    events: data.data.upcomingEvents?.map(event => ({
                        id: event._id,
                        title: event.name,
                        date: event.date,
                        time: event.time,
                        description: event.description,
                        featured: event.featured || false,
                        image: event.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    })) || [],
                    paymentOptions: data.data.paymentOptions || [],
                    seller: data.data.seller || {},
                    reviews: data.data.reviews || []
                };

                setStore(formattedStore);
            } catch (err) {
                console.error("Error fetching store details:", err);
                setError(err.message);
                toast.error(err.message || "Failed to load store details");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetails();
    }, [id]);

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
        if (!reviewFormData.name || !reviewFormData.email || !reviewFormData.comment) {
            toast.error("Please fill in all required fields");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to write a review.");
            setReviewDialogOpen(false);
            return;
        }
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await fetch(`https://bookcompass.onrender.com/api/bookshop/${id}/reviews`, {
                method: "POST",
                headers,
                body: JSON.stringify(reviewFormData),
            });
            if (response.status === 403) {
                toast.error("You do not have permission to write a review.");
                setReviewDialogOpen(false);
                const data = await response.json();
                console.log(data)
                return;
            }
            if (!response.ok) throw new Error("Failed to submit review");
            toast.success("Review submitted! Thank you for your feedback.");
            setReviewDialogOpen(false);
            setReviewFormData({
                name: "",
                email: "",
                rating: 5,
                comment: "",
            });
            // Re-fetch reviews
            const reviewsRes = await fetch(`https://bookcompass.onrender.com/api/bookshop/${id}/reviews`);
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setStore(prev => ({ ...prev, reviews: reviewsData.data || [] }));
            }
        } catch (err) {
            toast.error(err.message || "Failed to submit review");
            setReviewDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12">
                    {/* Hero skeleton */}
                    <Skeleton className="w-full h-64 mb-8 rounded-lg" />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main content skeleton */}
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-8 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-2/3 mb-4" />
                            <Skeleton className="h-10 w-1/3 mb-4" />
                            {/* Tabs skeleton */}
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                                ))}
                            </div>
                        </div>
                        {/* Sidebar skeleton */}
                        <div className="space-y-6">
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <Skeleton className="h-48 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-bold">Error loading store</h2>
                    <p className="mt-2 text-gray-600">{error}</p>
                    <Button asChild className="mt-6">
                        <Link to="/shopLists">Back to Bookstores</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    if (!store) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-bold">Store not found</h2>
                    <p className="mt-2 text-gray-600">The bookstore you're looking for doesn't exist or has been removed.</p>
                    <Button asChild className="mt-6">
                        <Link to="/shopLists">Back to Bookstores</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    // Calculate average rating from reviews if available
    const averageRating = store.rating.toFixed(1);

    return (
        <Layout>
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <Link to="/shopLists" className="flex items-center">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Bookstores
                        </Link>
                    </Button>
                </div>

                {/* Hero Section */}
                <div className="relative mb-8 overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1589998059171-988d887df646";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h1 className="text-3xl font-bold md:text-4xl drop-shadow-md">{store?.user?.name}</h1>
                        <p className="mt-2 text-lg text-gray-100 drop-shadow-md">{store.tagline}</p>
                        <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(store.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm">
                                {averageRating} ({store.numReviews} reviews)
                            </span>
                            <span className="ml-4 text-sm flex items-center">
                                <MapPin className="h-4 w-4 mr-1" /> {store.distance}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            {/* About Section */}
                            <section>
                                <h2 className="text-2xl font-bold">About {store.name}</h2>
                                <p className="mt-4 text-muted-foreground">{store.description}</p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {store.features?.map((feature, index) => (
                                        <Badge key={index} variant="secondary" className="px-3 py-1">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </section>

                            {/* Tabs for Inventory, Events, Reviews */}
                            <Tabs defaultValue="inventory" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="inventory">Available Books</TabsTrigger>
                                    <TabsTrigger value="events">Events</TabsTrigger>
                                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                </TabsList>

                                {/* Inventory Tab */}
                                <TabsContent value="inventory" className="mt-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {store.inventory?.map((book) => (
                                            <Card key={book.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex gap-4">
                                                        <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden">
                                                            <img
                                                                src={book.cover}
                                                                alt={book.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f";
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold">{book.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{book.author}</p>
                                                            <div className="mt-2 flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="ml-2 text-xs text-muted-foreground">
                                                                    {book.rating.toFixed(1)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 flex justify-between items-center">
                                                                <span className="font-medium">${book.price?.toFixed(2) || '0.00'}</span>
                                                                <span className={`text-sm ${book.inStock ? "text-green-600" : "text-red-600"}`}>
                                                                    {book.inStock ? "In Stock" : "Out of Stock"}
                                                                </span>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="mt-3 w-full">
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    {!store.inventory?.length && (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">No books available</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Check back later for new arrivals
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Events Tab */}
                                <TabsContent value="events" className="mt-6">
                                    {store.events?.length ? (
                                        <div className="space-y-4">
                                            {store.events.map((event) => (
                                                <Card key={event.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                            {event.image && (
                                                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                                                                    <img
                                                                        src={event.image}
                                                                        alt={event.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                                                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                                                    <Calendar className="mr-2 h-4 w-4" />
                                                                    <span>
                                                                        {event.date} • {event.time}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-2 text-muted-foreground">{event.description}</p>
                                                                {event.featured && (
                                                                    <Badge variant="default" className="mt-2">
                                                                        Featured Event
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Calendar className="h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">No upcoming events</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Check back later for scheduled events
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Reviews Tab */}
                                <TabsContent value="reviews" className="mt-6">
                                    <div className="flex justify-end mb-4">
                                        <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                                            Write a Review
                                        </Button>
                                    </div>
                                    {store.reviews && store.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {store.reviews.map((review) => (
                                                <Card key={review._id}>
                                                    <CardContent className="p-6">
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
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    By <span className="font-medium">{review.user?.name || "Anonymous"}</span> on {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Unknown date"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="mt-4 text-sm text-muted-foreground">{review.comment}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Star className="h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Be the first to review this bookstore
                                            </p>
                                        </div>
                                    )}
                                    <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Write a Review</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Your Name *</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={reviewFormData.name}
                                                        onChange={handleReviewInputChange}
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={reviewFormData.email}
                                                        onChange={handleReviewInputChange}
                                                        placeholder="john.doe@example.com"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Rating *</Label>
                                                    <div className="flex items-center space-x-1">
                                                        {[1, 2, 3, 4, 5].map((rating) => (
                                                            <button
                                                                key={rating}
                                                                type="button"
                                                                onClick={() => handleRatingChange(rating)}
                                                                className="focus:outline-none"
                                                                aria-label={`Rate ${rating} out of 5`}
                                                            >
                                                                <Star
                                                                    className={`h-6 w-6 ${rating <= reviewFormData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="comment">Your Review *</Label>
                                                    <Textarea
                                                        id="comment"
                                                        name="comment"
                                                        value={reviewFormData.comment}
                                                        onChange={handleReviewInputChange}
                                                        placeholder="What did you like or dislike?"
                                                        rows={5}
                                                        required
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">Submit Review</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Store Info Card */}
                        <Card className="top-6">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-full border">
                                        <img
                                            src={store.logo}
                                            alt={`${store.name} logo`}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1575470888645-5c5e277247b0";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{store.name}</h3>
                                        <p className="text-sm text-muted-foreground">{store.distance}</p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-start">
                                        <MapPin className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                                        <span className="break-words">{store.address}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                                        <a href={`tel:${store.phone.replace(/[^0-9]/g, "")}`} className="hover:underline">
                                            {store.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-start">
                                        <Mail className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                                        <a href={`mailto:${store.email}`} className="hover:underline break-all">
                                            {store.email}
                                        </a>
                                    </div>
                                    {store.website && (
                                        <div className="flex items-start">
                                            <Globe className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                                            <a
                                                href={`https://${store.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline break-all"
                                            >
                                                {store.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold mb-3">Hours</h4>
                                    <div className="space-y-2 text-sm">
                                        {store.hours?.map((item) => (
                                            <div key={item.day} className="flex justify-between">
                                                <span className="font-medium">{item.day}</span>
                                                <span>{item.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-2">
                                    <Button variant="outline" asChild>
                                        <a
                                            href={`https://www.google.com/maps?q=${store.coordinates[1]},${store.coordinates[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Directions
                                        </a>
                                    </Button>
                                    <Button asChild>
                                        <a
                                            href={`tel:${store.phone.replace(/[^0-9]/g, "")}`}
                                            className="flex items-center justify-center"
                                        >
                                            <Phone className="mr-2 h-4 w-4" />
                                            Call
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact {store.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Your Name
                                        </label>
                                        <Input id="name" name="name" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email Address
                                        </label>
                                        <Input id="email" name="email" type="email" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">
                                            Message
                                        </label>
                                        <Textarea id="message" name="message" rows={4} required />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ShopDetail;