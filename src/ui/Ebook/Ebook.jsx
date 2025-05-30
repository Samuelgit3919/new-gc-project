import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
    Card,
    CardContent,
} from "../../components/ui/card";
import Layout from "../../Layout";
import { ChevronRight, Download } from "lucide-react";
// import axios from "axios";

const Ebook = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch ebooks from API
    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const response = await fetch("https://bookcompass.onrender.com/api/books/getDigitalBooks");
                const data = await response.json();
                console.log(data)
                setEbooks(data);
            } catch (error) {
                console.error("Error fetching eBooks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEbooks();
    }, []);

    const ebookCategories = [
        "Fiction", "Non-Fiction", "Mystery", "Science Fiction",
        "Business", "Self-Help", "Biography", "Fantasy",
    ];

    const StarRating = ({ rating }) => (
        <div className="flex justify-center">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    className={`w-5 h-5 ${index < rating ? "text-amber-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    // Skeleton loading component
    const EbookSkeleton = () => (
        <Card className="h-full overflow-hidden">
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200 animate-pulse"></div>
            <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="flex justify-between mt-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                </div>
                <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Layout>
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">E-Books</h1>
                        <p className="text-muted-foreground">Discover digital books for instant reading</p>
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-6 flex flex-wrap justify-start">
                            <TabsTrigger value="all">All E-Books</TabsTrigger>
                            <TabsTrigger value="featured">Featured</TabsTrigger>
                            <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
                            <TabsTrigger value="new">New Releases</TabsTrigger>
                            <TabsTrigger value="deals">Special Deals</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">All E-Books</h2>
                                <div className="flex items-center space-x-2">
                                    <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                        <option>Sort by: Relevance</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Newest</option>
                                        <option>Bestselling</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                {loading ? (
                                    // Show skeleton loaders while loading
                                    Array.from({ length: 12 }).map((_, index) => (
                                        <EbookSkeleton key={index} />
                                    ))
                                ) : (
                                    // Show actual ebook cards when loaded
                                    ebooks.map((ebook) => (
                                        <Link key={ebook._id} to={`/EBook/${ebook._id}`}>
                                            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                                                <div className="relative aspect-[2/3] w-full overflow-hidden">
                                                    <img
                                                        src={ebook.imageUrl}
                                                        alt={ebook.title}
                                                        loading="lazy"
                                                        className="object-cover w-full h-full transition-transform hover:scale-105"
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
                                                <CardContent className="p-4">
                                                    <h3 className="line-clamp-1 font-semibold">{ebook.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{ebook.author}</p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="font-medium">${(ebook.price || 0).toFixed(2)}</span>
                                                        <Download className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <StarRating rating={Math.round(ebook.averageRating || 0)} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="featured">
                            <div className="py-12 text-center text-muted-foreground">
                                Featured content coming soon
                            </div>
                        </TabsContent>
                        <TabsContent value="bestsellers">
                            <div className="py-12 text-center text-muted-foreground">
                                Bestsellers content coming soon
                            </div>
                        </TabsContent>
                        <TabsContent value="new">
                            <div className="py-12 text-center text-muted-foreground">
                                New releases content coming soon
                            </div>
                        </TabsContent>
                        <TabsContent value="deals">
                            <div className="py-12 text-center text-muted-foreground">
                                Special deals content coming soon
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
                        <div className="flex flex-wrap gap-2">
                            {ebookCategories.map((category) => (
                                <Link
                                    key={category}
                                    to={`/ebooks?category=${encodeURIComponent(category)}`}
                                    className="inline-flex items-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                                >
                                    {category}
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Ebook;