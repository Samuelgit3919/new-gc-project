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

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", email: "", role: "Buyer", password: "" });
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [actionLoading, setActionLoading] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        setAddError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/admin/createUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to add user");
            }
            setAddDialogOpen(false);
            setAddForm({ name: "", email: "", role: "Buyer", password: "" });
            fetchUsers();
        } catch (err) {
            setAddError(err.message || "Failed to add user");
        } finally {
            setAddLoading(false);
        }
    };

    const handleUserAction = async (userId, action) => {
        setActionLoading(userId + action);
        try {
            const token = localStorage.getItem("token");
            let url = "";
            let method = "PUT";
            if (action === "block") url = `/api/admin/users/${userId}/block`;
            if (action === "unblock") url = `/api/admin/users/${userId}/unblock`;
            if (action === "delete") {
                url = `https://bookcompass.onrender.com/api/admin/users/${userId}`;
                method = "DELETE";
            }
            if (!url) return;
            const res = await fetch(url.startsWith("http") ? url : `https://bookcompass.onrender.com${url}`, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Action failed");
            fetchUsers();
        } catch (err) {
            alert(err.message || "Action failed");
        } finally {
            setActionLoading("");
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || (user.role?.toLowerCase() || "") === roleFilter.toLowerCase();
        const status = (user.status || user.accountStatus || "").toLowerCase();
        const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {loading && <div className="text-center py-8">Loading users...</div>}
            {error && <div className="text-center text-red-500 py-8">{error}</div>}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage all registered users on your platform</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setAddDialogOpen(true)}>
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
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
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
                                <TableRow key={user._id || user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-blue-600">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.role === "Seller"
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
                                                (user.status || user.accountStatus) === "Active"
                                                    ? "text-green-600 border-green-200"
                                                    : (user.status || user.accountStatus) === "Inactive"
                                                        ? "text-gray-600 border-gray-200"
                                                        : "text-red-600 border-red-200"
                                            }
                                        >
                                            {(user.status || user.accountStatus || "").charAt(0).toUpperCase() + (user.status || user.accountStatus || "").slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleUserAction(user._id, "block")} disabled={actionLoading === user._id + "block"}>
                                                Block
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleUserAction(user._id, "unblock")} disabled={actionLoading === user._id + "unblock"}>
                                                Unblock
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleUserAction(user._id, "delete")} disabled={actionLoading === user._id + "delete"}>
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

            {/* Add User Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        {addError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{addError}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={addForm.role} onValueChange={val => setAddForm(f => ({ ...f, role: val }))}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Buyer">Buyer</SelectItem>
                                    <SelectItem value="Seller">Seller</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} disabled={addLoading}>Cancel</Button>
                            <Button type="submit" disabled={addLoading}>{addLoading ? "Adding..." : "Add User"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
