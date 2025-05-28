"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Reader", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Bookstore", status: "Active" },
    { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", role: "Reader", status: "Inactive" },
    { id: 4, name: "Emily Davis", email: "emily.davis@example.com", role: "Bookstore", status: "Active" },
    { id: 5, name: "Michael Wilson", email: "michael.wilson@example.com", role: "Reader", status: "Active" },
    { id: 6, name: "Sarah Brown", email: "sarah.brown@example.com", role: "Reader", status: "Blocked" },
    { id: 7, name: "David Miller", email: "david.miller@example.com", role: "Bookstore", status: "Active" },
    { id: 8, name: "Jennifer Taylor", email: "jennifer.taylor@example.com", role: "Reader", status: "Active" },
    { id: 9, name: "James Anderson", email: "james.anderson@example.com", role: "Reader", status: "Inactive" },
    { id: 10, name: "Lisa Thomas", email: "lisa.thomas@example.com", role: "Bookstore", status: "Active" },
]

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
        const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesRole && matchesStatus
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage all registered users on your platform</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="reader">Reader</SelectItem>
                        <SelectItem value="bookstore">Bookstore</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="flex-1">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NAME</TableHead>
                                <TableHead>EMAIL</TableHead>
                                <TableHead>ROLE</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-blue-600">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.role === "Bookstore"
                                                    ? "text-blue-600 border-blue-200"
                                                    : "text-purple-600 border-purple-200"
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.status === "Active"
                                                    ? "text-green-600 border-green-200"
                                                    : user.status === "Inactive"
                                                        ? "text-gray-600 border-gray-200"
                                                        : "text-red-600 border-red-200"
                                            }
                                        >
                                            {user.status}
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
