"use client"

import { useRef, useEffect } from "react"
import { BookOpen, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

interface Book {
    id: number
    title: string
    author: string
    image: string
    sales: number
}

interface DashboardViewProps {
    books: any[]
    orders: any[]
    users: any[]
    bookGrowth: number
    orderGrowth: number
    userGrowth: number
    revenueGrowth: number
    calculateMonthlySales: () => { months: string[]; sales: number[] }
    getTopSellingBooks: () => Book[]
}

export default function DashboardView({
    books,
    orders,
    users,
    bookGrowth,
    orderGrowth,
    userGrowth,
    revenueGrowth,
    calculateMonthlySales,
    getTopSellingBooks,
}: DashboardViewProps) {
    const canvasRef = useRef < HTMLCanvasElement > (null)
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const { months, sales } = calculateMonthlySales()

    // Chart rendering
    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Set dimensions
        const width = canvasRef.current.width
        const height = canvasRef.current.height
        const padding = 40
        const chartWidth = width - padding * 2
        const chartHeight = height - padding * 2

        // Draw axes
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.strokeStyle = "#e2e8f0"
        ctx.stroke()

        // Calculate scales
        const maxSale = Math.max(...sales) * 1.1
        const xStep = chartWidth / (months.length - 1)
        const yScale = chartHeight / maxSale

        // Draw grid lines and labels
        ctx.font = "12px sans-serif"
        ctx.fillStyle = "#64748b"
        ctx.textAlign = "right"

        // Y-axis labels and grid lines
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

        // X-axis labels
        ctx.textAlign = "center"
        months.forEach((month, i) => {
            const x = padding + i * xStep
            ctx.fillText(month, x, height - padding + 20)
        })

        // Draw line chart
        ctx.beginPath()
        sales.forEach((sale, i) => {
            const x = padding + i * xStep
            const y = height - padding - sale * yScale

            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw points
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

        // Draw area under the line
        ctx.beginPath()
        sales.forEach((sale, i) => {
            const x = padding + i * xStep
            const y = height - padding - sale * yScale

            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.lineTo(padding + (months.length - 1) * xStep, height - padding)
        ctx.lineTo(padding, height - padding)
        ctx.closePath()
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
        ctx.fill()
    }, [months, sales])

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{books.length.toLocaleString()}</div>
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
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length.toLocaleString()}</div>
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
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">
                            <span className={`flex items-center ${userGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {userGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {userGrowth >= 0 ? "+" : ""}
                                {userGrowth}%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-gray-500">
                            <span className={`flex items-center ${revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {revenueGrowth >= 0 ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {revenueGrowth >= 0 ? "+" : ""}
                                {revenueGrowth}%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-64">
                            <canvas ref={canvasRef} width={500} height={250} className="w-full h-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top Selling Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {getTopSellingBooks().map((book) => (
                                <div key={book.id} className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 rounded-sm">
                                        <AvatarImage src={book.image || "/placeholder.svg"} alt={book.title} />
                                        <AvatarFallback className="rounded-sm">{book.title.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{book.title}</p>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                    </div>
                                    <div className="text-sm font-medium">{book.sales} sold</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
