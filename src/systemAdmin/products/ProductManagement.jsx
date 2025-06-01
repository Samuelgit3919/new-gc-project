"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [storeFilter, setStoreFilter] = useState("all");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", store: "", price: "", stock: "", category: "Fiction" });
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [actionLoading, setActionLoading] = useState("");

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/admin/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            console.log(data)
            setProducts(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            setError(err.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        setAddError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/admin/newProducts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to add product");
            }
            setAddDialogOpen(false);
            setAddForm({ name: "", store: "", price: "", stock: "", category: "Fiction" });
            fetchProducts();
        } catch (err) {
            setAddError(err.message || "Failed to add product");
        } finally {
            setAddLoading(false);
        }
    };

    const handleProductAction = async (productId, action) => {
        setActionLoading(productId + action);
        try {
            const token = localStorage.getItem("token");
            let url = "";
            let method = "PUT";
            if (action === "delete") {
                url = `https://bookcompass.onrender.com/api/admin/products/${productId}`;
                method = "DELETE";
            }
            // For edit, you would show an edit modal (not implemented here)
            if (!url) return;
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Action failed");
            fetchProducts();
        } catch (err) {
            alert(err.message || "Action failed");
        } finally {
            setActionLoading("");
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = (product.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || (product.category?.toLowerCase() || "") === categoryFilter.toLowerCase();
        const matchesStore = storeFilter === "all" || (product.store?.toLowerCase() || "").includes(storeFilter.toLowerCase());
        return matchesSearch && matchesCategory && matchesStore;
    });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {loading && <div className="text-center py-8">Loading products...</div>}
            {error && <div className="text-center text-red-500 py-8">{error}</div>}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
                    <p className="text-muted-foreground">Manage all products listed on your platform</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setAddDialogOpen(true)}>
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
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Children's">Children's</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Stores" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stores</SelectItem>
                        {/* Optionally, dynamically generate store options from products */}
                        {Array.from(new Set(products.map(p => p.store))).map(store => (
                            <SelectItem key={store} value={store}>{store}</SelectItem>
                        ))}
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
                                <TableRow key={product._id || product.id}>
                                    <TableCell className="font-medium text-blue-600">{product.title}</TableCell>
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
                                        <div className="flex gap-2">
                                            {/* <Button variant="outline" size="sm" onClick={() => handleProductAction(product._id, "edit")}>Edit</Button> */}
                                            <Button variant="destructive" size="sm" onClick={() => handleProductAction(product._id, "delete")} disabled={actionLoading === product._id + "delete"}>
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Product Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                        {addError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{addError}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store">Store</Label>
                            <Input id="store" value={addForm.store} onChange={e => setAddForm(f => ({ ...f, store: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" type="number" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" value={addForm.stock} onChange={e => setAddForm(f => ({ ...f, stock: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={addForm.category} onValueChange={val => setAddForm(f => ({ ...f, category: val }))}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fiction">Fiction</SelectItem>
                                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                                    <SelectItem value="Children's">Children's</SelectItem>
                                    <SelectItem value="Educational">Educational</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} disabled={addLoading}>Cancel</Button>
                            <Button type="submit" disabled={addLoading}>{addLoading ? "Adding..." : "Add Product"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
