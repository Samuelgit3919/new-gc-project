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
import BookDialog from "./BookDialog";
import DeleteBookDialog from "./DeleteBookDialog";
import { getStatusColor, toggleFilter, clearFilters } from "../admin/utils/helpers";

const API_BASE_URL = "https://bookcompass.onrender.com/api/books";

function BookManagementView({ searchQuery, setSearchQuery }) {
    const [books, setBooks] = useState([]);
    const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deletingBookId, setDeletingBookId] = useState(null);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        statuses: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 5;

    const fetchBooks = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication required. Please login.");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/getBook/myBooks`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to fetch books");
            }

            const data = await res.json();
            const booksArray = Array.isArray(data) ? data :
                data.books ? data.books :
                    data.data ? data.data : [];

            setBooks(booksArray);
            setError(null);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const createBook = async (bookData) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/createBook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bookData)
            });
            if (!res.ok) throw new Error((await res.json()).message);
            return await res.json();
        } catch (err) {
            throw new Error(err.message || "Failed to create book");
        }
    };

    const updateBook = async (id, bookData) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/updateBook/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bookData)
            });
            if (!res.ok) throw new Error((await res.json()).message);
            return await res.json();
        } catch (err) {
            throw new Error(err.message || "Failed to update book");
        }
    };

    const deleteBook = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/deleteBook/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error((await res.json()).message);
            return true;
        } catch (err) {
            throw new Error(err.message || "Failed to delete book");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        let result = [...books];
        const query = searchQuery?.toLowerCase?.() || "";

        if (searchQuery) {
            result = result.filter(book =>
                book.title?.toLowerCase().includes(query) ||
                book.author?.toLowerCase().includes(query) ||
                book.isbn?.toLowerCase().includes(query) ||
                book.category?.toLowerCase().includes(query)
            );
        }

        if (activeFilters.categories.length > 0) {
            result = result.filter(book =>
                activeFilters.categories.includes(book.category)
            );
        }

        if (activeFilters.statuses.length > 0) {
            result = result.filter(book =>
                activeFilters.statuses.includes(book.status)
            );
        }

        setFilteredBooks(result);
        setCurrentPage(1);
    }, [books, searchQuery, activeFilters]);

    const handleSaveBook = async (bookData) => {
        try {
            if (bookData.id) {
                await updateBook(bookData.id, bookData);
            } else {
                await createBook(bookData);
            }
            await fetchBooks();
            setIsBookDialogOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDeleteBook = async () => {
        try {
            await deleteBook(deletingBookId);
            await fetchBooks();
            setIsDeleteDialogOpen(false);
            setDeletingBookId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const currentBooks = filteredBooks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = Array.from(new Set(books?.map(b => b.category || "Unknown") || []));
    const statuses = Array.from(new Set(books?.map(b => b.status || "Unknown") || []));
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    if (loading) return <div className="h-64 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full"></div>
    </div>;

    if (error) return <div className="text-center h-64 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchBooks}>Retry</Button>
    </div>;

    return (
        <div className="space-y-6">
            {/* Header and Add Book Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Book Management</h1>
                <Button onClick={() => { setEditingBook(null); setIsBookDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" />Add Book
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
                    />
                </div>

                <div className="flex gap-2">
                    {(activeFilters.categories.length || activeFilters.statuses.length) > 0 && (
                        <Button variant="outline" size="sm" onClick={() => clearFilters("books", setActiveFilters, setSearchQuery)}>
                            <X className="mr-2 h-4 w-4" />Clear Filters
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {categories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={activeFilters.categories.includes(category)}
                                    onCheckedChange={() => toggleFilter("categories", category, activeFilters, setActiveFilters)}
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
                                    onCheckedChange={() => toggleFilter("statuses", status, activeFilters, setActiveFilters)}
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
                            currentBooks.map((book, index) => (
                                <TableRow key={book.id || book._id || index}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-sm">
                                                <AvatarImage src={book.image || "/placeholder.svg"} alt={book.title} />
                                                <AvatarFallback className="rounded-sm">
                                                    {book.title?.substring(0, 2) || "BK"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{book.title}</p>
                                                <p className="text-sm text-gray-500">{book.author}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{book.isbn || "N/A"}</TableCell>
                                    <TableCell>{book.category || "N/A"}</TableCell>
                                    <TableCell className="text-right">${book.price?.toFixed(2) || "0.00"}</TableCell>
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
                                                onClick={() => {
                                                    setEditingBook(book);
                                                    setIsBookDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setDeletingBookId(book.id || book._id);
                                                    setIsDeleteDialogOpen(true);
                                                }}
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
                        Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to {" "}
                        <strong>{Math.min(currentPage * itemsPerPage, filteredBooks.length)}</strong> of {" "}
                        <strong>{filteredBooks.length}</strong> books
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
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
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <BookDialog
                isOpen={isBookDialogOpen}
                onClose={() => setIsBookDialogOpen(false)}
                onSave={handleSaveBook}
                book={editingBook}
            />
            <DeleteBookDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={confirmDeleteBook}
            />
        </div>
    );
}

export default BookManagementView;
