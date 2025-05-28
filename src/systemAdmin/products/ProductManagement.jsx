"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

const products = [
    { id: 1, name: "The Great Gatsby", store: "Classic Books", price: 12.99, stock: 45, category: "Fiction" },
    { id: 2, name: "To Kill a Mockingbird", store: "Classic Books", price: 14.99, stock: 32, category: "Fiction" },
    { id: 3, name: "1984", store: "Dystopian Reads", price: 11.99, stock: 18, category: "Fiction" },
    { id: 4, name: "The Hobbit", store: "Fantasy World", price: 16.99, stock: 27, category: "Fiction" },
    { id: 5, name: "Sapiens", store: "Knowledge Hub", price: 24.99, stock: 15, category: "Non-Fiction" },
    { id: 6, name: "Atomic Habits", store: "Self Help Books", price: 18.99, stock: 42, category: "Non-Fiction" },
    {
        id: 7,
        name: "Harry Potter and the Sorcerer's Stone",
        store: "Fantasy World",
        price: 15.99,
        stock: 53,
        category: "Children's",
    },
    { id: 8, name: "The Very Hungry Caterpillar", store: "Kids Corner", price: 9.99, stock: 67, category: "Children's" },
    {
        id: 9,
        name: "Calculus: Early Transcendentals",
        store: "Academic Press",
        price: 89.99,
        stock: 12,
        category: "Educational",
    },
    { id: 10, name: "Python Crash Course", store: "Tech Books", price: 34.99, stock: 23, category: "Educational" },
]

export default function ProductManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [storeFilter, setStoreFilter] = useState("all")

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
        const matchesStore = storeFilter === "all" || product.store.toLowerCase().includes(storeFilter.toLowerCase())

        return matchesSearch && matchesCategory && matchesStore
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
                    <p className="text-muted-foreground">Manage all products listed on your platform</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="children's">Children's</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Stores" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stores</SelectItem>
                        <SelectItem value="classic">Classic Books</SelectItem>
                        <SelectItem value="fantasy">Fantasy World</SelectItem>
                        <SelectItem value="knowledge">Knowledge Hub</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="flex-1">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NAME</TableHead>
                                <TableHead>STORE</TableHead>
                                <TableHead>PRICE</TableHead>
                                <TableHead>STOCK</TableHead>
                                <TableHead>CATEGORY</TableHead>
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium text-blue-600">{product.name}</TableCell>
                                    <TableCell className="text-blue-600">{product.store}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                product.stock > 30 ? "text-green-600 border-green-200" : "text-orange-600 border-orange-200"
                                            }
                                        >
                                            {product.stock} in stock
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                                            {product.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
