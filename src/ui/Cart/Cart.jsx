import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Layout from "../../Layout"
import { DataContext } from "../../DataProvider/DataProvider"
import { Type } from "../../Utility/action.type"

export default function CartPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [{ basket }, dispatch] = useContext(DataContext)

    console.log({ basket })

    useEffect(() => {
        setLoading(false) // No API calls, so loading is complete
    }, [])

    const increment = (item) => {
        dispatch({
            type: Type.ADD_TO_BASKET,
            item: {
                id: item.id,
                title: item.title,
                author: item.author,
                img: item.img,
                format: item.format,
                quantity: 1,
                price: parseFloat(item.price) || 0,
                description: item.description,
            },
        })
    }

    const decrement = (id) => {
        dispatch({
            type: Type.REMOVE_FROM_BASKET,
            id,
        })
    }

    const removeItem = (id) => {
        dispatch({
            type: Type.REMOVE_ITEM,
            id,
        })
    }

    const handleClearCart = () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) return
        dispatch({
            type: Type.CLEAR_BASKET,
        })
    }

    const subtotal = basket.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.amount || 1), 0)
    const shipping = basket.length > 0 ? 4.99 : 0
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

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
                    <p className="text-red-500">Error: {error}</p>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="md:col-span-1 lg:col-span-2">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                                    <p className="text-muted-foreground">
                                        {basket.length} {basket.length === 1 ? "item" : "items"} in your cart
                                    </p>
                                </div>

                                {basket.length === 0 ? (
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
                                                {basket.map((item) => (
                                                    <div key={item.id} className="flex gap-4">
                                                        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                            <img
                                                                src={item.img || "/placeholder.svg"}
                                                                alt={item.title || "Book image"}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div>
                                                                <Link to={`/ui/books/${item.id}`} className="font-medium hover:underline">
                                                                    {item.title || "Untitled"}
                                                                </Link>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.author || "Unknown"} • {item.format || "Unknown"}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Price: ${(parseFloat(item.price) || 0).toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => decrement(item.id)}
                                                                        disabled={(item.amount || 1) <= 1}
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </Button>
                                                                    <span className="w-8 text-center">{item.amount || 1}</span>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => increment(item)}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                                <div className="flex items-center space-x-4">
                                                                    <p className="font-medium">
                                                                        ${((parseFloat(item.price) || 0) * (item.amount || 1)).toFixed(2)}
                                                                    </p>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => removeItem(item.id)}
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
                                        <Button className="w-full" disabled={basket.length === 0} asChild>
                                            <Link to="/chapaCheckout">Proceed to Checkout</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}