

import { useState, useEffect } from "react"
import { Search, Filter, Eye, ChevronLeft, ChevronRight, X } from "lucide-react"
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
import { getStatusColor, getRoleColor, toggleFilter, clearFilters } from "../admin/utils/helpers"

function UserManagementView({ users, setUsers, searchQuery, setSearchQuery }) {
    const [filteredUsers, setFilteredUsers] = useState(users)
    const [currentPage, setCurrentPage] = useState(1)
    const [activeFilters, setActiveFilters] = useState({
        roles: [],
        statuses: [],
    })

    const itemsPerPage = 5

    // Get unique roles and statuses for filters
    const roles = Array.from(new Set(users.map((user) => user.role)))
    const statuses = Array.from(new Set(users.map((user) => user.status)))

    // Apply filters and search
    useEffect(() => {
        let result = [...users]

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
            )
        }

        // Apply role filters
        if (activeFilters.roles.length > 0) {
            result = result.filter((user) => activeFilters.roles.includes(user.role))
        }

        // Apply status filters
        if (activeFilters.statuses.length > 0) {
            result = result.filter((user) => activeFilters.statuses.includes(user.status))
        }

        setFilteredUsers(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [users, searchQuery, activeFilters])

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const indexOfLastUser = currentPage * itemsPerPage
    const indexOfFirstUser = indexOfLastUser - itemsPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="w-full pl-8 bg-white dark:bg-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    {(activeFilters.roles.length > 0 || activeFilters.statuses.length > 0) && (
                        <Button variant="outline" size="sm" onClick={() => clearFilters("users", setActiveFilters, setSearchQuery)}>
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
                            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {roles.map((role) => (
                                <DropdownMenuCheckboxItem
                                    key={role}
                                    checked={activeFilters.roles.includes(role)}
                                    onCheckedChange={() => toggleFilter("roles", role, activeFilters, setActiveFilters)}
                                >
                                    {role}
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
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead className="text-right">Orders</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getRoleColor(user.role)} variant="outline">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(user.status)} variant="outline">
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                    <TableCell className="text-right">{user.orders}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No users found matching your criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <strong>{indexOfFirstUser + 1}</strong> to{" "}
                        <strong>{Math.min(indexOfLastUser, filteredUsers.length)}</strong> of{" "}
                        <strong>{filteredUsers.length}</strong> users
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
        </div>
    )
}

export default UserManagementView
