import { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Download, Heart, Share, Star, FileText, Laptop, Smartphone, Tablet, BookOpen } from "lucide-react"
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
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { DataContext } from "@/DataProvider/DataProvider";
import { Type } from "@/Utility/action.type";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from "../../components/ui/skeleton";


// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function EbookDetail() {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [reviewFormData, setReviewFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        comment: "",
    })
    const [visibleReviews, setVisibleReviews] = useState(2)
    const [ebook, setEbook] = useState({})
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isReaderOpen, setIsReaderOpen] = useState(false)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState(null);
    const [zoom, setZoom] = useState(1.0);
    const [, dispatch] = useContext(DataContext);
    const [reviewSort, setReviewSort] = useState("date");

    const { id } = useParams()

    useEffect(() => {
        const fetchEbookData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                const response = await fetch(`https://bookcompass.onrender.com/api/books/singleBook/${id}`, {
                    headers
                });

                if (response.status === 401) {
                    throw new Error("Authentication required. Please log in.");
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch ebook. Status: ${response.status}`);
                }

                const ebookData = await response.json();
                setEbook(ebookData.data);

                if (!ebookData || typeof ebookData !== 'object') {
                    throw new Error("Invalid or empty ebook data");
                }
            } catch (err) {
                console.error("Error fetching ebook data:", err);
                setError(err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchEbookData();
    }, [id]);

    useEffect(() => {
        setPageNumber(1);
        setZoom(1.0);
        setPdfError(null);
        setPdfLoading(false);
    }, [ebook.fileUrl, isReaderOpen]);

    // Fetch reviews using the new endpoint
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`https://bookcompass.onrender.com/api/reviews/${id}/reviews`);
                if (!response.ok) throw new Error('Failed to fetch reviews');
                const data = await response.json();
                setReviews(data.data || []);
            } catch {
                setReviews([]);
            }
        };
        if (id) fetchReviews();
    }, [id]);

    const getPdfUrl = (url) => {
        if (!url) return '';

        // Fix Cloudinary URL format for PDF files
        if (url.includes('res.cloudinary.com')) {
            return url
                .replace('/image/upload/', '/raw/upload/')
                .replace('/image/upload/', '/raw/upload/');
        }

        return url;
    };

    const showNotification = (title, description, type = "info") => {
        if (typeof window !== "undefined") {
            if (type === 'error') {
                alert(`${title}\n${description}`)
            } else {
                toast.success(`${title}: ${description}`);
            }
        }
        console.log(`[${type.toUpperCase()}] ${title}: ${description}`)
    }

    const handleAddToCart = () => {
        if (!ebook) return;
        dispatch({
            type: Type.ADD_TO_BASKET,
            item: {
                id: ebook._id || ebook.id,
                title: ebook.title,
                price: ebook.price,
                imageUrl: ebook.imageUrl,
                amount: 1,
                type: "ebook",
            },
        });
        // showNotification("Added to cart", `${ebook.title} - $${(ebook.price || 0).toFixed(2)}`);
    };

    const handleReadNow = () => {
        if (!ebook || !ebook.fileUrl) {
            showNotification("Error", "No file available for this eBook", "error");
            return;
        }
        const pdfUrl = getPdfUrl(ebook.fileUrl);
        const token = localStorage.getItem('token');
        let authenticatedUrl = pdfUrl;
        console.log(pdfUrl)
        if (token) {
            // Append token as query param if not already present
            const urlObj = new URL(pdfUrl, window.location.origin);
            if (!urlObj.searchParams.has('token')) {
                urlObj.searchParams.append('token', token);
            }
            authenticatedUrl = urlObj.toString();
        }
        const win = window.open(authenticatedUrl, '_blank', 'noopener');
        if (!win) {
            showNotification("Popup Blocked", "Please allow popups for this site to open the eBook in a new tab.", "error");
        }
    };

    const handleToggleWishlist = async () => {
        if (!ebook) return;
        const token = localStorage.getItem('token');
        try {
            if (!isWishlisted) {
                // Add to wishlist
                const res = await fetch('https://bookcompass.onrender.com/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ bookId: ebook._id || ebook.id }),
                });
                console.log(res)
                if (!res.ok) throw new Error('Failed to add to wishlist');
                setIsWishlisted(true);
                showNotification("Added to wishlist", ebook.title);
            } else {
                // Remove from wishlist
                const res = await fetch(`https://bookcompass.onrender.com/api/wishlist/${ebook._id || ebook.id}`, {
                    method: 'DELETE',
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                });
                if (!res.ok) throw new Error('Failed to remove from wishlist');
                setIsWishlisted(false);
                showNotification("Removed from wishlist", ebook.title);
            }
        } catch {
            showNotification("Error", "Wishlist error", "error");
        }
    };

    const handleShare = () => {
        if (!ebook) return;
        if (navigator.share) {
            navigator.share({
                title: ebook.title,
                text: `Check out this ebook: ${ebook.title} by ${ebook.author}`,
                url: window.location.href,
            }).catch(() => {
                copyToClipboard();
            });
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification("Link copied", "E-book link has been copied to clipboard"))
            .catch(() => {
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

        if (!reviewFormData.name || !reviewFormData.email || !reviewFormData.comment) {
            showNotification("Missing information", "Please fill in all required fields", "error")
            return
        }

        try {
            const token = localStorage.getItem('token');
            const headers = token ? {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            } : { 'Content-Type': 'application/json' };

            // Use the new POST endpoint
            const response = await fetch(`https://bookcompass.onrender.com/api/reviews/${id}/reviews`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: reviewFormData.name,
                    email: reviewFormData.email,
                    rating: reviewFormData.rating,
                    comment: reviewFormData.comment,
                }),
            })

            if (response.status === 401) {
                throw new Error("Authentication required. Please log in.");
            }

            if (!response.ok) {
                throw new Error(`Failed to submit review: ${response.status}`);
            }

            setReviewDialogOpen(false); // Close the dialog immediately
            showNotification(
                "Review submitted",
                "Thank you for your feedback! Your review will be published after moderation."
            )

            // Re-fetch reviews after submitting
            const reviewsRes = await fetch(`https://bookcompass.onrender.com/api/reviews/${id}/reviews`);
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData.data || []);
            }

            setReviewFormData({
                name: "",
                email: "",
                rating: 5,
                comment: "",
            });
        } catch (err) {
            console.error('Error submitting review:', err);
            showNotification("Error", err.message || "Failed to submit review. Please try again later.", "error");
        }
    }

    // PDF handling functions
    const openEmbeddedReader = () => {
        if (!ebook || !ebook.fileUrl) {
            showNotification("Error", "No file available for this eBook", "error");
            return;
        }

        setIsReaderOpen(true);
        setPdfLoading(true);
        setPdfError(null);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
        setPdfLoading(false);
    }

    function onDocumentLoadError(error) {
        console.error('Error loading PDF:', error);
        setPdfError(error.message || 'Failed to load PDF document. Authentication may be required.');
        setPdfLoading(false);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + offset, numPages)));
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function handleDownloadPdf() {
        if (!ebook.fileUrl) return;
        const url = getPdfUrl(ebook.fileUrl);
        const token = localStorage.getItem('token');
        fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = ebook.title ? `${ebook.title}.pdf` : 'ebook.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(() => {
                showNotification('Error', 'Failed to download PDF', 'error');
            });
    }

    // Sorting for reviews (use new reviews state)
    const sortedReviews = reviews ? [...reviews].sort((a, b) => {
        if (reviewSort === "date") {
            return new Date(b.date) - new Date(a.date);
        } else if (reviewSort === "rating") {
            return b.rating - a.rating;
        }
        return 0;
    }) : [];

    if (loading) {
        return (
            <Layout>
                <div className="container px-4 py-8 md:px-6 md:py-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Skeleton for ebook cover */}
                        <div className="flex justify-center md:col-span-1">
                            <Skeleton className="aspect-[2/3] w-full max-w-[300px] h-[400px] rounded-lg" />
                        </div>
                        {/* Skeleton for ebook details */}
                        <div className="md:col-span-1 lg:col-span-2 space-y-6">
                            <Skeleton className="h-10 w-2/3 mb-2" />
                            <Skeleton className="h-6 w-1/3 mb-4" />
                            <Skeleton className="h-5 w-1/4 mb-2" />
                            <Skeleton className="h-8 w-1/2 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-10 w-1/3 mb-2" />
                            <Skeleton className="h-10 w-1/3 mb-2" />
                        </div>
                    </div>
                    {/* Skeleton for reviews */}
                    <div className="mt-16">
                        <Skeleton className="h-8 w-1/4 mb-4" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))}
                        </div>
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
                        {error.includes("Authentication") && (
                            <Button asChild className="mt-4">
                                <Link to="/login">Login Now</Link>
                            </Button>
                        )}
                        <Button asChild variant="outline" className="mt-4 ml-2">
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
            <ToastContainer />
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/EBook">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to E-Books
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex justify-center md:col-span-1">
                        <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                            <img
                                src={ebook.imageUrl || "/placeholder-cover.jpg"}
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

                    <div className="md:col-span-1 lg:col-span-2">
                        <div className="space-y-6">
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

                                <div className="mt-4 flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(ebook.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">
                                        {(ebook.rating || 0).toFixed(1)} ({ebook.reviewCount || 0} reviews)
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {ebook.categories?.map((category) => (
                                        <Link to={`/ebooks?category=${encodeURIComponent(category)}`} key={category}>
                                            <Badge variant="secondary">{category}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold">${(ebook.price || 0).toFixed(2)}</span>
                                    <span className="text-sm text-muted-foreground">Digital download • Instant delivery</span>
                                </div>

                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                    <Button className="w-full sm:w-auto" onClick={handleAddToCart}>
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={handleReadNow}
                                    >
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Read Now (New Tab)
                                    </Button>
                                    {ebook.fileUrl && (
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={openEmbeddedReader}
                                        >
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Read Embedded
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownloadSample}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Sample
                                    </Button>
                                </div>

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

                <div className="mt-16">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
                        <div className="flex gap-2 items-center">
                            <select value={reviewSort} onChange={e => setReviewSort(e.target.value)} className="border rounded px-2 py-1 text-sm">
                                <option value="date">Sort by Date</option>
                                <option value="rating">Sort by Rating</option>
                            </select>
                            <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                                Write a Review
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 space-y-6">
                        {sortedReviews.length > 0 ? (
                            <>
                                {sortedReviews.slice(0, visibleReviews).map((review) => (
                                    <div key={review._id} className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
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
                                    </div>
                                ))}
                                {visibleReviews < sortedReviews.length && (
                                    <div className="flex justify-center">
                                        <Button variant="outline" onClick={handleLoadMoreReviews}>
                                            Load More Reviews ({sortedReviews.length - visibleReviews} remaining)
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

                {/* PDF Reader Dialog */}
                <Dialog open={isReaderOpen} onOpenChange={setIsReaderOpen}>
                    <DialogContent className="max-w-6xl h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{ebook.title}</DialogTitle>
                            <DialogDescription>
                                by {ebook.author} • PDF Reader
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-auto border rounded-lg bg-gray-50">
                            {pdfLoading && (
                                <div className="flex items-center justify-center h-full">
                                    <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                                    <p>Loading PDF document...</p>
                                </div>
                            )}

                            {pdfError && (
                                <div className="text-center py-12">
                                    <div className="text-red-500 text-lg font-medium mb-4">
                                        Failed to load PDF: {pdfError}
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                                        <Button
                                            variant="default"
                                            onClick={handleReadNow}
                                            className="mb-2 sm:mb-0"
                                        >
                                            Open in New Tab Instead
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsReaderOpen(false);
                                                setPdfError(null);
                                            }}
                                        >
                                            Close Viewer
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!pdfError && ebook.fileUrl && (
                                <div className="p-4 flex justify-center">
                                    <Document
                                        file={{
                                            url: getPdfUrl(ebook.fileUrl),
                                            httpHeaders: {
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        }}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={
                                            <div className="flex items-center justify-center h-full">
                                                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                                                <p>Loading PDF document...</p>
                                            </div>
                                        }
                                        error="Failed to load PDF"
                                        className="flex justify-center"
                                    >
                                        <Page
                                            key={`page_${pageNumber}`}
                                            pageNumber={pageNumber}
                                            width={Math.min(window.innerWidth * 0.8 * zoom, 800 * zoom)}
                                            renderAnnotationLayer={true}
                                            renderTextLayer={true}
                                        />
                                    </Document>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={previousPage}
                                    disabled={pageNumber <= 1 || pdfLoading || pdfError}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={nextPage}
                                    disabled={pageNumber >= numPages || pdfLoading || pdfError}
                                >
                                    Next
                                </Button>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                                    disabled={zoom <= 0.5}
                                >
                                    -
                                </Button>
                                <span className="text-sm">Zoom: {(zoom * 100).toFixed(0)}%</span>
                                <Button
                                    variant="outline"
                                    onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                                    disabled={zoom >= 2}
                                >
                                    +
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Page {pageNumber} of {numPages || '?'}
                            </p>

                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleDownloadPdf}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleReadNow}
                                >
                                    Open in New Tab
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    )
}