import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Heart, Share, Star, BookOpen, MapPin, Phone, Globe } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import Layout from "@/Layout"

export default function TextBookDetail() {
    const textbooks = [
        {
            id: 1,
            title: "Harriet Tubman: Live in Concert",
            author: "Bob the Drag Queen",
            price: 29.03,
            image: "https://i.pinimg.com/736x/79/f3/1d/79f31d18f1620f68409ca3a2556557ab.jpg",
            description: "The first from TV host and RuPaul's Drag Race winner Bob The Drag Queen vibes with energy and humor but never wavers in its focus on the resilience and power of Black Americans, 'made out of something stronger than steel and diamonds combined,' and the universal passion for liberation.",
            category: "Biography & Memory",
            format: {
                hardcover: 29.03,
                paperback: 29.03,
                ebook: 39.03,
            },
            year: 2023,
            shopName: "City Books",
            length: "1.2 miles away",
            location: "123 Main St, Downtown",
            map: "",
            contact: "123-456-7890",
            website: "https://www.citybooks.com",
            pages: 432,
            language: "English",
            publisher: "City Books Publishing",
            isbn: "978-3-16-148410-0",
            dimensions: "8.5 x 11 inches",
            rating: 4.5,
            reviewCount: 24,
            featured: true,
            relatedBooks: [2, 3],
            reviews: [
                {
                    id: 1,
                    name: "Michael R.",
                    date: "May 15, 2023",
                    rating: 5,
                    title: "Engaging and thought-provoking",
                    content: "This book exceeded my expectations. The author does an excellent job of exploring complex themes while keeping the narrative engaging.",
                    verified: true,
                },
                {
                    id: 2,
                    name: "Sarah T.",
                    date: "April 28, 2023",
                    rating: 4,
                    title: "Great read with minor issues",
                    content: "I really enjoyed the content of this book. The ideas presented were fascinating and well-researched.",
                    verified: true,
                },
            ]
        },
        {
            id: 2,
            title: "The Instability of Truth",
            author: "Rebecca Lemov",
            price: 30.68,
            image: "https://i.pinimg.com/736x/70/b3/c8/70b3c8cb130c3f7638b8df28dba6c950.jpg",
            description: "Provocative and illuminating... Lemov's deeply researched exploration reveals how the persuasive power wielded by charismatic figures can answer, in a warped way, a person's yearning for self-reinvention and meaning... Publishers Weekly, starred review.",
            category: "History",
            format: {
                hardcover: 39.03,
                paperback: 29.03,
                ebook: 9.03,
            },
            year: 2022,
            shopName: "Book Haven",
            length: "5.8 miles away",
            location: "456 Park Ave, Westside",
            contact: "123-456-7890",
            website: "https://www.bookhaven.com",
            pages: 350,
            language: "English",
            publisher: "History Press",
            isbn: "978-3-16-148411-0",
            dimensions: "6 x 9 inches",
            rating: 4.2,
            reviewCount: 18,
            relatedBooks: [1, 3],
            reviews: [
                {
                    id: 1,
                    name: "Thomas H.",
                    date: "February 18, 2023",
                    rating: 4,
                    title: "A fresh take on history",
                    content: "Rebecca Lemov has created a compelling narrative that seamlessly blends historical facts with philosophical questions.",
                    verified: true,
                }
            ]
        },
        {
            id: 3,
            title: "Modern Physics for Beginners",
            author: "Dr. Alan Stern",
            price: 45.99,
            image: "https://m.media-amazon.com/images/I/71QY6X2R5VL._AC_UF1000,1000_QL80_.jpg",
            description: "A comprehensive introduction to modern physics concepts for beginners, covering quantum mechanics, relativity, and cosmology in an accessible way.",
            category: "Science",
            format: {
                hardcover: 45.99,
                paperback: 35.99,
                ebook: 19.99,
            },
            year: 2023,
            shopName: "Science Books Co.",
            length: "3.5 miles away",
            location: "789 Science Blvd, Tech District",
            contact: "123-456-7890",
            website: "https://www.sciencebooks.com",
            pages: 512,
            language: "English",
            publisher: "Science Press",
            isbn: "978-3-16-148412-0",
            dimensions: "7 x 10 inches",
            rating: 4.8,
            reviewCount: 32,
            featured: true,
            relatedBooks: [1, 2],
            reviews: [
                {
                    id: 1,
                    name: "David L.",
                    date: "June 10, 2023",
                    rating: 5,
                    title: "Excellent introduction",
                    content: "As someone new to physics, I found this book to be incredibly well-written and accessible. The concepts are explained clearly with great examples.",
                    verified: true,
                },
                {
                    id: 2,
                    name: "Emma S.",
                    date: "May 22, 2023",
                    rating: 5,
                    title: "Perfect for self-study",
                    content: "I've been using this book for self-study and it's been fantastic. The exercises at the end of each chapter really help reinforce the concepts.",
                    verified: false,
                }
            ]
        }
    ]

    const [isWishlisted, setIsWishlisted] = useState(false)
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [reviewFormData, setReviewFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        title: "",
        review: "",
    })
    const [visibleReviews, setVisibleReviews] = useState(2)
    const [selectedFormat, setSelectedFormat] = useState("hardcover")

    const { id } = useParams()
    const textbookId = parseInt(id)
    const textbook = textbooks.find(book => book.id === textbookId)

    if (!textbook) {
        return <div className="text-center py-12">Textbook not found</div>
    }

    const showNotification = (title, description, type = "info") => {
        alert(`${title}\n${description}`)
        console.log(`[${type.toUpperCase()}] ${title}: ${description}`)
    }

    const handleAddToCart = () => {
        showNotification("Added to cart", `${textbook.title} - $${textbook.format[selectedFormat].toFixed(2)} (${selectedFormat})`)
    }

    const handleBuyNow = () => {
        showNotification("Proceeding to checkout", `Purchasing ${textbook.title} (${selectedFormat})`)
    }

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted)
        showNotification(
            isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            textbook.title
        )
    }

    const handleShare = () => {
        showNotification("Share link copied", "Textbook link has been copied to clipboard")
    }

    const handleLoadMoreReviews = () => {
        setVisibleReviews(textbook.reviews.length)
        showNotification("All reviews loaded", "Showing all reviews for this textbook")
    }

    const handleReviewInputChange = (e) => {
        const { name, value } = e.target
        setReviewFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleRatingChange = (rating) => {
        setReviewFormData((prev) => ({
            ...prev,
            rating,
        }))
    }

    const handleSubmitReview = (e) => {
        e.preventDefault()

        if (!reviewFormData.name || !reviewFormData.email || !reviewFormData.title || !reviewFormData.review) {
            showNotification("Missing information", "Please fill in all required fields", "error")
            return
        }

        showNotification(
            "Review submitted",
            "Thank you for your feedback! Your review will be published after moderation."
        )

        setReviewDialogOpen(false)
        setReviewFormData({
            name: "",
            email: "",
            rating: 5,
            title: "",
            review: "",
        })
    }

    const relatedTextbooks = textbook.relatedBooks.map((id) => textbooks.find(book => book.id === id)).filter(Boolean)

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
                        <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden  dark:border-gray-800">
                            <img
                                src={textbook.image}
                                alt={`${textbook.title} cover`}
                                className="w-full object-cover"
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
                                            <span className="sr-only">Add to wishlist</span>
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={handleShare}>
                                            <Share className="h-4 w-4" />
                                            <span className="sr-only">Share</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mt-4 flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(textbook.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
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
                                    <span className="text-sm text-muted-foreground">Available at {textbook.shopName}</span>
                                </div>

                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                    <Button className="w-full sm:w-auto" onClick={handleAddToCart}>
                                        Add to Cart
                                    </Button>
                                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleBuyNow}>
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
                                            <span>{textbook.contact}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Globe className="mr-2 h-4 w-4" />
                                            <a href={textbook.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                {textbook.website}
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
                                        {textbook.reviews.slice(0, visibleReviews).map((review) => (
                                            <div key={review.id} className="rounded-lg border p-4">
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
                                                        <h3 className="mt-2 font-semibold">{review.title}</h3>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            By <span className="font-medium">{review.name}</span> on {review.date}
                                                        </p>
                                                    </div>
                                                    {review.verified && <Badge variant="outline">Verified Purchase</Badge>}
                                                </div>
                                                <p className="mt-4 text-sm text-muted-foreground">{review.content}</p>
                                            </div>
                                        ))}
                                        {visibleReviews < textbook.reviews.length && (
                                            <Button variant="outline" onClick={handleLoadMoreReviews}>
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
                {relatedTextbooks.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight">You May Also Like</h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {relatedTextbooks.map((relatedTextbook) => (
                                <Link
                                    key={relatedTextbook.id}
                                    to={`/textbooks/${relatedTextbook.id}`}
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                                >
                                    <div className="aspect-[2/3] w-full overflow-hidden">
                                        <img
                                            src={relatedTextbook.image}
                                            alt={`${relatedTextbook.title} cover`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="line-clamp-1 font-semibold">{relatedTextbook.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{relatedTextbook.author}</p>
                                        <p className="mt-1 font-medium">${relatedTextbook.format.hardcover.toFixed(2)}</p>
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
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
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
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={reviewFormData.email}
                                    onChange={handleReviewInputChange}
                                    placeholder="john.doe@example.com"
                                    required
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
                                        >
                                            <Star
                                                className={`h-6 w-6 ${rating <= reviewFormData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
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
            </div>
        </Layout>
    )
}