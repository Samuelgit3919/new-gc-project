
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
// import Image from "next/image"
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
    const ebooksData = [
        {
            id: 101,
            title: "Digital Horizons",
            author: "Alex Morgan",
            publisher: "TechPress Publishing",
            publishDate: "March 15, 2023",
            isbn: "978-1234567890",
            pages: 342,
            fileSize: "2.4 MB",
            language: "English",
            description:
                "In a world dominated by artificial intelligence and virtual reality, one programmer discovers a hidden code that could change the nature of digital consciousness forever. Digital Horizons explores the ethical implications of AI development and the blurred lines between human and machine intelligence in a not-so-distant future.",
            price: 9.99,
            rating: 4.6,
            reviewCount: 87,
            cover: "https://picsum.photos/seed/ebook1/600/900",
            categories: ["Science Fiction", "Technology", "Thriller"],
            formats: ["EPUB", "PDF", "MOBI"],
            devices: ["Kindle", "Nook", "iPad", "Android", "Desktop"],
            featured: true,
            relatedBooks: [102, 103, 105],
            reviews: [
                {
                    id: 1,
                    name: "Michael R.",
                    date: "May 15, 2023",
                    rating: 5,
                    title: "Engaging and thought-provoking",
                    content:
                        "This book exceeded my expectations. The author does an excellent job of exploring complex themes while keeping the narrative engaging. I couldn't put it down and finished it in two days. Highly recommend to anyone interested in this genre.",
                    verified: true,
                },
                {
                    id: 2,
                    name: "Sarah T.",
                    date: "April 28, 2023",
                    rating: 4,
                    title: "Great read with minor formatting issues",
                    content:
                        "I really enjoyed the content of this e-book. The ideas presented were fascinating and well-researched. However, I did notice some formatting issues on my Kindle, particularly with tables and diagrams. Despite this, I would still recommend it for the quality of the content.",
                    verified: true,
                },
                {
                    id: 3,
                    name: "David L.",
                    date: "April 10, 2023",
                    rating: 5,
                    title: "A masterpiece of digital fiction",
                    content:
                        "Alex Morgan has created a world that feels both familiar and alien at the same time. The characters are well-developed, and the plot keeps you guessing until the very end. I particularly enjoyed the ethical dilemmas presented throughout the story. Can't wait for the sequel!",
                    verified: true,
                },
                {
                    id: 4,
                    name: "Jennifer K.",
                    date: "March 22, 2023",
                    rating: 3,
                    title: "Interesting concept but slow pacing",
                    content:
                        "The premise of this book is fascinating, and the author clearly knows their subject matter. However, I found the middle section to drag a bit, and some of the technical explanations were too detailed for my taste. Still, the ending was satisfying and made up for the slower parts.",
                    verified: false,
                },
                {
                    id: 5,
                    name: "Robert M.",
                    date: "March 5, 2023",
                    rating: 5,
                    title: "Couldn't put it down!",
                    content:
                        "I read this entire book in one sitting. The world-building is exceptional, and the characters feel like real people with complex motivations. The ethical questions raised about AI consciousness will stay with me for a long time. Highly recommended for any sci-fi fan.",
                    verified: true,
                },
            ],
        },
        {
            id: 102,
            title: "The Virtual Detective",
            author: "Samantha Lee",
            publisher: "Mystery Digital",
            publishDate: "January 5, 2023",
            isbn: "978-0987654321",
            pages: 286,
            fileSize: "1.8 MB",
            language: "English",
            description:
                "When a high-profile tech CEO is found dead in a locked virtual reality room, Detective Maya Chen must navigate both the real and digital worlds to solve the case. As she delves deeper, she discovers a conspiracy that spans multiple realities and threatens to upend the entire VR industry.",
            price: 7.99,
            rating: 4.3,
            reviewCount: 62,
            cover: "https://picsum.photos/seed/ebook2/600/900",
            categories: ["Mystery", "Technology", "Thriller"],
            formats: ["EPUB", "PDF"],
            devices: ["Kindle", "iPad", "Android", "Desktop"],
            featured: false,
            relatedBooks: [101, 105, 106],
            reviews: [
                {
                    id: 1,
                    name: "Thomas H.",
                    date: "February 18, 2023",
                    rating: 4,
                    title: "A fresh take on detective fiction",
                    content:
                        "Samantha Lee has created a compelling mystery that seamlessly blends traditional detective work with cutting-edge technology. Detective Chen is a fantastic protagonist - smart, flawed, and determined. The virtual reality scenes are particularly well-written and immersive.",
                    verified: true,
                },
                {
                    id: 2,
                    name: "Lisa R.",
                    date: "January 30, 2023",
                    rating: 5,
                    title: "Couldn't guess the ending!",
                    content:
                        "As an avid mystery reader, I pride myself on figuring out whodunit before the reveal. This book completely surprised me! The plot twists were unexpected but made perfect sense in retrospect. The virtual reality setting adds a fresh dimension to the mystery genre.",
                    verified: true,
                },
                {
                    id: 3,
                    name: "Mark S.",
                    date: "January 15, 2023",
                    rating: 3,
                    title: "Good but needed more development",
                    content:
                        "The concept is innovative and the mystery is intriguing, but I felt some of the supporting characters needed more development. The technology aspects were well-researched and believable. Overall a good read, but it could have been great with a bit more depth.",
                    verified: false,
                },
            ],
        },
        {
            id: 103,
            title: "Coding Dreams",
            author: "Jason Wright",
            publisher: "Mystery Digital",
            publishDate: "January 5, 2023",
            isbn: "978-0987654321",
            pages: 286,
            fileSize: "1.8 MB",
            language: "English",
            description:
                "When a high-profile tech CEO is found dead in a locked virtual reality room, Detective Maya Chen must navigate both the real and digital worlds to solve the case. As she delves deeper, she discovers a conspiracy that spans multiple realities and threatens to upend the entire VR industry.",
            price: 12.99,
            rating: 4.3,
            reviewCount: 62,
            cover: "https://picsum.photos/seed/ebook3/450/600",
            categories: ["Mystery", "Technology", "Thriller"],
            formats: ["EPUB", "PDF"],
            devices: ["Kindle", "iPad", "Android", "Desktop"],
            featured: false,
            relatedBooks: [101, 105, 106],
            reviews: [
                {
                    id: 1,
                    name: "Thomas H.",
                    date: "February 18, 2023",
                    rating: 4,
                    title: "A fresh take on detective fiction",
                    content:
                        "Samantha Lee has created a compelling mystery that seamlessly blends traditional detective work with cutting-edge technology. Detective Chen is a fantastic protagonist - smart, flawed, and determined. The virtual reality scenes are particularly well-written and immersive.",
                    verified: true,
                },
                {
                    id: 2,
                    name: "Lisa R.",
                    date: "January 30, 2023",
                    rating: 5,
                    title: "Couldn't guess the ending!",
                    content:
                        "As an avid mystery reader, I pride myself on figuring out whodunit before the reveal. This book completely surprised me! The plot twists were unexpected but made perfect sense in retrospect. The virtual reality setting adds a fresh dimension to the mystery genre.",
                    verified: true,
                },
                {
                    id: 3,
                    name: "Mark S.",
                    date: "January 15, 2023",
                    rating: 3,
                    title: "Good but needed more development",
                    content:
                        "The concept is innovative and the mystery is intriguing, but I felt some of the supporting characters needed more development. The technology aspects were well-researched and believable. Overall a good read, but it could have been great with a bit more depth.",
                    verified: false,
                },
            ],

        }, {
            id: 104,
            title: "Digital Marketing Essentials",
            author: "Emma Thompson",
            price: 14.99,
            cover: "https://picsum.photos/seed/ebook4/450/600",
            categories: ["Business", "Marketing"],
            formats: ["PDF", "EPUB"],
            devices: ["Kindle", "iPad", "Android"],
            description:
                "A comprehensive guide to digital marketing strategies, tools, and techniques. This e-book covers everything from SEO to social media marketing, providing practical tips and case studies to help you succeed in the digital landscape.",
            rating: 4.5,
            reviewCount: 45,
            reviews: [
                {
                    id: 1,
                    name: "Alice B.",
                    date: "February 10, 2023",
                    rating: 5,
                    title: "A must-read for marketers!",
                    content:
                        "This e-book is packed with valuable insights and practical tips. I learned so much about digital marketing strategies that I can apply to my own business. Highly recommend!",
                    verified: true,
                },
                {
                    id: 2,
                    name: "John D.",
                    date: "January 20, 2023",
                    rating: 4,
                    title: "Great resource for beginners",
                    content:
                        "As someone new to digital marketing, I found this e-book to be very informative. The explanations are clear and easy to understand. I especially liked the case studies that illustrate the concepts.",
                    verified: false,
                },
            ],
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

    const { id } = useParams()
    const ebookId = parseInt(id) // Convert string ID to number
    const ebook = ebooksData.find(book => book.id === ebookId)





    if (!ebook) {
        return <div className="text-center">E-book not found</div>
    }

    // Simple notification function to replace useToast
    const showNotification = (title, description, type = "info") => {
        if (typeof window !== "undefined") {
            alert(`${title}\n${description}`)
        }
        // In a real app, you might want to use a proper notification system here
        console.log(`[${type.toUpperCase()}] ${title}: ${description}`)
    }

    const handleAddToCart = () => {
        showNotification("Added to cart", `${ebook.title} - $${ebook.price.toFixed(2)}`)
    }

    const handleBuyNow = () => {
        showNotification("Proceeding to checkout", `Purchasing ${ebook.title}`)
    }

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted)
        showNotification(
            isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            ebook.title
        )
    }

    const handleShare = () => {
        showNotification("Share link copied", "E-book link has been copied to clipboard")
    }

    const handleDownloadSample = () => {
        showNotification("Sample downloaded", `Sample of ${ebook.title} is being downloaded`)
    }

    const handleLoadMoreReviews = () => {
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

    const relatedEbooks = ebook.relatedBooks ? ebook.relatedBooks.map((id) => ebooksData[id]).filter(Boolean) : []

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
                        <div className="flex justify-center md:col-span-1">
                            <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                                <img
                                    src={ebook.cover}
                                    alt={`${ebook.title} cover`}
                                    className="w-full h-full object-cover"
                                />
                                {ebook.featured && (
                                    <Badge className="absolute right-2 top-2" variant="secondary">
                                        Featured
                                    </Badge>
                                )}
                            </div>
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
                                        <p className="text-xl text-muted-foreground">by {ebook.author}</p>
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
                                            className={`h-5 w-5 ${i < Math.floor(ebook.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">
                                        {ebook.rating} ({ebook.reviewCount} reviews)
                                    </span>
                                </div>

                                {/* Categories */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {ebook.categories.map((category) => (
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
                                    <span className="text-2xl font-bold">${ebook.price.toFixed(2)}</span>
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
                                        <span>{ebook.formats.join(", ")}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Laptop className="mr-1 h-4 w-4" />
                                        <span>{ebook.fileSize}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Smartphone className="mr-1 h-4 w-4" />
                                        <span>{ebook.pages} pages</span>
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
                                    <p className="text-muted-foreground">{ebook.description}</p>
                                </TabsContent>
                                <TabsContent value="details" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium">Publisher</p>
                                            <p className="text-muted-foreground">{ebook.publisher}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Publication Date</p>
                                            <p className="text-muted-foreground">{ebook.publishDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">ISBN</p>
                                            <p className="text-muted-foreground">{ebook.isbn}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Pages</p>
                                            <p className="text-muted-foreground">{ebook.pages}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Language</p>
                                            <p className="text-muted-foreground">{ebook.language}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">File Size</p>
                                            <p className="text-muted-foreground">{ebook.fileSize}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="devices" className="mt-4">
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            This e-book is compatible with the following devices and applications:
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                            {ebook.devices.map((device) => (
                                                <div
                                                    key={device}
                                                    className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800"
                                                >
                                                    {device === "Kindle" ? (
                                                        <Tablet className="h-8 w-8 text-primary" />
                                                    ) : device === "Nook" ? (
                                                        <Tablet className="h-8 w-8 text-primary" />
                                                    ) : device === "iPad" ? (
                                                        <Tablet className="h-8 w-8 text-primary" />
                                                    ) : device === "Android" ? (
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
                                            src={relatedEbook.cover}
                                            alt={`${relatedEbook.title} cover`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="line-clamp-1 font-semibold">{relatedEbook.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{relatedEbook.author}</p>
                                        <p className="mt-1 font-medium">${relatedEbook.price.toFixed(2)}</p>
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
                        {ebook.reviews &&
                            ebook.reviews.slice(0, visibleReviews).map((review) => (
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

                        {ebook.reviews && visibleReviews < ebook.reviews.length && (
                            <div className="flex justify-center">
                                <Button variant="outline" onClick={handleLoadMoreReviews}>
                                    Load More Reviews ({ebook.reviews.length - visibleReviews} remaining)
                                </Button>
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