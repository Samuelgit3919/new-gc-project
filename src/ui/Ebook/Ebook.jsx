import { Link } from "react-router-dom";
// import img from "next/img";
import React from "react";
// import { ebooksForSales, recentlyAdded, topRatedBooks } from "./eBook";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"

import Layout from "../../Layout"
import { ChevronRight, Download } from "lucide-react";

const Ebook = () => {
    const ebooks = [
        {
            id: 101,
            title: "Digital Horizons",
            author: "Alex Morgan",
            price: 9.99,
            cover: "https://picsum.photos/seed/ebook1/450/600",
            category: "Science Fiction",
            format: "EPUB, PDF, MOBI",
            fileSize: "2.4 MB",
            pages: 342,
            featured: true,
        },
        {
            id: 102,
            title: "The Virtual Detective",
            author: "Samantha Lee",
            price: 7.99,
            cover: "https://picsum.photos/seed/ebook2/450/600",
            category: "Mystery",
            format: "EPUB, PDF",
            fileSize: "1.8 MB",
            pages: 286,
            featured: false,
        },
        {
            id: 103,
            title: "Coding Dreams",
            author: "Coding Dreams",
            price: 12.99,
            cover: "https://picsum.photos/seed/ebook3/450/600",
            category: "Non-Fiction",
            format: "EPUB, PDF, MOBI",
            fileSize: "3.2 MB",
            pages: 412,
            featured: true,
        },
        {
            id: 104,
            title: "Digital Marketing Essentials",
            author: "Emma Thompson",
            price: 14.99,
            cover: "https://picsum.photos/seed/ebook4/450/600",
            category: "Business",
            format: "EPUB, PDF",
            fileSize: "4.1 MB",
            pages: 478,
            featured: false,
        },
        {
            id: 105,
            title: "The Social Algorithm",
            author: "David Chen",
            price: 8.99,
            cover: "https://picsum.photos/seed/ebook5/450/600",
            category: "Fiction",
            format: "EPUB, MOBI",
            fileSize: "2.0 MB",
            pages: 324,
            featured: true,
        },
        {
            id: 106,
            title: "Cloud Atlas Reimagined",
            author: "Michelle Kim",
            price: 10.99,
            cover: "https://picsum.photos/seed/ebook6/450/600",
            category: "Science Fiction",
            format: "EPUB, PDF",
            fileSize: "2.7 MB",
            pages: 356,
            featured: false,
        },
    ]

    // Categories for ebooks
    const ebookCategories = [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Science Fiction",
        "Business",
        "Self-Help",
        "Biography",
        "Fantasy",
    ]
    // Star rating component
    const StarRating = ({ rating }) => {
        return (
            <div className="flex justify-center">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        className={`w-5 h-5 ${index < rating ? "text-amber-400" : "text-gray-300"
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

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
                                {ebooks.map((ebook) => (
                                    <Link key={ebook.id} to={`/EBook/${ebook.id}`}>
                                        <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                                            <div className="relative aspect-[2/3] w-full overflow-hidden">
                                                <img
                                                    src={ebook.cover}
                                                    alt={ebook.title}
                                                    fill
                                                    className="object-cover transition-transform hover:scale-105"
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
                                                    <span className="font-medium">${ebook.price.toFixed(2)}</span>
                                                    <Download className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="featured" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">Featured E-Books</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                {ebooks
                                    .filter((ebook) => ebook.featured)
                                    .map((ebook) => (
                                        <Link key={ebook.id} to={`/ebooks/${ebook.id}`}>
                                            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                                                <div className="relative aspect-[2/3] w-full overflow-hidden">
                                                    <img
                                                        src={ebook.cover || "/placeholder.svg"}
                                                        alt={ebook.title}
                                                        fill
                                                        className="object-contain transition-transform hover:scale-105"
                                                    />
                                                    <Badge className="absolute right-2 top-2" variant="secondary">
                                                        Featured
                                                    </Badge>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="line-clamp-1 font-semibold">{ebook.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{ebook.author}</p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="font-medium">${ebook.price.toFixed(2)}</span>
                                                        <Download className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                            </div>
                        </TabsContent>

                        {/* Other tab contents would be similar */}
                        <TabsContent value="bestsellers">
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">Bestsellers content coming soon</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="new">
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">New releases content coming soon</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="deals">
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">Special deals content coming soon</p>
                            </div>
                        </TabsContent>
                    </Tabs>


                    {/* browse by category */}
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
