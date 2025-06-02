import { useState, useEffect, useRef } from "react"
import { BookOpen, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import axios from "axios"

export default function Dashboard() {
    const canvasRef = useRef(null)

    const [books, setBooks] = useState([])
    const [orders, setOrders] = useState([])
    const [bookGrowth] = useState(12.5)
    const [orderGrowth] = useState(8.2)
    const [revenueGrowth] = useState(-2.3)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                let bookRes = { data: { data: [] } };
                let orderRes = { data: { data: [] } };
                try {
                    bookRes = await axios.get("https://bookcompass.onrender.com/api/books/getBook/myBooks", config);
                } catch {
                    bookRes = { data: { data: [] } };
                }
                try {
                    orderRes = await axios.get("https://bookcompass.onrender.com/api/order/getOrder", config);
                } catch {
                    orderRes = { data: { data: [] } };
                }

                setBooks(Array.isArray(bookRes.data?.data) ? bookRes.data.data : [])
                setOrders(Array.isArray(orderRes.data?.data) ? orderRes.data.data : [])
            } catch (error) {
                setBooks([])
                setOrders([])
                console.error("Failed to fetch dashboard data", error)
            }
        }
        fetchData()
    }, [])

    const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.total || 0), 0) : 0

    const calculateMonthlySales = (orders) => {
        const currentDate = new Date()
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthlySales = Array(6).fill(0)
        const months = []

        for (let i = 5; i >= 0; i--) {
            const month = new Date(currentDate)
            month.setMonth(currentDate.getMonth() - i)
            months.push(monthNames[month.getMonth()])
        }

        (Array.isArray(orders) ? orders : []).forEach((order) => {
            const orderDate = new Date(order.date)
            const monthDiff =
                currentDate.getMonth() - orderDate.getMonth() +
                (currentDate.getFullYear() - orderDate.getFullYear()) * 12

            if (monthDiff >= 0 && monthDiff < 6) {
                monthlySales[5 - monthDiff] += order.total || 0
            }
        })

        return { months, sales: monthlySales }
    }

    const getTopSellingBooks = (books) => {
        return (Array.isArray(books) ? books : [])
            .sort((a, b) => {
                const aSales = a.stock > 0 ? (100 - a.stock) * a.price : 0
                const bSales = b.stock > 0 ? (100 - b.stock) * b.price : 0
                return bSales - aSales
            })
            .slice(0, 5)
            .map((book) => ({
                id: book.id || book._id,
                title: book.title,
                author: book.author,
                sales: Math.floor(Math.random() * 1000) + 500,
                image: book.image,
            }))
    }

    const { months, sales } = calculateMonthlySales(orders)
    const topSellingBooks = getTopSellingBooks(books)

    useEffect(() => {
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        const width = canvasRef.current.width
        const height = canvasRef.current.height
        const padding = 40
        const chartWidth = width - padding * 2
        const chartHeight = height - padding * 2

        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.strokeStyle = "#e2e8f0"
        ctx.stroke()

        const maxSale = Math.max(...sales) * 1.1
        const xStep = chartWidth / (months.length - 1)
        const yScale = chartHeight / maxSale

        ctx.font = "12px sans-serif"
        ctx.fillStyle = "#64748b"
        ctx.textAlign = "right"
        for (let i = 0; i <= 5; i++) {
            const y = height - padding - (i * chartHeight) / 5
            const value = Math.round((i * maxSale) / 5)
            ctx.fillText(`$${value}`, padding - 10, y + 4)

            ctx.beginPath()
            ctx.moveTo(padding, y)
            ctx.lineTo(width - padding, y)
            ctx.strokeStyle = "#e2e8f0"
            ctx.stroke()
        }

        ctx.textAlign = "center"
        months.forEach((month, i) => {
            const x = padding + i * xStep
            ctx.fillText(month, x, height - padding + 20)
        })

        ctx.beginPath()
        sales.forEach((sale, i) => {
            const x = padding + i * xStep
            const y = height - padding - sale * yScale
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        sales.forEach((sale, i) => {
            const x = padding + i * xStep
            const y = height - padding - sale * yScale
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fillStyle = "#3b82f6"
            ctx.fill()
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 2
            ctx.stroke()
        })

        ctx.beginPath()
        sales.forEach((sale, i) => {
            const x = padding + i * xStep
            const y = height - padding - sale * yScale
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.lineTo(padding + (months.length - 1) * xStep, height - padding)
        ctx.lineTo(padding, height - padding)
        ctx.closePath()
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
        ctx.fill()
    }, [months, sales])

    return (
        <div className="space-y-6">
            {/* STAT CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{books.length.toLocaleString()}</div>
                        {books.length === 0 && <p className="text-xs text-gray-500">No books found.</p>}
                        <p className="text-xs text-gray-500">
                            <span className={`flex items-center ${bookGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {bookGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {bookGrowth >= 0 ? "+" : ""}
                                {bookGrowth}%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length.toLocaleString()}</div>
                        {orders.length === 0 && <p className="text-xs text-gray-500">No orders found.</p>}
                        <p className="text-xs text-gray-500">
                            <span className={`flex items-center ${orderGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {orderGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {orderGrowth >= 0 ? "+" : ""}
                                {orderGrowth}%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-gray-500">
                            <span className={`flex items-center ${revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {revenueGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {revenueGrowth >= 0 ? "+" : ""}
                                {revenueGrowth}%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* CHART & TOP SELLING */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <canvas ref={canvasRef} width={500} height={250} className="w-full h-full" />
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top Selling Books</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topSellingBooks.map((book) => (
                            <div key={book.id} className="flex items-center space-x-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={book.image} />
                                    <AvatarFallback>{book.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{book.title}</p>
                                    <p className="text-xs text-gray-500">{book.author}</p>
                                </div>
                                <div className="text-sm font-semibold">{book.sales.toLocaleString()} sales</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
