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

function OrderManagementView({ orders, setOrders, searchQuery, setSearchQuery }) {
    const [filteredOrders, setFilteredOrders] = useState(orders)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [activeFilters, setActiveFilters] = useState({
        statuses: [],
    })

    const itemsPerPage = 5

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

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
        setOrders(updatedOrders)
        setIsViewDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Order Management</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search orders..."
                        className="w-full pl-8 bg-white dark:bg-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    {activeFilters.statuses.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearFilters("orders", setActiveFilters, setSearchQuery)}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={activeFilters.statuses.includes(status)}
                                    onCheckedChange={() => toggleFilter("statuses", status, activeFilters, setActiveFilters)}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
                                    <TableCell className="font-medium">{order.id}</TableCell>
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

            {filteredOrders.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <strong>{indexOfFirstOrder + 1}</strong> to{" "}
                        <strong>{Math.min(indexOfLastOrder, filteredOrders.length)}</strong> of{" "}
                        <strong>{filteredOrders.length}</strong> orders
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = i + 1
                            if (totalPages > 5) {
                                if (currentPage > 3) {
                                    pageNum = currentPage - 3 + i
                                }
                                if (pageNum > totalPages) {
                                    pageNum = totalPages - (4 - i)
                                }
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "outline" : "ghost"}
                                    size="sm"
                                    className={currentPage === pageNum ? "font-medium" : ""}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button>
                    </div>
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
