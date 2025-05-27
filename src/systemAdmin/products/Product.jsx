"use client"

import { useState } from "react"
import { Trash2, Edit, Search, Plus, MoreHorizontal } from "lucide-react"

const products = [
    { id: "1", name: "The Great Gatsby", store: "Classic Books", price: 12.99, stock: 45, category: "Fiction" },
    { id: "2", name: "To Kill a Mockingbird", store: "Classic Books", price: 14.99, stock: 32, category: "Fiction" },
    { id: "3", name: "1984", store: "Dystopian Reads", price: 11.99, stock: 18, category: "Fiction" },
    { id: "4", name: "The Hobbit", store: "Fantasy World", price: 16.99, stock: 27, category: "Fiction" },
    { id: "5", name: "Sapiens", store: "Knowledge Hub", price: 24.99, stock: 15, category: "Non-Fiction" },
    { id: "6", name: "Atomic Habits", store: "Self Help Books", price: 18.99, stock: 42, category: "Non-Fiction" },
    {
        id: "7",
        name: "Harry Potter and the Sorcerer's Stone",
        store: "Fantasy World",
        price: 15.99,
        stock: 53,
        category: "Children's",
    },
    {
        id: "8",
        name: "The Very Hungry Caterpillar",
        store: "Kids Corner",
        price: 9.99,
        stock: 67,
        category: "Children's",
    },
    {
        id: "9",
        name: "Calculus: Early Transcendentals",
        store: "Academic Press",
        price: 89.99,
        stock: 12,
        category: "Educational",
    },
    { id: "10", name: "Python Crash Course", store: "Tech Books", price: 34.99, stock: 23, category: "Educational" },
]

export default function Product() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(null)

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleEditProduct = (product) => {
        setSelectedProduct(product)
        setShowEditModal(true)
        setDropdownOpen(null)
    }

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product)
        setShowDeleteModal(true)
        setDropdownOpen(null)
    }

    const getStockBadgeClass = (stock) => {
        return stock > 20 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                        <p className="mt-2 text-gray-600">Manage all products listed on your platform</p>
                    </div>
                    <button className="btn btn-primary px-4 py-2" onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="input w-full sm:w-48">
                    <option value="all">All Categories</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="children">Children's</option>
                    <option value="educational">Educational</option>
                </select>
                <select className="input w-full sm:w-48">
                    <option value="all">All Stores</option>
                    <option value="classic">Classic Books</option>
                    <option value="fantasy">Fantasy World</option>
                    <option value="knowledge">Knowledge Hub</option>
                    <option value="kids">Kids Corner</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.store}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStockBadgeClass(product.stock)}`}
                                        >
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                className="btn btn-ghost p-2"
                                                onClick={() => setDropdownOpen(dropdownOpen === product.id ? null : product.id)}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                            {dropdownOpen === product.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleEditProduct(product)}
                                                        >
                                                            <Edit className="mr-3 h-4 w-4" />
                                                            Edit product
                                                        </button>
                                                        <button
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleDeleteProduct(product)}
                                                        >
                                                            <Trash2 className="mr-3 h-4 w-4" />
                                                            Delete product
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" className="input w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                                    <select className="input w-full">
                                        <option value="">Select store</option>
                                        <option value="classic">Classic Books</option>
                                        <option value="fantasy">Fantasy World</option>
                                        <option value="knowledge">Knowledge Hub</option>
                                        <option value="kids">Kids Corner</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input type="number" step="0.01" className="input w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" className="input w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select className="input w-full">
                                        <option value="">Select category</option>
                                        <option value="fiction">Fiction</option>
                                        <option value="non-fiction">Non-Fiction</option>
                                        <option value="children">Children's</option>
                                        <option value="educational">Educational</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button className="btn btn-outline px-4 py-2" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary px-4 py-2" onClick={() => setShowAddModal(false)}>
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" className="input w-full" defaultValue={selectedProduct.name} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                                    <select className="input w-full" defaultValue={selectedProduct.store}>
                                        <option value="Classic Books">Classic Books</option>
                                        <option value="Fantasy World">Fantasy World</option>
                                        <option value="Knowledge Hub">Knowledge Hub</option>
                                        <option value="Kids Corner">Kids Corner</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input type="number" step="0.01" className="input w-full" defaultValue={selectedProduct.price} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" className="input w-full" defaultValue={selectedProduct.stock} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select className="input w-full" defaultValue={selectedProduct.category}>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Children's">Children's</option>
                                        <option value="Educational">Educational</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button className="btn btn-outline px-4 py-2" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary px-4 py-2" onClick={() => setShowEditModal(false)}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Product Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Product</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete this product? This action cannot be undone.
                            </p>
                            <p className="text-sm text-gray-900 mb-6">
                                You are about to delete <span className="font-semibold">{selectedProduct.name}</span>.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button className="btn btn-outline px-4 py-2" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-destructive px-4 py-2" onClick={() => setShowDeleteModal(false)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
