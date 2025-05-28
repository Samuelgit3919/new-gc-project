import { useState, useEffect } from "react";
import {
    Plus, Search, Edit, Trash2, ChevronLeft,
    ChevronRight, Filter, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { getStatusColor, toggleFilter, clearFilters } from "../admin/utils/helpers";

const API_BASE_URL = "https://bookcompass.onrender.com/api/books";

function BookManagementView({ searchQuery, setSearchQuery }) {
    // State management
    const [books, setBooks] = useState([]);
    const [bookIds, setBookIds] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [deletingBookId, setDeletingBookId] = useState(null);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        statuses: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        price: '',
        stock: '',
        category: '',
        status: 'available',
        image: ''
    });
    const itemsPerPage = 5;

    // Fetch all books
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/getBook/myBooks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to fetch books");
            }
            const data = await res.json();

            const booksArray = Array.isArray(data.data) ? data.data : [];
            const validBooks = booksArray.filter((book) => book._id);
            const extractedIds = validBooks.map(book => book._id);

            if (validBooks.length !== booksArray.length) {
                console.warn("Some books were filtered out due to missing _id");
            }

            setBooks(validBooks);
            setFilteredBooks(validBooks);
            setBookIds(extractedIds);

        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Network error. Please try again.");
            setBooks([]);
            setFilteredBooks([]);
            setBookIds([]);
        } finally {
            setLoading(false);
        }
    };

    // Create a new book
    const createBook = async (bookData) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        try {
            // Validate required fields
            if (!bookData.title || !bookData.author || !bookData.isbn) {
                throw new Error("Title, author, and ISBN are required fields");
            }

            // Prepare the request
            const payload = {
                title: bookData.title.trim(),
                author: bookData.author.trim(),
                isbn: bookData.isbn.trim(),
                price: parseFloat(bookData.price) || 0,
                stock: parseInt(bookData.stock, 10) || 0,
                category: bookData.category?.trim() || "General",
                status: bookData.status?.trim() || "available",
                image: bookData.image?.trim() || "",
            };

            console.log("Sending payload:", payload); // Debug log

            const res = await fetch(`${API_BASE_URL}/createBook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", res.status); // Debug log

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Error details:", errorData); // Debug log
                throw new Error(
                    errorData.message ||
                    errorData.error ||
                    `Failed to create book (status ${res.status})`
                );
            }

            const newBook = await res.json();
            toast.success("Book created successfully!");
            return newBook;
        } catch (err) {
            console.error("Create book error:", err);
            toast.error(err.message);
            throw err; // Re-throw to allow component to handle it
        }
      };

    // Update an existing book
    const updateBook = async (id, bookData) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required. Please log in.");
        if (!id) throw new Error("Book ID is missing");
        try {
            const res = await fetch(`${API_BASE_URL}/updateBook/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update book");
            }
            const updatedBook = await res.json();
            toast.success("Book updated successfully!");
            return updatedBook;
        } catch (err) {
            throw new Error(err.message || "Failed to update book");
        }
    };

    // Delete a book
    const deleteBook = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required. Please log in.");
        if (!id) throw new Error("Book ID is missing");
        try {
            const res = await fetch(`${API_BASE_URL}/deleteBook/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete book");
            }
            toast.success("Book deleted successfully!");
            return true;
        } catch (err) {
            throw new Error(err.message || "Failed to delete book");
        }
    };

    // Handle form submission (create/update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const normalizedBookData = {
                title: formData.title?.trim(),
                author: formData.author?.trim(),
                isbn: formData.isbn?.trim(),
                category: formData.category?.trim(),
                price: parseFloat(formData.price) || 0,
                stock: parseInt(formData.stock, 10) || 0,
                status: formData.status?.trim() || "available",
                image: formData.image?.trim() || "",
            };

            if (currentBook?._id) {
                await updateBook(currentBook._id, normalizedBookData);
            } else {
                await createBook(normalizedBookData);
            }

            await fetchBooks();
            setIsDialogOpen(false);
            setCurrentBook(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle book deletion
    const handleDelete = async () => {
        if (!deletingBookId) {
            setError("No book selected for deletion");
            toast.error("No book selected for deletion");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await deleteBook(deletingBookId);
            setBookIds(prevIds => prevIds.filter(id => id !== deletingBookId));
            await fetchBooks();
            setIsDeleteDialogOpen(false);
            setDeletingBookId(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Open dialog for adding a new book
    const openAddDialog = () => {
        setCurrentBook(null);
        setFormData({
            title: '',
            author: '',
            isbn: '',
            price: '',
            stock: '',
            category: '',
            status: 'available',
            image: ''
        });
        setIsDialogOpen(true);
    };

    // Open dialog for editing a book
    const openEditDialog = (book) => {
        setCurrentBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            price: book.price,
            stock: book.stock,
            category: book.category,
            status: book.status,
            image: book.image
        });
        setIsDialogOpen(true);
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (book) => {
        setDeletingBookId(book._id);
        setIsDeleteDialogOpen(true);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filter books based on search and filters
    useEffect(() => {
        let result = [...books];
        const query = searchQuery?.toLowerCase?.() || "";

        if (query) {
            result = result.filter(
                (book) =>
                    book.title?.toLowerCase().includes(query) ||
                    book.author?.toLowerCase().includes(query) ||
                    book.isbn?.toLowerCase().includes(query) ||
                    book.category?.toLowerCase().includes(query)
            );
        }

        if (activeFilters.categories.length > 0) {
            result = result.filter((book) =>
                activeFilters.categories.includes(book.category)
            );
        }

        if (activeFilters.statuses.length > 0) {
            result = result.filter((book) =>
                activeFilters.statuses.includes(book.status)
            );
        }

        setFilteredBooks(result);
        setCurrentPage(1);
    }, [books, searchQuery, activeFilters]);

    // Initial fetch
    useEffect(() => {
        fetchBooks();
    }, []);

    // Helper data
    const categories = Array.from(
        new Set(books?.map((b) => b.category || "Unknown") || [])
    );
    const statuses = Array.from(
        new Set(books?.map((b) => b.status || "Unknown") || [])
    );
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const currentBooks = filteredBooks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center h-64 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchBooks}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header and Add Book Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Book Management</h1>
                <Button onClick={openAddDialog} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" /> Add Book
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search books..."
                        className="w-full pl-8 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="flex gap-2">
                    {(activeFilters.categories.length || activeFilters.statuses.length) > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearFilters("books", setActiveFilters, setSearchQuery)}
                            disabled={loading}
                        >
                            <X className="mr-2 h-4 w-4" /> Clear Filters
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={loading}>
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {categories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={activeFilters.categories.includes(category)}
                                    onCheckedChange={() =>
                                        toggleFilter("categories", category, activeFilters, setActiveFilters)
                                    }
                                >
                                    {category}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={activeFilters.statuses.includes(status)}
                                    onCheckedChange={() =>
                                        toggleFilter("statuses", status, activeFilters, setActiveFilters)
                                    }
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Books Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book) => (
                                <TableRow key={book._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-sm">
                                                <AvatarImage src={book.image || "/placeholder.svg"} alt={book.title} />
                                                <AvatarFallback className="rounded-sm">
                                                    {book.title?.substring(0, 2) || "BK"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{book.title || "N/A"}</p>
                                                <p className="text-sm text-gray-500">{book.author || "N/A"}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{book.isbn || "N/A"}</TableCell>
                                    <TableCell>{book.category || "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        ${book.price?.toFixed(2) || "0.00"}
                                    </TableCell>
                                    <TableCell className="text-right">{book.stock || 0}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(book.status)} variant="outline">
                                            {book.status || "Unknown"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(book)}
                                                disabled={loading}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openDeleteDialog(book)}
                                                disabled={loading || !book._id}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No books found matching your criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {filteredBooks.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
                        <strong>{Math.min(currentPage * itemsPerPage, filteredBooks.length)}</strong> of{" "}
                        <strong>{filteredBooks.length}</strong> books
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNumber = i + 1;
                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(pageNumber)}
                                    disabled={loading}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || loading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Add/Edit Book Dialog */}
            <div className={`fixed inset-0  bg-opacity-50 flex items-center justify-center ${isDialogOpen ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-lg p-4 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        {currentBook ? "Edit Book" : "Add New Book"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <div>
                                <label className="block text-sm font-medium mb-0">Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-0">Author</label>
                                <Input
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-0">ISBN</label>
                                <Input
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-0">Price</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-0">Stock</label>
                                <Input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-0">Category</label>
                                <Input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-0">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-md p-2"
                                    required
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <Input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    setCurrentBook(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <div className={`fixed inset-0  bg-opacity-50 flex items-center justify-center ${isDeleteDialogOpen ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                    <p className="mb-6">Are you sure you want to delete this book?</p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookManagementView;