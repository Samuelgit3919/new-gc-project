"use client"

import { Plus, Search, X, Filter, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

interface BookManagementViewProps {
    books: any[]
    filteredBooks: any[]
    currentBooks: any[]
    searchQuery: string
    setSearchQuery: (query: string) => void
    bookActiveFilters: {
        categories: string[]
        statuses: string[]
    }
    bookCategories: string[]
    bookStatuses: string[]
    bookCurrentPage: number
    setBookCurrentPage: (page: number) => void
    bookTotalPages: number
    bookIndexOfFirstItem: number
    bookIndexOfLastItem: number
    handleAddBook: () => void
    handleEditBook: (book: any) => void
    handleDeleteBook: (id: number) => void
    toggleFilter: (filterType: string, filterValue: string, filterState: any, setFilterState: any) => void
    clearFilters: (setFilterState: any) => void
    setBookActiveFilters: (filters: any) => void
    getStatusColor: (status: string) => string
}

export default function BookManagementView({
    books,
    filteredBooks,
    currentBooks,
    searchQuery,
    setSearchQuery,
    bookActiveFilters,
    bookCategories,
    bookStatuses,
    bookCurrentPage,
    setBookCurrentPage,
    bookTotalPages,
    bookIndexOfFirstItem,
    bookIndexOfLastItem,
    handleAddBook,
    handleEditBook,
    handleDeleteBook,
    toggleFilter,
    clearFilters,
    setBookActiveFilters,
    getStatusColor,
}: BookManagementViewProps) {
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
                    {(bookActiveFilters.categories.length > 0 || bookActiveFilters.statuses.length > 0) && (
                        <Button variant="outline" size="sm" onClick={() => clearFilters(setBookActiveFilters)}>
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
                            {bookCategories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={bookActiveFilters.categories.includes(category)}
                                    onCheckedChange={() => toggleFilter("categories", category, bookActiveFilters, setBookActiveFilters)}
                                >
                                    {category}
                                </DropdownMenuCheckboxItem>
                            ))}

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {bookStatuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={bookActiveFilters.statuses.includes(status)}
                                    onCheckedChange={() => toggleFilter("statuses", status, bookActiveFilters, setBookActiveFilters)}
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
                        Showing <strong>{bookIndexOfFirstItem + 1}</strong> to{" "}
                        <strong>{Math.min(bookIndexOfLastItem, filteredBooks.length)}</strong> of{" "}
                        <strong>{filteredBooks.length}</strong> books
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setBookCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={bookCurrentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>

                        {Array.from({ length: Math.min(5, bookTotalPages) }, (_, i) => {
                            let pageNum = i + 1
                            if (bookTotalPages > 5) {
                                if (bookCurrentPage > 3) {
                                    pageNum = bookCurrentPage - 3 + i
                                }
                                if (pageNum > bookTotalPages) {
                                    pageNum = bookTotalPages - (4 - i)
                                }
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={bookCurrentPage === pageNum ? "outline" : "ghost"}
                                    size="sm"
                                    className={bookCurrentPage === pageNum ? "font-medium" : ""}
                                    onClick={() => setBookCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setBookCurrentPage((prev) => Math.min(bookTotalPages, prev + 1))}
                            disabled={bookCurrentPage === bookTotalPages}
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
