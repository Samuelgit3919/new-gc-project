"use client"

import { Search, X, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

interface OrderManagementViewProps {
    orders: any[]
    filteredOrders: any[]
    currentOrders: any[]
    searchQuery: string
    setSearchQuery: (query: string) => void
    orderActiveFilters: {
        statuses: string[]
    }
    orderStatuses: string[]
    orderCurrentPage: number
    setOrderCurrentPage: (page: number) => void
    orderTotalPages: number
    orderIndexOfFirstItem: number
    orderIndexOfLastItem: number
    handleViewOrder: (order: any) => void
    toggleFilter: (filterType: string, filterValue: string, filterState: any, setFilterState: any) => void
    clearFilters: (setFilterState: any) => void
    setOrderActiveFilters: (filters: any) => void
    getStatusColor: (status: string) => string
}

export default function OrderManagementView({
    orders,
    filteredOrders,
    currentOrders,
    searchQuery,
    setSearchQuery,
    orderActiveFilters,
    orderStatuses,
    orderCurrentPage,
    setOrderCurrentPage,
    orderTotalPages,
    orderIndexOfFirstItem,
    orderIndexOfLastItem,
    handleViewOrder,
    toggleFilter,
    clearFilters,
    setOrderActiveFilters,
    getStatusColor,
}: OrderManagementViewProps) {
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
                    {orderActiveFilters.statuses.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => clearFilters(setOrderActiveFilters)}>
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
                            {orderStatuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={orderActiveFilters.statuses.includes(status)}
                                    onCheckedChange={() => toggleFilter("statuses", status, orderActiveFilters, setOrderActiveFilters)}
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
                        Showing <strong>{orderIndexOfFirstItem + 1}</strong> to{" "}
                        <strong>{Math.min(orderIndexOfLastItem, filteredOrders.length)}</strong> of{" "}
                        <strong>{filteredOrders.length}</strong> orders
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOrderCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={orderCurrentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>

                        {Array.from({ length: Math.min(5, orderTotalPages) }, (_, i) => {
                            let pageNum = i + 1
                            if (orderTotalPages > 5) {
                                if (orderCurrentPage > 3) {
                                    pageNum = orderCurrentPage - 3 + i
                                }
                                if (pageNum > orderTotalPages) {
                                    pageNum = orderTotalPages - (4 - i)
                                }
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={orderCurrentPage === pageNum ? "outline" : "ghost"}
                                    size="sm"
                                    className={orderCurrentPage === pageNum ? "font-medium" : ""}
                                    onClick={() => setOrderCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOrderCurrentPage((prev) => Math.min(orderTotalPages, prev + 1))}
                            disabled={orderCurrentPage === orderTotalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
