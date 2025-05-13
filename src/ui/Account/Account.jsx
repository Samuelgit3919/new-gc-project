import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Book, CreditCard, LogOut, Package, Settings, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import Layout from "../../Layout"

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const navigate = useNavigate()

    const user = {
        name: "sami",
        email: "sami@example.com",
        phone: "+251939191959",
        address: {
            street: "ASTU (Adama Science and Technology University)",
            city: "Adama",
            state: "adama",
            zip: "0000",
            country: "Ethiopia",
        },
        orders: [
            {
                id: "ORD-1234",
                date: "June 15, 2023",
                total: 45.97,
                status: "Delivered",
                items: [
                    { title: "The Silent Echo", format: "Hardcover", price: 18.99 },
                    { title: "Whispers in the Dark", format: "Paperback", price: 12.99 },
                    { title: "Beyond the Horizon", format: "E-Book", price: 9.99 },
                ],
            },
            {
                id: "ORD-5678",
                date: "May 22, 2023",
                total: 34.98,
                status: "Processing",
                items: [
                    { title: "The Last Voyage", format: "Hardcover", price: 21.99 },
                    { title: "Eternal Flames", format: "Paperback", price: 12.99 },
                ],
            },
        ],
        wishlist: [
            {
                id: 6,
                title: "The Forgotten Path",
                author: "Daniel Wilson",
                price: 19.99,
                cover: "/placeholder.svg?height=150&width=100&text=Forgotten+Path",
            },
            {
                id: 8,
                title: "The Hidden Truth",
                author: "Thomas Brown",
                price: 22.99,
                cover: "/placeholder.svg?height=150&width=100&text=Hidden+Truth",
            },
        ],
    }

    const handleSaveProfile = (e) => {
        e.preventDefault()
        console.log("Profile updated")
    }

    const handleSaveAddress = (e) => {
        e.preventDefault()
        console.log("Address updated")
    }

    const handleRemoveFromWishlist = (id) => {
        console.log(`Removed book with ID ${id} from wishlist`)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    const handleAddToCart = (book) => {
        console.log(`${book.title} added to cart`)
    }

    return (
        <Layout>
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-8 md:grid-cols-[240px_1fr]">
                    {/* Sidebar Navigation */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="flex items-center space-x-2 rounded-lg border p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Button
                                    variant={activeTab === "profile" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("profile")}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Button>
                                <Button
                                    variant={activeTab === "orders" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("orders")}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Orders
                                </Button>
                                <Button
                                    variant={activeTab === "wishlist" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("wishlist")}
                                >
                                    <Book className="mr-2 h-4 w-4" />
                                    Wishlist
                                </Button>
                                <Button
                                    variant={activeTab === "payment" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("payment")}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Payment Methods
                                </Button>
                                <Button
                                    variant={activeTab === "settings" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("settings")}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Content Area */}
                    <div>
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                                    <p className="text-muted-foreground">Manage your account information and preferences.</p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>Update your personal details.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSaveProfile} className="space-y-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input id="name" defaultValue={user.name} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" type="email" defaultValue={user.email} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input id="phone" type="tel" defaultValue={user.phone} />
                                                </div>
                                            </div>
                                            <Button type="submit">Save Changes</Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Address</CardTitle>
                                        <CardDescription>Update your shipping and billing address.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSaveAddress} className="space-y-4">
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="street">Street Address</Label>
                                                    <Input id="street" defaultValue={user.address.street} />
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-3">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input id="city" defaultValue={user.address.city} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="state">State</Label>
                                                        <Input id="state" defaultValue={user.address.state} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="zip">ZIP Code</Label>
                                                        <Input id="zip" defaultValue={user.address.zip} />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="country">Country</Label>
                                                    <Input id="country" defaultValue={user.address.country} />
                                                </div>
                                            </div>
                                            <Button type="submit">Save Address</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                                    <p className="text-muted-foreground">View and track your orders.</p>
                                </div>

                                <div className="space-y-4">
                                    {user.orders.map((order) => (
                                        <Card key={order.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                                                    <div>
                                                        <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                                        <CardDescription>{order.date}</CardDescription>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${order.status === "Delivered"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                                }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                        <span className="font-medium">${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex justify-between">
                                                            <div>
                                                                <p className="font-medium">{item.title}</p>
                                                                <p className="text-sm text-muted-foreground">{item.format}</p>
                                                            </div>
                                                            <p className="font-medium">${item.price.toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={`/account/orders/${order.id}`}>View Details</Link>
                                                </Button>
                                                {order.status === "Delivered" && (
                                                    <Button variant="outline" size="sm">
                                                        Write a Review
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
                                    <p className="text-muted-foreground">Books you've saved for later.</p>
                                </div>

                                {user.wishlist.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                            <Book className="h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Browse our collection and add books to your wishlist.
                                            </p>
                                            <Button className="mt-4" asChild>
                                                <Link to="/books">Browse Books</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {user.wishlist.map((book) => (
                                            <Card key={book.id}>
                                                <div className="flex items-start space-x-4 p-4">
                                                    <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                        <img
                                                            src={book.cover || "/placeholder.svg"}
                                                            alt={book.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <Link to={`/books/${book.id}`} className="font-medium hover:underline">
                                                                {book.title}
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground">{book.author}</p>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <p className="font-medium">${book.price.toFixed(2)}</p>
                                                            <div className="flex space-x-2">
                                                                <Button size="sm" onClick={() => handleAddToCart(book)}>
                                                                    Add to Cart
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(book.id)}>
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
                                    <p className="text-muted-foreground">Manage your payment methods.</p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Saved Payment Methods</CardTitle>
                                        <CardDescription>Your saved credit and debit cards.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-lg border p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Visa ending in 4242</p>
                                                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button>Add Payment Method</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Email Notifications</CardTitle>
                                        <CardDescription>Manage your email notification preferences.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Email notification settings would go here */}
                                        <p className="text-sm text-muted-foreground">
                                            Email notification settings are currently unavailable.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>Change your password.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="current-password">Current Password</Label>
                                                <Input id="current-password" type="password" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <Input id="new-password" type="password" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input id="confirm-password" type="password" />
                                            </div>
                                            <Button>Change Password</Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-red-500">Danger Zone</CardTitle>
                                        <CardDescription>
                                            Once you delete your account, there is no going back. Please be certain.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="destructive">Delete Account</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}