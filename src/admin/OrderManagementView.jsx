"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import OrderDetailsDialog from "./OrderDetailsDialog"
import { getStatusColor, toggleFilter, clearFilters } from "../admin/utils/helpers"
import { toast } from "sonner"

const API_BASE_URL = "https://bookcompass.onrender.com/api/order"

function OrderManagementView({ searchQuery, setSearchQuery }) {
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [activeFilters, setActiveFilters] = useState({ statuses: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const itemsPerPage = 5

    // Fetch orders from API
    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        if (!token) {
            setError("Authentication required. Please log in.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch("https://bookcompass.onrender.com/api/order/getOrder", { // Changed endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })


            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to fetch orders")
            }

            const data = await response.json()
            console.log(data)

            // Transform the API response to match our frontend structure
            const formattedOrders = data.map(order => ({
                id: order._id,
                customer: order.user?.name || "Unknown Customer",
                email: order.user?.email || "No email",
                date: new Date(order.createdAt).toLocaleDateString(),
                items: order.items?.length || 0,
                total: order.totalPrice || 0,
                status: order.status || "pending",
                books: order.items || [],
                shippingAddress: order.shippingAddress || {}
            }))

            setOrders(formattedOrders)
            setFilteredOrders(formattedOrders)
        } catch (err) {
            console.error("Fetch error:", err)
            setError(err.message || "Failed to load orders")
            toast.error(err.message || "Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    // Update order status in backend
    const updateOrderStatus = async (orderId, newStatus) => {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Authentication required. Please log in.")
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to update order status")
            }

            const updatedOrder = await response.json()

            // Update local state
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ))

            toast.success("Order status updated successfully!")
            return updatedOrder
        } catch (err) {
            console.error("Update error:", err)
            toast.error(err.message || "Failed to update order status")
            throw err
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchOrders()
    }, [])

    // Get unique statuses for filters
    const statuses = Array.from(new Set(orders.map((order) => order.status)))

    // Apply filters and search
    useEffect(() => {
        let result = [...orders]

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (order) =>
                    order.id.toLowerCase().includes(query) ||
                    order.customer.toLowerCase().includes(query) ||
                    order.email.toLowerCase().includes(query),
            )
        }

        // Apply status filters
        if (activeFilters.statuses.length > 0) {
            result = result.filter((order) => activeFilters.statuses.includes(order.status))
        }

        setFilteredOrders(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [orders, searchQuery, activeFilters])

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const indexOfLastOrder = currentPage * itemsPerPage
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    const handleViewOrder = (order) => {
        setSelectedOrder(order)
        setIsViewDialogOpen(true)
    }

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus)
            setIsViewDialogOpen(false)
        } catch (err) {
            console.error("Status update failed:", err)
        }
    }

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center h-64 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchOrders}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <Button variant="outline" onClick={fetchOrders}>
                    Refresh Orders
                </Button>
            </div>

            {/* Search and Filter section remains the same */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* ... existing search and filter code ... */}
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div>
                                            <p>{order.customer}</p>
                                            <p className="text-sm text-gray-500">{order.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.items}</TableCell>
                                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)} variant="outline">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No orders found matching your criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination remains the same */}
            {filteredOrders.length > 0 && (
                <div className="flex items-center justify-between">
                    {/* ... existing pagination code ... */}
                </div>
            )}

            <OrderDetailsDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                order={selectedOrder}
                onUpdateStatus={handleUpdateOrderStatus}
            />
        </div>
    )
}

export default OrderManagementView