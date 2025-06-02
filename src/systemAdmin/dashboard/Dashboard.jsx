"use client"

import { useState, useEffect } from "react"
import { Users, User, Building2, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { PieChart, Pie, Cell, Legend } from "recharts"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview")
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem("token")
                const res = await fetch("https://bookcompass.onrender.com/api/admin/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) throw new Error("Failed to fetch dashboard data")
                const data = await res.json()
                console.log(data)
                setDashboardData(data.data || data)
            } catch (err) {
                setError(err.message || "Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    // Fallbacks for data structure
    const totalUsers = dashboardData?.totalUsers || 0
    const totalReaders = dashboardData?.totalBuyers || 0
    const totalBookstores = dashboardData?.totalSellers || 0
    const totalProducts = dashboardData?.totalProducts || 0
    const monthlyData = dashboardData?.monthlyData || []
    const productCategories = dashboardData?.productCategories || []
    const recentSales = dashboardData?.recentSales || []
    const recentActivity = dashboardData?.recentActivity || []
    const trafficSources = dashboardData?.trafficSources || []

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {loading && <div className="text-center py-8">Loading dashboard...</div>}
            {error && <div className="text-center text-red-500 py-8">{error}</div>}

            {/* Overview Analysis Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSales.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div> */}

            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+2.5%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Readers</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReaders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+9.1%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookstores</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookstores}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+2.5%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+15%</span> from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>User Breakdown</CardTitle>
                                <CardDescription>Distribution of users by type: Readers vs Bookstores</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        totalReaders: { label: "Readers", color: "#14b8a6" },
                                        totalBookstores: { label: "Bookstores", color: "#0891b2" },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyData}>
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="readers" fill="#14b8a6" />
                                            <Bar dataKey="bookstores" fill="#0891b2" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Products Overview</CardTitle>
                                <CardDescription>Summary of products by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {productCategories.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-muted-foreground">{category.count.toLocaleString()}</span>
                                                <span className="text-sm font-medium">{category.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* recent sales section */}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>Latest transactions across your platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentSales.map((sale) => (
                                        <div key={sale.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {sale.customer
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{sale.customer}</p>
                                                    <p className="text-xs text-muted-foreground">{sale.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium">+${sale.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest actions taken on the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-teal-500 mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{activity.type}</p>
                                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Monthly User Growth</CardTitle>
                                <CardDescription>New user registrations over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ChartContainer
                                    config={{
                                        readers: { label: "Buyers", color: "#14b8a6" },
                                        bookstores: { label: "Sellers", color: "#0891b2" },
                                    }}
                                    className="h-[250px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyData}>
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="readers" fill="#14b8a6" name="Buyers" />
                                            <Bar dataKey="bookstores" fill="#0891b2" name="Sellers" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Traffic Sources</CardTitle>
                                <CardDescription>Where your users are coming from</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {trafficSources.length > 0 ? (
                                    <ChartContainer
                                        config={{}}
                                        className="h-[250px]"
                                    >
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={trafficSources} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={80} label>
                                                    {trafficSources.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={['#14b8a6', '#0891b2', '#f59e42', '#6366f1', '#f43f5e'][index % 5]} />
                                                    ))}
                                                </Pie>
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">No traffic data</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
