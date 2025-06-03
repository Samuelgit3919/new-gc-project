import { useEffect, useState, useContext, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Book, CreditCard, LogOut, Package, Settings, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import Layout from "../../Layout"
import axios from "axios"
import { DataContext } from "@/DataProvider/DataProvider"
import { Type } from "@/Utility/action.type"
import { toast } from "react-hot-toast"

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const navigate = useNavigate()
    const [users, setUser] = useState({})
    const [userContext, dispatch] = useContext(DataContext);
    // Prefer context user, fallback to API user
    const displayUser = userContext?.user || users || {};
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(true);
    const [wishlistError, setWishlistError] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const deleteButtonRef = useRef();

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    })
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const id = userData._id || (userData.data && userData.data._id);

    // if (!id) {
    //     console.error("No user ID found - redirecting to login");
    //     navigate("/login");
    //     return;
    // }

    // order useEffect
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token || !id) {
                    setOrders([]);
                    return;
                }

                const response = await axios.get(`https://bookcompass.onrender.com/api/order/getOrder`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const userOrders = response.data?.orders?.filter(order => order.id === id) || [];
                setOrders(userOrders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [id]);

    // user useEffect
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated");
                const res = await fetch("https://bookcompass.onrender.com/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUser(data.data || data);
            } catch {
                setUser({});
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch wishlist for the user
    useEffect(() => {
        const fetchWishlist = async () => {
            setWishlistLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setWishlist([]);
                    return;
                }
                const res = await fetch("https://bookcompass.onrender.com/api/wishlist", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch wishlist");
                const data = await res.json();
                setWishlist(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.error("Failed to load wishlist", err);
                setWishlist([]);
            } finally {
                setWishlistLoading(false);
            }
        };
        fetchWishlist();
    }, [id]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("User not authenticated");
            return;
        }
        const updatedProfile = {
            name,
            email,
            phone,
        };
        try {
            const response = await fetch("https://bookcompass.onrender.com/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProfile),
            });
            if (response.ok) {
                const result = await response.json();
                // Update local storage and context
                localStorage.setItem("user", JSON.stringify(result.data));
                setUser(result.data);
                dispatch({
                    type: Type.SET_USER,
                    user: result.data,
                });
                toast.success("Profile updated successfully");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error(error.message || "Error updating profile");
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not authenticated");
            return;
        }
        const updatedAddress = {
            address: {
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country,
            },
        };
        try {
            const response = await fetch("https://bookcompass.onrender.com/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedAddress),
            });
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem("user", JSON.stringify(result.data));
                setUser(result.data);
                alert("Address updated successfully");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update address");
            }
        } catch (error) {
            alert(error.message || "Error updating address");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    }

    if (!displayUser) {
        return <div className="p-8 text-center">Loading user data...</div>;
    }

    // Orders: filter by user id (if needed)
    const userOrders = Array.isArray(orders) ? orders.filter(order => order.userId === id) : [];

    // Wishlist actions
    const handleRemoveFromWishlist = async (bookId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");
            const res = await fetch(`https://bookcompass.onrender.com/api/wishlist/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to remove from wishlist");
            setWishlist(wishlist.filter(item => item._id !== bookId));
            alert("Removed from wishlist");
        } catch (err) {
            alert(err.message || "Failed to remove from wishlist");
        }
    };
    const handleAddToCart = (book) => {
        dispatch({
            type: Type.ADD_TO_BASKET,
            item: {
                id: book._id || book.id,
                title: book.title,
                price: book.price,
                imageUrl: book.imageUrl || book.cover,
                amount: 1,
                type: book.type || "textbook",
            },
        });
        alert(`${book.title} added to cart`);
    };

    // Change password handler
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");
        
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError("Please fill in all fields");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }
        
        setPasswordLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");
            
            const res = await fetch(`https://bookcompass.onrender.com/api/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });
            
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to change password");
            }
            
            setPasswordSuccess("Password changed successfully");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Password changed successfully");
        } catch (err) {
            setPasswordError(err.message || "Failed to change password");
            toast.error(err.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };
    // Delete account handler
    const handleDeleteAccount = async () => {
        setDeleteError("");
        setDeleteSuccess("");
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");
            
            const res = await fetch(`https://bookcompass.onrender.com/api/users/me`, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete account");
            }
            
            setDeleteSuccess("Account deleted successfully");
            toast.success("Account deleted successfully");
            
            // Clear all local storage and context
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch({
                type: Type.SET_USER,
                user: null,
            });
            
            // Redirect after a short delay
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            setDeleteError(err.message || "Failed to delete account");
            toast.error(err.message || "Failed to delete account");
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
        }
    };
    // Settings input change
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

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
                                    <p className="font-medium">{displayUser?.name || "User"}</p>
                                    <p className="text-sm text-muted-foreground">{displayUser?.email || "No email"}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Button variant={activeTab === "profile" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </Button>
                                <Button variant={activeTab === "orders" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("orders")}>
                                    <Package className="mr-2 h-4 w-4" /> Orders
                                </Button>
                                <Button variant={activeTab === "wishList" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("wishlist")}>
                                    <Book className="mr-2 h-4 w-4" /> Wishlist
                                </Button>
                                <Button variant={activeTab === "payment" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("payment")}>
                                    <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                                </Button>
                                <Button variant={activeTab === "settings" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("settings")}>
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
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
                                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
                                                    <Input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-3">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="state">State</Label>
                                                        <Input id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="zip">ZIP Code</Label>
                                                        <Input id="zip" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="country">Country</Label>
                                                    <Input id="country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
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

                                {loading ? (
                                    <p>Loading orders...</p>
                                ) : userOrders.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                            <Package className="h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                When you make a purchase, your orders will appear here.
                                            </p>
                                            <Button className="mt-4" asChild>
                                                <Link to="/books">Browse Books</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {userOrders.map((order) => (
                                            <Card key={order._id}>
                                                <CardHeader className="pb-2">
                                                    <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                                                        <div>
                                                            <CardTitle className="text-base">Order #{order._id}</CardTitle>
                                                            <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
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
                                                        <Link to={`/account/orders/${order._id}`}>View Details</Link>
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
                                )}
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
                                    <p className="text-muted-foreground">Books you've saved for later.</p>
                                </div>
                                {wishlistLoading ? (
                                    <p>Loading wishlist...</p>
                                ) : wishlistError ? (
                                    <p className="text-red-500">{wishlistError}</p>
                                ) : wishlist.length === 0 ? (
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
                                        {wishlist.map((book) => (
                                            <Card key={book._id || book.id}>
                                                <div className="flex items-start space-x-4 p-4">
                                                    <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                        <img
                                                            src={book.imageUrl || book.cover || "/placeholder.svg"}
                                                            alt={book.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <Link to={`/books/${book._id || book.id}`} className="font-medium hover:underline">
                                                                {book.title}
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground">{book.author}</p>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <p className="font-medium">${book.price?.toFixed(2) || "N/A"}</p>
                                                            <div className="flex space-x-2">
                                                                <Button size="sm" onClick={() => handleAddToCart(book)}>
                                                                    Add to Cart
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(book._id || book.id)}>
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
                                        <form className="space-y-4" onSubmit={handleChangePassword}>
                                            {passwordError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{passwordError}</div>}
                                            {passwordSuccess && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">{passwordSuccess}</div>}
                                            <div className="grid gap-2">
                                                <Label htmlFor="current-password">Current Password</Label>
                                                <Input id="current-password" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordInputChange} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <Input id="new-password" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordInputChange} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input id="confirm-password" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordInputChange} />
                                            </div>
                                            <Button type="submit" disabled={passwordLoading}>{passwordLoading ? "Changing..." : "Change Password"}</Button>
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
                                        {deleteError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-2">{deleteError}</div>}
                                        {deleteSuccess && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mb-2">{deleteSuccess}</div>}
                                        <Button variant="destructive" ref={deleteButtonRef} onClick={() => setDeleteDialogOpen(true)} disabled={deleteLoading}>
                                            {deleteLoading ? "Deleting..." : "Delete Account"}
                                        </Button>
                                        {deleteDialogOpen && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg max-w-sm w-full">
                                                    <h2 className="text-lg font-bold mb-2 text-red-600">Confirm Account Deletion</h2>
                                                    <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>Cancel</Button>
                                                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Yes, Delete"}</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout >
    )
}