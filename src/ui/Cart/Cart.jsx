import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Layout from "../../Layout"
import axios from "axios"

export default function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("token") // Adjust if you're storing token under a different key
                if (!token) {
                    throw new Error("No token found")
                }

                const response = await axios.get("https://bookcompass.onrender.com/api/cart/getCart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                console.log(response)

                setCartItems(response.data.cartItems || []) // Adjust key based on actual API structure
                setLoading(false)
            } catch (err) {
                console.error("Failed to fetch cart:", err)
                setError(err.response?.data?.message || err.message)
                setLoading(false)
            }
        }

        fetchCart()
    }, [])

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = cartItems.length > 0 ? 4.99 : 0
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const handleUpdateQuantity = (id, change) => {
        setCartItems(
            cartItems.map((item) =>
                item._id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        )
    }

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter((item) => item._id !== id))
        console.log("Item removed from cart")
    }

    const handleClearCart = () => {
        setCartItems([])
        console.log("Cart cleared")
    }

    return (
        <Layout>
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/Textbooks">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <p>Loading cart...</p>
                ) : error ? (
                    <p className="text-red-500">Error loading cart: {error}</p>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="md:col-span-1 lg:col-span-2">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                                    <p className="text-muted-foreground">
                                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                                    </p>
                                </div>

                                {cartItems.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Looks like you haven't added any books to your cart yet.
                                            </p>
                                            <Button className="mt-4" asChild>
                                                <Link to="/ui/Textbooks">Browse Textbooks</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle>Cart Items</CardTitle>
                                            <Button variant="ghost" size="sm" onClick={handleClearCart}>
                                                Clear Cart
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {cartItems.map((item) => (
                                                    <div key={item._id} className="flex gap-4">
                                                        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                            <img
                                                                src={item.cover || "/placeholder.svg"}
                                                                alt={item.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div>
                                                                <Link to={`/ui/books/${item._id}`} className="font-medium hover:underline">
                                                                    {item.title}
                                                                </Link>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.author} • {item.format}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleUpdateQuantity(item._id, -1)}
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </Button>
                                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleUpdateQuantity(item._id, 1)}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                                <div className="flex items-center space-x-4">
                                                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleRemoveItem(item._id)}
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span>${shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" disabled={cartItems.length === 0} asChild>
                                            <Link to="/ui/checkout">Proceed to Checkout</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Have a Promo Code?</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            />
                                            <Button variant="outline">Apply</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
