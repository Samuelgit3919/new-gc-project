"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import BookDialog from "./BookDialog"
import DeleteBookDialog from "./DeleteBookDialog"
import { getStatusColor, toggleFilter, clearFilters } from "../admin/utils/helpers"

function BookManagementView({ books = [], setBooks, searchQuery, setSearchQuery }) {
    const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingBook, setEditingBook] = useState(null)
    const [deletingBookId, setDeletingBookId] = useState(null)
    const [filteredBooks, setFilteredBooks] = useState(books || [])
    const [currentPage, setCurrentPage] = useState(1)
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        statuses: [],
    })

    const itemsPerPage = 5

    // Get unique categories and statuses for filters
    const categories = Array.from(new Set((books || []).map((book) => book.category)))
    const statuses = Array.from(new Set((books || []).map((book) => book.status)))


    // Apply filters and search
    useEffect(() => {
        let result = [...books]

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    book.isbn.toLowerCase().includes(query) ||
                    book.category.toLowerCase().includes(query),
            )
        }

        // Apply category filters
        if (activeFilters.categories.length > 0) {
            result = result.filter((book) => activeFilters.categories.includes(book.category))
        }

        // Apply status filters
        if (activeFilters.statuses.length > 0) {
            result = result.filter((book) => activeFilters.statuses.includes(book.status))
        }

        setFilteredBooks(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [books, searchQuery, activeFilters])

    // Pagination
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
    const indexOfLastBook = currentPage * itemsPerPage
    const indexOfFirstBook = indexOfLastBook - itemsPerPage
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)

    const handleAddBook = () => {
        setEditingBook(null)
        setIsBookDialogOpen(true)
    }

    const handleEditBook = (book) => {
        setEditingBook(book)
        setIsBookDialogOpen(true)
    }

    const handleDeleteBook = (id) => {
        setDeletingBookId(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDeleteBook = () => {
        if (deletingBookId !== null) {
            setBooks(books.filter((book) => book.id !== deletingBookId))
            setIsDeleteDialogOpen(false)
            setDeletingBookId(null)
        }
    }

    const handleSaveBook = (bookData) => {
        if (bookData.id) {
            // Update existing book
            setBooks(books.map((b) => (b.id === bookData.id ? bookData : b)))
        } else {
            // Add new book
            const newBook = {
                ...bookData,
                id: Math.max(0, ...books.map((b) => b.id)) + 1,
            }
            setBooks([...books, newBook])
        }
        setIsBookDialogOpen(false)
    }
    
    if (!books) {
        return <div>Loading books...</div>
    }
    if (books.length === 0) {
        return <div>No books available</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Book Management</h1>
                <Button onClick={handleAddBook}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Book
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search books..."
                        className="w-full pl-8 bg-white dark:bg-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    {(activeFilters.categories.length > 0 || activeFilters.statuses.length > 0) && (
                        <Button variant="outline" size="sm" onClick={() => clearFilters("books", setActiveFilters, setSearchQuery)}>
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

            <div className="rounded-md border bg-white dark:bg-gray-800">
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
                                <TableRow key={book.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-sm">
                                                <AvatarImage src={book.image || "/placeholder.svg"} alt={book.title} />
                                                <AvatarFallback className="rounded-sm">{book.title.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{book.title}</p>
                                                <p className="text-sm text-gray-500">{book.author}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    <TableCell>{book.category}</TableCell>
                                    <TableCell className="text-right">${book.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{book.stock}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(book.status)} variant="outline">
                                            {book.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditBook(book)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                <span className="sr-only">Delete</span>
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

            {filteredBooks.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <strong>{indexOfFirstBook + 1}</strong> to{" "}
                        <strong>{Math.min(indexOfLastBook, filteredBooks.length)}</strong> of{" "}
                        <strong>{filteredBooks.length}</strong> books
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

            <BookDialog
                open={isBookDialogOpen}
                onOpenChange={setIsBookDialogOpen}
                book={editingBook}
                onSave={handleSaveBook}
            />

            <DeleteBookDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={confirmDeleteBook} />
        </div>
    )
}

export default BookManagementView
