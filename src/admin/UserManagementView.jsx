"use client"

import { Search, X, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react"
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

interface UserManagementViewProps {
    users: any[]
    filteredUsers: any[]
    currentUsers: any[]
    searchQuery: string
    setSearchQuery: (query: string) => void
    userActiveFilters: {
        roles: string[]
        statuses: string[]
    }
    userRoles: string[]
    userStatuses: string[]
    userCurrentPage: number
    setUserCurrentPage: (page: number) => void
    userTotalPages: number
    userIndexOfFirstItem: number
    userIndexOfLastItem: number
    toggleFilter: (filterType: string, filterValue: string, filterState: any, setFilterState: any) => void
    clearFilters: (setFilterState: any) => void
    setUserActiveFilters: (filters: any) => void
    getStatusColor: (status: string) => string
    getRoleColor: (role: string) => string
}

export default function UserManagementView({
    users,
    filteredUsers,
    currentUsers,
    searchQuery,
    setSearchQuery,
    userActiveFilters,
    userRoles,
    userStatuses,
    userCurrentPage,
    setUserCurrentPage,
    userTotalPages,
    userIndexOfFirstItem,
    userIndexOfLastItem,
    toggleFilter,
    clearFilters,
    setUserActiveFilters,
    getStatusColor,
    getRoleColor,
}: UserManagementViewProps) {
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
                    {(userActiveFilters.roles.length > 0 || userActiveFilters.statuses.length > 0) && (
                        <Button variant="outline" size="sm" onClick={() => clearFilters(setUserActiveFilters)}>
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
                            {userRoles.map((role) => (
                                <DropdownMenuCheckboxItem
                                    key={role}
                                    checked={userActiveFilters.roles.includes(role)}
                                    onCheckedChange={() => toggleFilter("roles", role, userActiveFilters, setUserActiveFilters)}
                                >
                                    {role}
                                </DropdownMenuCheckboxItem>
                            ))}

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {userStatuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={userActiveFilters.statuses.includes(status)}
                                    onCheckedChange={() => toggleFilter("statuses", status, userActiveFilters, setUserActiveFilters)}
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
                        Showing <strong>{userIndexOfFirstItem + 1}</strong> to{" "}
                        <strong>{Math.min(userIndexOfLastItem, filteredUsers.length)}</strong> of{" "}
                        <strong>{filteredUsers.length}</strong> users
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setUserCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={userCurrentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>

                        {Array.from({ length: Math.min(5, userTotalPages) }, (_, i) => {
                            let pageNum = i + 1
                            if (userTotalPages > 5) {
                                if (userCurrentPage > 3) {
                                    pageNum = userCurrentPage - 3 + i
                                }
                                if (pageNum > userTotalPages) {
                                    pageNum = userTotalPages - (4 - i)
                                }
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={userCurrentPage === pageNum ? "outline" : "ghost"}
                                    size="sm"
                                    className={userCurrentPage === pageNum ? "font-medium" : ""}
                                    onClick={() => setUserCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setUserCurrentPage((prev) => Math.min(userTotalPages, prev + 1))}
                            disabled={userCurrentPage === userTotalPages}
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
