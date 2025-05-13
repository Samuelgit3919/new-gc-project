import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Calendar, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import Layout from "../../Layout";

const ShopDetail = () => {
    const { id } = useParams();

    // Sample data - in a real app, you'd fetch this from an API
    const bookStores = [
        {
            id: 1,
            name: "ADDIS LIBRARY",
            tagline: "Your literary gateway since 1995",
            description: "Addis Library is a premier bookstore with a wide collection of local and international books, serving the community with quality literature and a welcoming atmosphere.",
            image: "https://images.unsplash.com/photo-1589998059171-988d887df646",
            logo: "https://images.unsplash.com/photo-1575470888645-5c5e277247b0",
            address: "Bole Road, Addis Ababa, Ethiopia",
            phone: "+251114678910",
            email: "info@addislibrary.com",
            website: "https://www.addislibrary.com",
            rating: 4.5,
            reviewCount: 128,
            distance: "1.2 km",
            features: ["Café", "Reading Area", "Author Events", "Children's Corner", "Free Wi-Fi", "Book Club"],
            hours: [
                { day: "Monday", hours: "9:00 AM - 6:00 PM" },
                { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
                { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
                { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
                { day: "Friday", hours: "9:00 AM - 8:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                { day: "Sunday", hours: "Closed" }
            ],
            inventory: [
                {
                    id: 101,
                    title: "The Silent Echo",
                    author: "Emily Richards",
                    price: 18.99,
                    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
                    inStock: true,
                    description: "A gripping novel about secrets and redemption across generations in contemporary Ethiopia.",
                    genre: "Literary Fiction",
                    pages: 320,
                    publisher: "Addis Ababa Press",
                    isbn: "978-1234567890",
                    rating: 4.3,
                    publishDate: "2023-03-15",
                    language: "English"
                },
                {
                    id: 102,
                    title: "Beyond the Horizon",
                    author: "Michael Chen",
                    price: 15.99,
                    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
                    inStock: true,
                    description: "An adventure story exploring uncharted territories of the Ethiopian highlands.",
                    genre: "Adventure",
                    pages: 280,
                    publisher: "Horizon Press",
                    isbn: "978-0987654321",
                    rating: 4.1,
                    publishDate: "2022-11-10",
                    language: "English"
                },
                {
                    id: 103,
                    title: "Whispers in the Dark",
                    author: "Sarah Johnson",
                    price: 12.99,
                    cover: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb",
                    inStock: true,
                    description: "A psychological thriller set in Addis Ababa's historic neighborhoods.",
                    genre: "Thriller",
                    pages: 350,
                    publisher: "Dark Alley Books",
                    isbn: "978-1122334455",
                    rating: 4.5,
                    publishDate: "2023-01-20",
                    language: "English"
                }
            ],
            events: [
                {
                    id: 1,
                    title: "Author Reading Night",
                    date: "Every Friday",
                    time: "6:00 PM - 8:00 PM",
                    description: "Join us for readings from local authors with Q&A sessions and book signings.",
                    featured: true,
                    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66"
                },
                {
                    id: 2,
                    title: "Children's Story Hour",
                    date: "Every Saturday",
                    time: "11:00 AM - 12:00 PM",
                    description: "Interactive story sessions for kids aged 3-10 with creative activities.",
                    featured: false,
                    image: "https://images.unsplash.com/photo-1579280960509-42a7b7e1f8a1"
                }
            ],
            reviews: [
                {
                    id: 1,
                    name: "Selam T.",
                    date: "2023-05-15",
                    rating: 5,
                    content: "The best selection of books in Addis! The staff are incredibly knowledgeable and the café makes it perfect for spending an afternoon reading."
                },
                {
                    id: 2,
                    name: "Yohannes K.",
                    date: "2023-04-22",
                    rating: 4,
                    content: "Great atmosphere and good selection, though I wish they stayed open later on weekdays."
                }
            ]
        },
        {
            id: 2,
            name: "AFRICA BOOK STORE",
            tagline: "Celebrating African literature",
            description: "Specializing in African literature and academic texts, with a focus on Ethiopian authors and pan-African perspectives.",
            image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
            logo: "https://images.unsplash.com/photo-1600189261867-30c5a6046d6a",
            address: "Piazza District, Addis Ababa",
            phone: "+251111112222",
            email: "contact@africabookstore.com",
            website: "https://www.africabookstore.com",
            rating: 4.6,
            reviewCount: 89,
            distance: "2.5 km",
            features: ["African Literature", "Academic Texts", "Rare Books", "Book Club", "Author Signings"],
            hours: [
                { day: "Monday", hours: "8:30 AM - 7:00 PM" },
                { day: "Tuesday", hours: "8:30 AM - 7:00 PM" },
                { day: "Wednesday", hours: "8:30 AM - 7:00 PM" },
                { day: "Thursday", hours: "8:30 AM - 7:00 PM" },
                { day: "Friday", hours: "8:30 AM - 8:00 PM" },
                { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
                { day: "Sunday", hours: "Closed" }
            ],
            inventory: [
                {
                    id: 201,
                    title: "African Dawn",
                    author: "Kwame Osei",
                    price: 14.99,
                    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
                    inStock: true,
                    description: "A powerful story of African independence movements across the continent.",
                    genre: "Historical Fiction",
                    pages: 400,
                    publisher: "Pan African Press",
                    isbn: "978-2233445566",
                    rating: 4.7,
                    publishDate: "2021-09-05",
                    language: "English"
                },
                {
                    id: 202,
                    title: "The Nile's Secret",
                    author: "Amira Hassan",
                    price: 16.99,
                    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646",
                    inStock: false,
                    description: "Archaeological mystery uncovering ancient secrets along the Nile River.",
                    genre: "Mystery",
                    pages: 310,
                    publisher: "African Mysteries",
                    isbn: "978-3344556677",
                    rating: 4.4,
                    publishDate: "2022-07-18",
                    language: "English"
                }
            ],
            events: [
                {
                    id: 1,
                    title: "African Literature Discussion",
                    date: "First Wednesday of month",
                    time: "5:00 PM - 7:00 PM",
                    description: "Monthly book club discussing contemporary African authors and themes.",
                    featured: true,
                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                }
            ],
            reviews: [
                {
                    id: 1,
                    name: "Mekdes A.",
                    date: "2023-06-10",
                    rating: 5,
                    content: "The best place to find African literature in Addis. Their selection of Ethiopian authors is unmatched."
                }
            ]
        },
        // ... (other stores with similar enhanced structure)
    ];

    // Additional enhancements for other stores would follow the same pattern

    const store = bookStores.find(store => store.id === parseInt(id));

    if (!store) {
        return (
            <div className="container px-4 py-8 md:px-6 md:py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-4 text-2xl font-bold">Store not found</h2>
                <p className="mt-2 text-gray-600">The bookstore you're looking for doesn't exist or has been removed.</p>
                <Button asChild className="mt-6">
                    <Link to="/shopLists">Back to Bookstores</Link>
                </Button>
            </div>
        );
    }

    // Calculate average rating from reviews if available
    const averageRating = store.reviews?.length
        ? (store.reviews.reduce((sum, review) => sum + review.rating, 0) / store.reviews.length).toFixed(1)
        : store.rating;

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
                        <h1 className="text-3xl font-bold md:text-4xl drop-shadow-md">{store.name}</h1>
                        <p className="mt-2 text-lg text-gray-100 drop-shadow-md">{store.tagline}</p>
                        <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm">
                                {averageRating} ({store.reviewCount || store.reviews?.length || 0} reviews)
                            </span>
                            <span className="ml-4 text-sm flex items-center">
                                <MapPin className="h-4 w-4 mr-1" /> {store.distance || 'Nearby'}
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
                                    {store.features?.map((feature) => (
                                        <Badge key={feature} variant="secondary" className="px-3 py-1">
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
                                                                    {book.rating}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 flex justify-between items-center">
                                                                <span className="font-medium">${book.price.toFixed(2)}</span>
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
                                    {store.reviews?.length ? (
                                        <div className="space-y-6">
                                            {store.reviews.map((review) => (
                                                <Card key={review.id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center space-x-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div className="mt-2 flex items-center space-x-2">
                                                                    <span className="font-medium">{review.name}</span>
                                                                    <span className="text-sm text-muted-foreground">•</span>
                                                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="mt-4 text-muted-foreground">{review.content}</p>
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
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Store Info Card */}
                        <Card className=" top-6">
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
                                        <p className="text-sm text-muted-foreground">{store.distance || 'Nearby'}</p>
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
                                            href={store.mapEmbed}
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