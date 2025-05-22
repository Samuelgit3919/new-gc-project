import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Download, Heart, Share, Star, FileText, Laptop, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import Layout from "../../Layout"

export default function EbookDetail() {
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
    const [ebook, setEbook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [relatedEbooks, setRelatedEbooks] = useState([])

    const { id } = useParams()

    useEffect(() => {
        const fetchEbookData = async () => {
            try {
                setLoading(true)
                // Fetch the main ebook data
                const response = await fetch(`https://bookcompass.onrender.com/api/books/singleBook/${id}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch ebook: ${response.status}`)
                }

                const data = await response.json()
                if (!data) {
                    throw new Error("Ebook data is empty")
                }
                setEbook(data)

                // If there are related books, fetch their data
                if (data.relatedBooks && data.relatedBooks.length > 0) {
                    const relatedPromises = data.relatedBooks.map(bookId =>
                        fetch(`https://bookcompass.onrender.com/api/books/singleBook/${bookId}`)
                            .then(res => {
                                if (!res.ok) return null
                                return res.json()
                            })
                            .catch(() => null)
                    )

                    const relatedResults = await Promise.all(relatedPromises)
                    setRelatedEbooks(relatedResults.filter(book => book !== null))
                }

            } catch (err) {
                setError(err.message)
                console.error("Error fetching ebook data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchEbookData()
    }, [id])

    const showNotification = (title, description, type = "info") => {
        if (typeof window !== "undefined") {
            alert(`${title}\n${description}`)
        }
        console.log(`[${type.toUpperCase()}] ${title}: ${description}`)
    }

    const handleAddToCart = () => {
        if (!ebook) return
        showNotification("Added to cart", `${ebook.title} - $${(ebook.price || 0).toFixed(2)}`)
    }

    const handleBuyNow = () => {
        if (!ebook) return
        showNotification("Proceeding to checkout", `Purchasing ${ebook.title}`)
    }

    const handleToggleWishlist = () => {
        if (!ebook) return
        setIsWishlisted(!isWishlisted)
        showNotification(
            isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            ebook.title
        )
    }

    const handleShare = () => {
        if (!ebook) return
        if (navigator.share) {
            navigator.share({
                title: ebook.title,
                text: `Check out this ebook: ${ebook.title} by ${ebook.author}`,
                url: window.location.href,
            }).catch(err => {
                console.error('Error sharing:', err)
                copyToClipboard()
            })
        } else {
            copyToClipboard()
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification("Link copied", "E-book link has been copied to clipboard"))
            .catch(err => {
                console.error('Failed to copy:', err)
                showNotification("Error", "Failed to copy link to clipboard", "error")
            })
    }

    const handleDownloadSample = () => {
        if (!ebook) return
        showNotification("Sample downloaded", `Sample of ${ebook.title} is being downloaded`)
    }

    const handleLoadMoreReviews = () => {
        if (!ebook?.reviews) return
        setVisibleReviews(ebook.reviews.length)
        showNotification("All reviews loaded", "Showing all reviews for this e-book")
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

    const handleSubmitReview = async (e) => {
        e.preventDefault()

        if (!reviewFormData.name || !reviewFormData.email || !reviewFormData.title || !reviewFormData.review) {
            showNotification("Missing information", "Please fill in all required fields", "error")
            return
        }

        try {
            const response = await fetch(`https://bookcompass.onrender.com/api/books/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewFormData),
            })

            if (!response.ok) {
                throw new Error(`Failed to submit review: ${response.status}`)
            }

            showNotification(
                "Review submitted",
                "Thank you for your feedback! Your review will be published after moderation."
            )

            // Refresh the ebook data
            const updatedResponse = await fetch(`https://bookcompass.onrender.com/api/books/singleBook/${id}`)
            if (!updatedResponse.ok) {
                throw new Error('Failed to fetch updated ebook data')
            }
            const updatedData = await updatedResponse.json()
            setEbook(updatedData)

            setReviewDialogOpen(false)
            setReviewFormData({
                name: "",
                email: "",
                rating: 5,
                title: "",
                review: "",
            })
        } catch (err) {
            console.error('Error submitting review:', err)
            showNotification("Error", "Failed to submit review. Please try again later.", "error")
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-64 bg-gray-200 rounded w-full max-w-md mx-auto"></div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading E-book</h2>
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button asChild variant="outline">
                            <Link to="/EBook">Back to E-Books</Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!ebook) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                        <h2 className="text-xl font-bold text-yellow-600 mb-2">E-book Not Found</h2>
                        <p className="text-yellow-700 mb-4">The requested e-book could not be found.</p>
                        <Button asChild variant="outline">
                            <Link to="/EBook">Browse Available E-Books</Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container px-4 py-8 md:px-6 md:py-12">
                {/* Back button */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/EBook">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to E-Books
                        </Link>
                    </Button>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* E-Book Cover */}
                    <div className="flex justify-center md:col-span-1">
                        <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                            <img
                                src={ebook.cover || "/placeholder-cover.jpg"}
                                alt={`${ebook.title} cover`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/placeholder-cover.jpg"
                                }}
                            />
                            {ebook.featured && (
                                <Badge className="absolute right-2 top-2" variant="secondary">
                                    Featured
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* E-Book Details */}
                    <div className="md:col-span-1 lg:col-span-2">
                        <div className="space-y-6">
                            {/* Title and actions */}
                            <div>
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{ebook.title}</h1>
                                        <p className="text-xl text-muted-foreground">by {ebook.author || "Unknown Author"}</p>
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
                                            className={`h-5 w-5 ${i < Math.floor(ebook.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">
                                        {(ebook.rating || 0).toFixed(1)} ({ebook.reviewCount || 0} reviews)
                                    </span>
                                </div>

                                {/* Categories */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {ebook.categories?.map((category) => (
                                        <Link to={`/ebooks?category=${encodeURIComponent(category)}`} key={category}>
                                            <Badge variant="secondary">{category}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Price and actions */}
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold">${(ebook.price || 0).toFixed(2)}</span>
                                    <span className="text-sm text-muted-foreground">Digital download • Instant delivery</span>
                                </div>

                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                    <Button className="w-full sm:w-auto" onClick={handleAddToCart}>
                                        Add to Cart
                                    </Button>
                                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleBuyNow}>
                                        Buy Now
                                    </Button>
                                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownloadSample}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Sample
                                    </Button>
                                </div>

                                {/* Format details */}
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <FileText className="mr-1 h-4 w-4" />
                                        <span>{(ebook.formats || []).join(", ") || "Multiple formats"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Laptop className="mr-1 h-4 w-4" />
                                        <span>{ebook.fileSize || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Smartphone className="mr-1 h-4 w-4" />
                                        <span>{ebook.pages || 0} pages</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="description" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="devices">Compatible Devices</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="mt-4 space-y-4">
                                    <p className="text-muted-foreground">{ebook.description || "No description available."}</p>
                                </TabsContent>
                                <TabsContent value="details" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium">Publisher</p>
                                            <p className="text-muted-foreground">{ebook.publisher || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Publication Date</p>
                                            <p className="text-muted-foreground">{ebook.publishDate || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">ISBN</p>
                                            <p className="text-muted-foreground">{ebook.isbn || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Pages</p>
                                            <p className="text-muted-foreground">{ebook.pages || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Language</p>
                                            <p className="text-muted-foreground">{ebook.language || "English"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">File Size</p>
                                            <p className="text-muted-foreground">{ebook.fileSize || "N/A"}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="devices" className="mt-4">
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            This e-book is compatible with the following devices and applications:
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                            {(ebook.devices || ["Kindle", "Tablet", "Smartphone", "Computer"]).map((device) => (
                                                <div
                                                    key={device}
                                                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800"
                                                >
                                                    {device.toLowerCase().includes("kindle") ? (
                                                        <Tablet className="h-8 w-8 text-primary" />
                                                    ) : device.toLowerCase().includes("nook") ? (
                                                        <Tablet className="h-8 w-8 text-primary" />
                                                    ) : device.toLowerCase().includes("ipad") ? (
                                                        <Tablet className="h-8 w-8 text-primary" />
                                                    ) : device.toLowerCase().includes("android") ? (
                                                        <Smartphone className="h-8 w-8 text-primary" />
                                                    ) : (
                                                        <Laptop className="h-8 w-8 text-primary" />
                                                    )}
                                                    <p className="mt-2 text-sm font-medium">{device}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Related E-Books Section */}
                {relatedEbooks.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight">You May Also Like</h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {relatedEbooks.map((relatedEbook) => (
                                <Link
                                    key={relatedEbook.id}
                                    to={`/ebooks/${relatedEbook.id}`}
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                                >
                                    <div className="aspect-[2/3] w-full overflow-hidden">
                                        <img
                                            src={relatedEbook.cover || "/placeholder-cover.jpg"}
                                            alt={`${relatedEbook.title} cover`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = "/placeholder-cover.jpg"
                                            }}
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="line-clamp-1 font-semibold">{relatedEbook.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{relatedEbook.author || "Unknown Author"}</p>
                                        <p className="mt-1 font-medium">${(relatedEbook.price || 0).toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="mt-16">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
                        <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                            Write a Review
                        </Button>
                    </div>

                    <div className="mt-6 space-y-6">
                        {ebook.reviews?.length > 0 ? (
                            <>
                                {ebook.reviews.slice(0, visibleReviews).map((review) => (
                                    <div key={review.id} className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
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

                                {visibleReviews < ebook.reviews.length && (
                                    <div className="flex justify-center">
                                        <Button variant="outline" onClick={handleLoadMoreReviews}>
                                            Load More Reviews ({ebook.reviews.length - visibleReviews} remaining)
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-800">
                                <p className="text-muted-foreground">No reviews yet. Be the first to review this e-book!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Write Review Dialog */}
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                                Share your thoughts about "{ebook.title}" by {ebook.author}
                            </DialogDescription>
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
                                <p className="text-xs text-muted-foreground">Your email will not be published</p>
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
                                                className={`h-6 w-6 ${rating <= reviewFormData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Review Title *</Label>
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
                                <Label htmlFor="review">Your Review *</Label>
                                <Textarea
                                    id="review"
                                    name="review"
                                    value={reviewFormData.review}
                                    onChange={handleReviewInputChange}
                                    placeholder="What did you like or dislike? What did you use this product for?"
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