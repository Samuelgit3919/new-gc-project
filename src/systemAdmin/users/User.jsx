"use client"

import { useState } from "react"
import { Eye, Trash2, Ban, Search, Plus, MoreHorizontal } from "lucide-react"

const users = [
    { id: "1", name: "John Doe", email: "john.doe@example.com", role: "Reader", status: "Active" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com", role: "Bookstore", status: "Active" },
    { id: "3", name: "Robert Johnson", email: "robert.johnson@example.com", role: "Reader", status: "Inactive" },
    { id: "4", name: "Emily Davis", email: "emily.davis@example.com", role: "Bookstore", status: "Active" },
    { id: "5", name: "Michael Wilson", email: "michael.wilson@example.com", role: "Reader", status: "Active" },
    { id: "6", name: "Sarah Brown", email: "sarah.brown@example.com", role: "Reader", status: "Blocked" },
    { id: "7", name: "David Miller", email: "david.miller@example.com", role: "Bookstore", status: "Active" },
    { id: "8", name: "Jennifer Taylor", email: "jennifer.taylor@example.com", role: "Reader", status: "Active" },
    { id: "9", name: "James Anderson", email: "james.anderson@example.com", role: "Reader", status: "Inactive" },
    { id: "10", name: "Lisa Thomas", email: "lisa.thomas@example.com", role: "Bookstore", status: "Active" },
]

export default function User() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(null)

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleViewUser = (user) => {
        setSelectedUser(user)
        setShowViewModal(true)
        setDropdownOpen(null)
    }

    const handleDeleteUser = (user) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
        setDropdownOpen(null)
    }

    const getBadgeClass = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800"
            case "Inactive":
                return "bg-gray-100 text-gray-800"
            case "Blocked":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getRoleBadgeClass = (role) => {
        return role === "Bookstore" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="mt-2 text-gray-600">Manage all registered users on your platform</p>
                    </div>
                    <button className="btn btn-primary px-4 py-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="input w-full sm:w-48">
                    <option value="all">All Roles</option>
                    <option value="reader">Reader</option>
                    <option value="bookstore">Bookstore</option>
                </select>
                <select className="input w-full sm:w-48">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBadgeClass(user.status)}`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                className="btn btn-ghost p-2"
                                                onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                            {dropdownOpen === user.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleViewUser(user)}
                                                        >
                                                            <Eye className="mr-3 h-4 w-4" />
                                                            View details
                                                        </button>
                                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            <Ban className="mr-3 h-4 w-4" />
                                                            {user.status === "Blocked" ? "Unblock user" : "Block user"}
                                                        </button>
                                                        <button
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleDeleteUser(user)}
                                                        >
                                                            <Trash2 className="mr-3 h-4 w-4" />
                                                            Delete user
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

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">ID:</span>
                                    <span className="text-sm text-gray-900">{selectedUser.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Name:</span>
                                    <span className="text-sm text-gray-900">{selectedUser.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Email:</span>
                                    <span className="text-sm text-gray-900">{selectedUser.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Role:</span>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(selectedUser.role)}`}
                                    >
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Status:</span>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBadgeClass(selectedUser.status)}`}
                                    >
                                        {selectedUser.status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button className="btn btn-outline px-4 py-2" onClick={() => setShowViewModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete User</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>
                            <p className="text-sm text-gray-900 mb-6">
                                You are about to delete <span className="font-semibold">{selectedUser.name}</span> ({selectedUser.email}
                                ).
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
