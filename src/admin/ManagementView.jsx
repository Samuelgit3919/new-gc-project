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
import { toast } from "react-hot-toast"
import axios from "axios"
import { Skeleton } from "../components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

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

    // Loading states
    const [loadingSettings, setLoadingSettings] = useState(false)
    const [loadingBooks, setLoadingBooks] = useState(false)
    const [loadingOrders, setLoadingOrders] = useState(false)

    const navigate = useNavigate()

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
        if (activeView === "books") {
            setLoadingBooks(true)
            fetchBooks().finally(() => setLoadingBooks(false))
        }
        if (activeView === "orders") {
            setLoadingOrders(true)
            fetchOrders().finally(() => setLoadingOrders(false))
        }
        if (activeView === "settings") {
            setLoadingSettings(true)
            const fetchBookshop = async () => {
                try {
                    const token = localStorage.getItem("token")
                    const userStr = localStorage.getItem("user")
                    if (!token || !userStr) {
                        toast.error("You are not authenticated")
                        return
                    }

                    // Parse user data to get ID
                    const user = JSON.parse(userStr)
                    if (!user._id) {
                        toast.error("User ID not found")
                        return
                    }

                    const res = await axios.get(`https://bookcompass.onrender.com/api/bookshop/myShop`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })

                    if (res.data && res.data.data) {
                        const shopData = res.data.data
                        setSettingsFormData({
                            storeName: shopData.name || "",
                            email: shopData.contact?.email || "",
                            phone: shopData.contact?.phoneNumber || "",
                            currency: shopData.currency || "usd",
                            address: shopData.location?.address || "",
                            notifications: shopData.notifications || { newOrder: true, lowStock: true },
                        })
                    }
                } catch (err) {
                    console.error("Error fetching bookshop:", err)
                    toast.error("Failed to fetch bookshop details")
                } finally {
                    setLoadingSettings(false)
                }
            }
            fetchBookshop()
        }
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
            status: "Active",
            file: null,
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
            status: item.status || "Active",
            file: null,
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
            if (!token) {
                toast.error("You are not authenticated.");
                setIsDialogOpen(false);
                return;
            }

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
                const data = await res.json()

                if (!res.ok) {
                    if (data.error === "You need to create a bookshop before adding books. Please create a bookshop first.") {
                        toast.error(data.error, {
                            duration: 5000,
                            position: "top-center",
                            style: {
                                background: "#FEE2E2",
                                color: "#991B1B",
                                border: "1px solid #F87171",
                            },
                            action: {
                                label: "Create Bookshop",
                                onClick: () => navigate("/bookStoreProfilePage")
                            }
                        });
                        setIsDialogOpen(false);
                        return;
                    }
                    throw new Error(data.message || "Failed to save book")
                }

                setIsDialogOpen(false)
                toast.success(`Book ${isEdit ? "updated" : "added"} successfully!`)
                await fetchBooks()
            } catch (err) {
                toast.error(err.message || "Failed to save book", {
                    position: "top-center",
                    duration: 4000
                })
            }
        }
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

    const handleSaveSettings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not authenticated");
                return;
            }

            // Get the current bookshop data first
            const shopResponse = await axios.get(
                `https://bookcompass.onrender.com/api/bookshop/myShop`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!shopResponse.data?.data?._id) {
                toast.error("Could not find your bookshop");
                return;
            }

            const bookshopId = shopResponse.data.data._id;

            // Format the update data according to the API structure
            const updateData = {
                name: settingsFormData.storeName,
                contact: {
                    email: settingsFormData.email,
                    phoneNumber: settingsFormData.phone
                },
                currency: settingsFormData.currency,
                location: {
                    address: settingsFormData.address
                },
                notifications: settingsFormData.notifications
            };

            // Make the API call to update the bookshop
            const response = await axios.put(
                `https://bookcompass.onrender.com/api/bookshop/${bookshopId}`,
                updateData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.success) {
                setSettings(settingsFormData);
                toast.success("Settings saved successfully!");
            } else {
                throw new Error(response.data.message || "Failed to update settings");
            }
        } catch (err) {
            console.error("Error updating settings:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to update bookshop settings");
        }
    };

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

    const getUserId = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        
        try {
            const user = JSON.parse(userStr);
            return user._id;
        } catch (e) {
            console.error("Error parsing user data:", e);
            return null;
        }
    };

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
                            {loadingSettings ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                    <Skeleton className="h-20 w-full col-span-2" />
                                </div>
                            ) : (
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
                            )}
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
                            {loadingSettings ? <Skeleton className="h-10 w-32" /> : <Button onClick={handleSaveSettings}>Save Changes</Button>}
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Configure which emails you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loadingSettings ? (
                                <>
                                    <Skeleton className="h-10 w-full mb-2" />
                                    <Skeleton className="h-10 w-full" />
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </CardContent>
                        <CardFooter>
                            {loadingSettings ? <Skeleton className="h-10 w-32" /> : <Button onClick={handleSaveSettings}>Save Preferences</Button>}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    // Render table view for books, orders, users
    return (
        <div>
            <Toaster position="top-center" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {activeView === "books" && "Book Management"}
                        {activeView === "orders" && "Order Management"}
                        {activeView === "users" && "User Management"}
                    </h1>
                    {activeView === "books" && (
                        <Button onClick={handleAdd} disabled={loadingBooks}>
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
                {loadingBooks || loadingOrders ? (
                    <div className="p-8">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full mb-4" />
                        ))}
                    </div>
                ) : (
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
                                                        <p>{item.customer}</p>
                                                        <p className="text-sm text-gray-500">{item.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    {Array.isArray(item.items)
                                                        ? item.items.map((orderItem, idx) => {
                                                            // Try to show book title and quantity
                                                            let bookTitle = orderItem.book?.title || orderItem.book?.name || orderItem.book || "Book";
                                                            return (
                                                                <span key={orderItem._id || idx}>
                                                                    {bookTitle} (x{orderItem.quantity}){idx < item.items.length - 1 ? ", " : ""}
                                                                </span>
                                                            );
                                                        })
                                                        : String(item.items)}
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
                )}
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
                        <DialogContent className="sm:max-w-[400px] p-4">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? "Edit Book" : "Add New Book"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 py-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={formData.title || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="author">Author</Label>
                                            <Input
                                                id="author"
                                                value={formData.author || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label htmlFor="isbn">ISBN</Label>
                                            <Input
                                                id="isbn"
                                                value={formData.isbn || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex-1">
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
                                                    <SelectItem value="Mystery">Mystery</SelectItem>
                                                    <SelectItem value="Romance">Romance</SelectItem>
                                                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                                                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                                                    <SelectItem value="Horror">Horror</SelectItem>
                                                    <SelectItem value="Thriller">Thriller</SelectItem>
                                                    <SelectItem value="Historical Fiction">Historical Fiction</SelectItem>
                                                    <SelectItem value="Biography">Biography</SelectItem>
                                                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                                                    <SelectItem value="Business">Business</SelectItem>
                                                    <SelectItem value="Science">Science</SelectItem>
                                                    <SelectItem value="Philosophy">Philosophy</SelectItem>
                                                    <SelectItem value="Poetry">Poetry</SelectItem>
                                                    <SelectItem value="Children">Children</SelectItem>
                                                    <SelectItem value="Young Adult">Young Adult</SelectItem>
                                                    <SelectItem value="Travel">Travel</SelectItem>
                                                    <SelectItem value="Cooking">Cooking</SelectItem>
                                                    <SelectItem value="Art">Art</SelectItem>
                                                    <SelectItem value="History">History</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label htmlFor="price">Price ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={formData.price || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={formData.stock || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label htmlFor="imgUrl">Image URL</Label>
                                            <Input
                                                id="imgUrl"
                                                value={formData.imgUrl || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, imgUrl: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="fileUrl">File URL</Label>
                                            <Input
                                                id="fileUrl"
                                                value={formData.fileUrl || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
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
                                        <div className="flex-1">
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
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                            className="min-h-[60px] max-h-[80px]"
                                        />
                                    </div>
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
                                    <p>{selectedOrder.transactionDetails.first_name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Items</p>
                                        <p>
                                            {Array.isArray(selectedOrder.items)
                                                ? selectedOrder.items.map((orderItem, idx) => {
                                                    // Try to show book title and quantity
                                                    let bookTitle = orderItem.book?.title || orderItem.book?.name || orderItem.book || "Book";
                                                    return (
                                                        <span key={orderItem._id || idx}>
                                                            {bookTitle} (x{orderItem.quantity}){idx < selectedOrder.items.length - 1 ? ", " : ""}
                                                        </span>
                                                    );
                                                })
                                                : String(selectedOrder.items)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total</p>
                                        <p>${selectedOrder.total.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Select
                                        defaultValue={selectedOrder.status}
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
