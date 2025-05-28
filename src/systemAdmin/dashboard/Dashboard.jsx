"use client"

import { useState } from "react"
import { Users, User, Building2, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const monthlyData = [
    { month: "Jan", readers: 180, bookstores: 25 },
    { month: "Feb", readers: 220, bookstores: 32 },
    { month: "Mar", readers: 280, bookstores: 38 },
    { month: "Apr", readers: 320, bookstores: 45 },
    { month: "May", readers: 380, bookstores: 52 },
    { month: "Jun", readers: 420, bookstores: 58 },
    { month: "Jul", readers: 480, bookstores: 65 },
    { month: "Aug", readers: 520, bookstores: 72 },
]

const productCategories = [
    { name: "Fiction", count: 5400, percentage: 44 },
    { name: "Non-Fiction", count: 3200, percentage: 26 },
    { name: "Children's", count: 2100, percentage: 17 },
    { name: "Educational", count: 1534, percentage: 13 },
]

const recentSales = [
    { id: 1, customer: "John Doe", email: "john.doe@example.com", amount: 249.0 },
    { id: 2, customer: "Jane Lane", email: "jane.lane@example.com", amount: 149.0 },
    { id: 3, customer: "Sarah Davis", email: "sarah.davis@example.com", amount: 299.0 },
    { id: 4, customer: "Robert Wilson", email: "robert.wilson@example.com", amount: 399.0 },
    { id: 5, customer: "Emily Moore", email: "emily.moore@example.com", amount: 199.0 },
]

const recentActivity = [
    { id: 1, type: "Product updated", description: "Product ID: #P001", time: "10 min ago" },
    { id: 2, type: "New user registered", description: "User ID: #U002", time: "20 min ago" },
    { id: 3, type: "Product updated", description: "Product ID: #P003", time: "30 min ago" },
    { id: 4, type: "New user registered", description: "User ID: #U004", time: "40 min ago" },
    { id: 5, type: "Product updated", description: "Product ID: #P005", time: "50 min ago" },
]

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview")
    const totalUsers = 2853
    const totalReaders = 2345
    const totalBookstores = 508
    const totalProducts = 12234

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
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
                                        readers: { label: "Readers", color: "#14b8a6" },
                                        bookstores: { label: "Bookstores", color: "#0891b2" },
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
                            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Monthly growth chart will appear here
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Traffic Sources</CardTitle>
                                <CardDescription>Where your users are coming from</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Traffic sources chart will appear here
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
