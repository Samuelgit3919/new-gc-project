import { useState, useEffect } from "react"
import { Plus, Search, Filter, X, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ManagementView({
    activeView,
    books,
    setBooks,
    orders,
    setOrders,
    settings,
    setSettings,
    searchQuery,
    setSearchQuery,
}) {
    // Common state
    const [currentPage, setCurrentPage] = useState(1)
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        statuses: [],
        roles: [],
    })

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [deletingItemId, setDeletingItemId] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)

    // Form states
    const [formData, setFormData] = useState({})
    const [settingsFormData, setSettingsFormData] = useState(settings)

    const itemsPerPage = 5

    // API endpoints
    const API_BASE_URL = "https://bookcompass.onrender.com/api/books"

    // Fetch books from API
    const fetchBooks = async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        try {
            const res = await fetch(`${API_BASE_URL}/getBook/myBooks`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error("Failed to fetch books")
            const data = await res.json()
            console.log(data)
            setBooks(Array.isArray(data.data) ? data.data : [])
        } catch {
            setBooks([])
        }
    }

    const fetchOrders = async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        try {
            const res = await fetch(`https://bookcompass.onrender.com/api/order/getOrder`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error("Failed to fetch orders")
            const data = await res.json()
            console.log(data.data)
            setOrders(Array.isArray(data.data) ? data.data : [])
        } catch {
            setOrders([])
        }
    }

    useEffect(() => {
        if (activeView === "books") fetchBooks()
        if (activeView === "orders") fetchOrders()
    }, [activeView])

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Low Stock":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "Out of Stock":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "Completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Processing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "Shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            case "Cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Inactive":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        }
    }

    const toggleFilter = (filterType, filterValue) => {
        setActiveFilters((prev) => {
            const filters = prev[filterType].includes(filterValue)
                ? prev[filterType].filter((f) => f !== filterValue)
                : [...prev[filterType], filterValue]
            return { ...prev, [filterType]: filters }
        })
    }

    const clearFilters = () => {
        if (activeView === "books") {
            setActiveFilters({ categories: [], statuses: [], roles: [] })
        } else if (activeView === "orders") {
            setActiveFilters({ categories: [], statuses: [], roles: [] })
        } else if (activeView === "users") {
            setActiveFilters({ categories: [], statuses: [], roles: [] })
        }
        setSearchQuery("")
    }

    // Get current data based on active view
    const getCurrentData = () => {
        switch (activeView) {
            case "books":
                return books
            case "orders":
                return orders
            default:
                return []
        }
    }

    // Filter data based on search and filters
    const getFilteredData = () => {
        let data = getCurrentData()

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            data = data.filter((item) => {
                if (activeView === "books") {
                    return (
                        item.title.toLowerCase().includes(query) ||
                        item.author.toLowerCase().includes(query) ||
                        item.isbn.toLowerCase().includes(query) ||
                        item.category.toLowerCase().includes(query)
                    )
                } else if (activeView === "orders") {
                    return (
                        item.id.toLowerCase().includes(query) ||
                        item.customer.toLowerCase().includes(query) ||
                        item.email.toLowerCase().includes(query)
                    )
                } else if (activeView === "users") {
                    return item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query)
                }
                return true
            })
        }

        // Apply filters
        if (activeView === "books") {
            if (activeFilters.categories.length > 0) {
                data = data.filter((item) => activeFilters.categories.includes(item.category))
            }
            if (activeFilters.statuses.length > 0) {
                data = data.filter((item) => activeFilters.statuses.includes(item.status))
            }
        } else if (activeView === "orders") {
            if (activeFilters.statuses.length > 0) {
                data = data.filter((item) => activeFilters.statuses.includes(item.status))
            }
        } else if (activeView === "users") {
            if (activeFilters.roles.length > 0) {
                data = data.filter((item) => activeFilters.roles.includes(item.role))
            }
            if (activeFilters.statuses.length > 0) {
                data = data.filter((item) => activeFilters.statuses.includes(item.status))
            }
        }

        return data
    }

    const filteredData = getFilteredData()
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

    // Reset page when view changes
    useEffect(() => {
        setCurrentPage(1)
        setActiveFilters({ categories: [], statuses: [], roles: [] })
        setSearchQuery("")
    }, [activeView, setSearchQuery])

    // Form handlers
    const handleAdd = () => {
        setEditingItem(null)
        setFormData({
            title: "",
            author: "",
            isbn: "",
            category: "",
            price: 0,
            stock: 0,
            description: "",
            imgUrl: "",
            BookTypeOption: "PhysicalBook",
        })
        setIsDialogOpen(true)
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setFormData({
            title: item.title || "",
            author: item.author || "",
            isbn: item.isbn || "",
            category: item.category || "",
            price: item.price || 0,
            stock: item.stock || 0,
            description: item.description || "",
            imgUrl: item.imgUrl || "",
            BookTypeOption: item.BookTypeOption || "PhysicalBook",
        })
        setIsDialogOpen(true)
    }

    const handleDelete = (id) => {
        setDeletingItemId(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (activeView === "books") {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                await fetch(`${API_BASE_URL}/deleteBook/${deletingItemId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                })
                fetchBooks()
            } catch {
                // handle error
            }
        }
        setIsDeleteDialogOpen(false)
        setDeletingItemId(null)
    }

    const handleSave = async () => {
        if (activeView === "books") {
            let status
            if (formData.stock === 0) status = "Out of Stock"
            else if (formData.stock <= 10) status = "Low Stock"
            else status = "In Stock"

            const token = localStorage.getItem("token")
            if (!token) return

            let payload, headers, method, url
            let isEdit = Boolean(editingItem && editingItem._id)
            if (formData.file) {
                // Use FormData for file upload
                payload = new FormData()
                payload.append("title", formData.title)
                payload.append("author", formData.author)
                payload.append("isbn", formData.isbn)
                payload.append("category", formData.category)
                payload.append("price", formData.price)
                payload.append("stock", formData.stock)
                payload.append("description", formData.description)
                payload.append("imgUrl", formData.imgUrl)
                payload.append("BookTypeOption", formData.BookTypeOption)
                payload.append("status", status)
                payload.append("file", formData.file)
                headers = { Authorization: `Bearer ${token}` }
            } else {
                // No file, send JSON
                payload = JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    isbn: formData.isbn,
                    category: formData.category,
                    price: formData.price,
                    stock: formData.stock,
                    description: formData.description,
                    imgUrl: formData.imgUrl,
                    BookTypeOption: formData.BookTypeOption,
                    status: status,
                })
                headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
            if (isEdit) {
                method = "PUT"
                url = `${API_BASE_URL}/updateBook/${editingItem._id}`
            } else {
                method = "POST"
                url = `${API_BASE_URL}/createBook`
            }
            try {
                const res = await fetch(url, {
                    method,
                    headers,
                    body: payload,
                })
                if (!res.ok) throw new Error("Failed to save book")
                setIsDialogOpen(false)
                fetchBooks()
            } catch {
                // handle error (optionally show error message)
            }
        }
        setIsDialogOpen(false)
    }

    const handleViewOrder = (order) => {
        setSelectedOrder(order)
        setIsDialogOpen(true)
    }

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        setIsDialogOpen(false)
    }

    // Settings handlers
    const handleSettingsChange = (e) => {
        const { name, value } = e.target
        setSettingsFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNotificationChange = (name, checked) => {
        setSettingsFormData((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked,
            },
        }))
    }

    const handleSaveSettings = () => {
        setSettings(settingsFormData)
        alert("Settings saved successfully!")
    }

    // Get filter options
    const getFilterOptions = () => {
        const data = getCurrentData()
        if (activeView === "books") {
            return {
                categories: Array.from(new Set(data.map((item) => item.category))),
                statuses: Array.from(new Set(data.map((item) => item.status))),
            }
        } else if (activeView === "orders") {
            return {
                statuses: Array.from(new Set(data.map((item) => item.status))),
            }
        } else if (activeView === "users") {
            return {
                roles: Array.from(new Set(data.map((item) => item.role))),
                statuses: Array.from(new Set(data.map((item) => item.status))),
            }
        }
        return {}
    }

    const filterOptions = getFilterOptions()

    // Render settings view
    if (activeView === "settings") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Information</CardTitle>
                            <CardDescription>Update your bookstore details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name</Label>
                                    <Input
                                        id="storeName"
                                        name="storeName"
                                        value={settingsFormData.storeName}
                                        onChange={handleSettingsChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={settingsFormData.email}
                                        onChange={handleSettingsChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={settingsFormData.phone}
                                        onChange={handleSettingsChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        value={settingsFormData.currency}
                                        onValueChange={(value) => setSettingsFormData((prev) => ({ ...prev, currency: value }))}
                                    >
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                            <SelectItem value="gbp">GBP (£)</SelectItem>
                                            <SelectItem value="cad">CAD ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={settingsFormData.address}
                                    onChange={handleSettingsChange}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings}>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Configure which emails you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="newOrder">New Order</Label>
                                    <p className="text-sm text-gray-500">Receive an email when a new order is placed.</p>
                                </div>
                                <Switch
                                    id="newOrder"
                                    checked={settingsFormData.notifications.newOrder}
                                    onCheckedChange={(checked) => handleNotificationChange("newOrder", checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="lowStock">Low Stock Alert</Label>
                                    <p className="text-sm text-gray-500">Get notified when a book is running low on stock.</p>
                                </div>
                                <Switch
                                    id="lowStock"
                                    checked={settingsFormData.notifications.lowStock}
                                    onCheckedChange={(checked) => handleNotificationChange("lowStock", checked)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    // Render table view for books, orders, users
    return (
        <div >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {activeView === "books" && "Book Management"}
                        {activeView === "orders" && "Order Management"}
                        {activeView === "users" && "User Management"}
                    </h1>
                    {activeView === "books" && (
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            type="search"
                            placeholder={`Search ${activeView}...`}
                            className="w-full pl-8 bg-white dark:bg-gray-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        {(activeFilters.categories.length > 0 ||
                            activeFilters.statuses.length > 0 ||
                            activeFilters.roles.length > 0) && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
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
                                {activeView === "books" && (
                                    <>
                                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {filterOptions.categories?.map((category) => (
                                            <DropdownMenuCheckboxItem
                                                key={category}
                                                checked={activeFilters.categories.includes(category)}
                                                onCheckedChange={() => toggleFilter("categories", category)}
                                            >
                                                {category}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {filterOptions.statuses?.map((status) => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={activeFilters.statuses.includes(status)}
                                        onCheckedChange={() => toggleFilter("statuses", status)}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {activeView === "books" && (
                                <>
                                    <TableHead>Book</TableHead>
                                    <TableHead>ISBN</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </>
                            )}
                            {activeView === "orders" && (
                                <>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </>
                            )}
                            {activeView === "users" && (
                                <>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead className="text-right">Orders</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <TableRow key={item.id}>
                                    {activeView === "books" ? (
                                        <>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 rounded-sm">
                                                        <AvatarImage src={item.image || "/placeholder.svg"} alt={item.title} />
                                                        <AvatarFallback className="rounded-sm">{item.title.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-sm text-gray-500">{item.author}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.isbn}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.stock}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(item.status)} variant="outline">
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : null}
                                    {activeView === "orders" && (
                                        <>
                                            <TableCell className="font-medium">{item.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p>{item.user?.name || item.user?.first_name || "N/A"}</p>
                                                    <p className="text-sm text-gray-500">{item.user?.email || item.email || "N/A"}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>
                                                <ul>
                                                    {(item.cart?.items || item.items || []).map((orderItem, idx) => {
                                                        const book = orderItem.book || orderItem.product || {};
                                                        const title = book.title || book.name || String(book) || "Book";
                                                        return (
                                                            <li key={orderItem._id || idx}>
                                                                {title} (x{orderItem.quantity || orderItem.amount || 1})
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </TableCell>
                                            <TableCell className="text-right">${item.total}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(item.status)} variant="outline">
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewOrder(item)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </>
                                    )}
                                    {activeView === "users" && (
                                        <>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.role}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>{item.joinDate}</TableCell>
                                            <TableCell className="text-right">{item.orders}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No {activeView} found matching your criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {
                filteredData.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                            <strong>{Math.min(indexOfLastItem, filteredData.length)}</strong> of <strong>{filteredData.length}</strong>{" "}
                            {activeView}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
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
                            </Button>
                        </div>
                    </div>
                )
            }

            {
                activeView === "books" && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? "Edit Book" : "Add New Book"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="author">Author</Label>
                                        <Input
                                            id="author"
                                            value={formData.author || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="isbn">ISBN</Label>
                                        <Input
                                            id="isbn"
                                            value={formData.isbn || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category || ""}
                                            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Fiction">Fiction</SelectItem>
                                                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                                                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                                                <SelectItem value="Mystery">Mystery</SelectItem>
                                                <SelectItem value="Thriller">Thriller</SelectItem>
                                                <SelectItem value="Self-Help">Self-Help</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={formData.stock || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="imgUrl">Image URL</Label>
                                        <Input
                                            id="imgUrl"
                                            value={formData.imgUrl || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, imgUrl: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fileUrl">File URL</Label>
                                        <Input
                                            id="fileUrl"
                                            value={formData.fileUrl || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="BookTypeOption">Book Type</Label>
                                    <Select
                                        value={formData.BookTypeOption || "PhysicalBook"}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, BookTypeOption: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PhysicalBook">Physical Book</SelectItem>
                                            <SelectItem value="Ebook">Ebook</SelectItem>
                                            <SelectItem value="AudioBook">Audio Book</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">File (PDF or MP3)</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.mp3"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            setFormData(prev => ({ ...prev, file }));
                                        }}
                                    />
                                    {editingItem && formData.fileUrl && (
                                        <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Current file</a>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            }

            {
                activeView === "orders" && selectedOrder && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                                        <p>{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date</p>
                                        <p>{selectedOrder.date}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Customer</p>
                                    <p>{selectedOrder.user?.name || selectedOrder.user?.first_name || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.user?.email || selectedOrder.email || "N/A"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Items</p>
                                        <ul>
                                            {(selectedOrder.cart?.items || selectedOrder.items || []).map((orderItem, idx) => {
                                                const book = orderItem.book || orderItem.product || {};
                                                const title = book.title || book.name || String(book) || "Book";
                                                return (
                                                    <li key={orderItem._id || idx}>
                                                        {title} (x{orderItem.quantity || orderItem.amount || 1})
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Pricing</p>
                                        <ul className="text-sm">
                                            <li>Subtotal: ${selectedOrder.pricing?.subtotal?.toFixed(2) ?? selectedOrder.total?.toFixed(2) ?? "N/A"}</li>
                                            <li>Shipping: ${selectedOrder.pricing?.shipping?.toFixed(2) ?? "N/A"}</li>
                                            <li>Tax: ${selectedOrder.pricing?.tax?.toFixed(2) ?? "N/A"}</li>
                                            <li>Total: ${selectedOrder.pricing?.subtotal?.toFixed(2) ?? selectedOrder.total?.toFixed(2) ?? "N/A"}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Select
                                        defaultValue={selectedOrder.paymentStatus}
                                        onValueChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Processing">Processing</SelectItem>
                                            <SelectItem value="Shipped">Shipped</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedOrder.shippingLocation && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                                        <p>
                                            {selectedOrder.shippingLocation.addressLine1 || ""}<br />
                                            {selectedOrder.shippingLocation.city || ""}, {selectedOrder.shippingLocation.state || ""} {selectedOrder.shippingLocation.zip || ""}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {activeView.slice(0, -1)} from the
                            database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
