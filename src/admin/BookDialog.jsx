"use client"

import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface BookDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    editingBook: any
    bookFormData: {
        title: string
        author: string
        isbn: string
        category: string
        price: number
        stock: number
        image: string
    }
    bookFormErrors: Record<string, string>
    handleBookFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleBookNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleBookSelectChange: (name: string, value: string) => void
    handleSaveBook: (e: React.FormEvent) => void
}

export default function BookDialog({
    isOpen,
    onOpenChange,
    editingBook,
    bookFormData,
    bookFormErrors,
    handleBookFormChange,
    handleBookNumberChange,
    handleBookSelectChange,
    handleSaveBook,
}: BookDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveBook} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className={bookFormErrors.title ? "text-red-500" : ""}>
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={bookFormData.title}
                                onChange={handleBookFormChange}
                                className={bookFormErrors.title ? "border-red-500" : ""}
                            />
                            {bookFormErrors.title && <p className="text-xs text-red-500">{bookFormErrors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author" className={bookFormErrors.author ? "text-red-500" : ""}>
                                Author
                            </Label>
                            <Input
                                id="author"
                                name="author"
                                value={bookFormData.author}
                                onChange={handleBookFormChange}
                                className={bookFormErrors.author ? "border-red-500" : ""}
                            />
                            {bookFormErrors.author && <p className="text-xs text-red-500">{bookFormErrors.author}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="isbn" className={bookFormErrors.isbn ? "text-red-500" : ""}>
                                ISBN
                            </Label>
                            <Input
                                id="isbn"
                                name="isbn"
                                value={bookFormData.isbn}
                                onChange={handleBookFormChange}
                                className={bookFormErrors.isbn ? "border-red-500" : ""}
                            />
                            {bookFormErrors.isbn && <p className="text-xs text-red-500">{bookFormErrors.isbn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category" className={bookFormErrors.category ? "text-red-500" : ""}>
                                Category
                            </Label>
                            <Select
                                value={bookFormData.category}
                                onValueChange={(value) => handleBookSelectChange("category", value)}
                            >
                                <SelectTrigger className={bookFormErrors.category ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fiction">Fiction</SelectItem>
                                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                                    <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                                    <SelectItem value="Mystery">Mystery</SelectItem>
                                    <SelectItem value="Thriller">Thriller</SelectItem>
                                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                                    <SelectItem value="Historical Fiction">Historical Fiction</SelectItem>
                                </SelectContent>
                            </Select>
                            {bookFormErrors.category && <p className="text-xs text-red-500">{bookFormErrors.category}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className={bookFormErrors.price ? "text-red-500" : ""}>
                                Price ($)
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={bookFormData.price}
                                onChange={handleBookNumberChange}
                                className={bookFormErrors.price ? "border-red-500" : ""}
                            />
                            {bookFormErrors.price && <p className="text-xs text-red-500">{bookFormErrors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className={bookFormErrors.stock ? "text-red-500" : ""}>
                                Stock
                            </Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={bookFormData.stock}
                                onChange={handleBookNumberChange}
                                className={bookFormErrors.stock ? "border-red-500" : ""}
                            />
                            {bookFormErrors.stock && <p className="text-xs text-red-500">{bookFormErrors.stock}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
