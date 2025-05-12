"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function BookDialog({ open, onOpenChange, book, onSave }) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        price: 0,
        stock: 0,
        image: "/placeholder.svg?height=40&width=40",
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (book) {
            setFormData(book)
        } else {
            setFormData({
                title: "",
                author: "",
                isbn: "",
                category: "",
                price: 0,
                stock: 0,
                image: "/placeholder.svg?height=40&width=40",
            })
        }
        setErrors({})
    }, [book, open])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleNumberChange = (e) => {
        const { name, value } = e.target
        const numValue = Number.parseFloat(value)
        setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title?.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.author?.trim()) {
            newErrors.author = "Author is required"
        }

        if (!formData.isbn?.trim()) {
            newErrors.isbn = "ISBN is required"
        } else if (!/^[0-9-]{10,17}$/.test(formData.isbn)) {
            newErrors.isbn = "ISBN must be a valid format"
        }

        if (!formData.category) {
            newErrors.category = "Category is required"
        }

        if (formData.price === undefined || formData.price < 0) {
            newErrors.price = "Price must be a positive number"
        }

        if (formData.stock === undefined || formData.stock < 0) {
            newErrors.stock = "Stock must be a non-negative number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // Determine status based on stock
        let status
        if (formData.stock === 0) {
            status = "Out of Stock"
        } else if (formData.stock <= 10) {
            status = "Low Stock"
        } else {
            status = "In Stock"
        }

        // Create complete book object
        const completeBook = {
            ...formData,
            status,
        }

        onSave(completeBook)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author" className={errors.author ? "text-red-500" : ""}>
                                Author
                            </Label>
                            <Input
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className={errors.author ? "border-red-500" : ""}
                            />
                            {errors.author && <p className="text-xs text-red-500">{errors.author}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="isbn" className={errors.isbn ? "text-red-500" : ""}>
                                ISBN
                            </Label>
                            <Input
                                id="isbn"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className={errors.isbn ? "border-red-500" : ""}
                            />
                            {errors.isbn && <p className="text-xs text-red-500">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category" className={errors.category ? "text-red-500" : ""}>
                                Category
                            </Label>
                            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fiction">Fiction</SelectItem>
                                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                                    <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                                    <SelectItem value="Mystery">Mystery</SelectItem>
                                    <SelectItem value="Thriller">Thriller</SelectItem>
                                    <SelectItem value="Romance">Romance</SelectItem>
                                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                                    <SelectItem value="Historical Fiction">Historical Fiction</SelectItem>
                                    <SelectItem value="Memoir">Memoir</SelectItem>
                                    <SelectItem value="Autobiography">Autobiography</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className={errors.price ? "text-red-500" : ""}>
                                Price ($)
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleNumberChange}
                                className={errors.price ? "border-red-500" : ""}
                            />
                            {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className={errors.stock ? "text-red-500" : ""}>
                                Stock
                            </Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleNumberChange}
                                className={errors.stock ? "border-red-500" : ""}
                            />
                            {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
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

export default BookDialog
