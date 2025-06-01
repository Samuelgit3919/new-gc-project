"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { useNavigate } from "react-router-dom"

export default function AdminProfile() {
    const [activeTab, setActiveTab] = useState("profile")
    const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", role: "Administrator", image: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [editSuccess, setEditSuccess] = useState("");
    const [editError, setEditError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [imageError, setImageError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch profile");
            const data = await res.json();
            setProfile(data.data || data);
        } catch (err) {
            setError(err.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError("");
        setEditSuccess("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/admin/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to update profile");
            }
            setEditSuccess("Profile updated successfully");
            fetchProfile();
        } catch (err) {
            setEditError(err.message || "Failed to update profile");
        } finally {
            setEditLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageUploading(true);
        setImageError("");
        try {
            // Assume backend supports /api/admin/profile/image (adjust if needed)
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch("https://bookcompass.onrender.com/api/admin/profile/image", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to upload image");
            fetchProfile();
        } catch (err) {
            setImageError(err.message || "Failed to upload image");
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        setImageUploading(true);
        setImageError("");
        try {
            // Assume backend supports DELETE /api/admin/profile/image
            const token = localStorage.getItem("token");
            const res = await fetch("https://bookcompass.onrender.com/api/admin/profile/image", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to remove image");
            fetchProfile();
        } catch (err) {
            setImageError(err.message || "Failed to remove image");
        } finally {
            setImageUploading(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Admin Profile</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information and profile picture</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {loading ? (
                                <div>Loading profile...</div>
                            ) : error ? (
                                <div className="text-red-500">{error}</div>
                            ) : (
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {editError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{editError}</div>}
                                    {editSuccess && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">{editSuccess}</div>}
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={profile.image || "/placeholder.svg?height=80&width=80"} />
                                            <AvatarFallback>AU</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Label>Profile Picture</Label>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm" disabled={imageUploading}>
                                                    <label>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload New
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                    </label>
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={handleRemoveImage} disabled={imageUploading}>
                                                    Remove
                                                </Button>
                                            </div>
                                            {imageError && <div className="text-red-500 text-xs mt-1">{imageError}</div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleProfileChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleProfileChange} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" name="role" value={profile.role} disabled />
                                        <p className="text-xs text-muted-foreground">Your role cannot be changed</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={editLoading}>{editLoading ? "Saving..." : "Save Changes"}</Button>
                                        <Button type="button" variant="outline" onClick={handleLogout}>Logout</Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password to keep your account secure</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                            <Button className="bg-teal-600 hover:bg-teal-700">Update Password</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>Add an extra layer of security to your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Protect your account with an additional security step</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>Manage your active sessions across devices</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Current Session</p>
                                    <p className="text-sm text-muted-foreground">Chrome on Windows • IP 192.168.1.1</p>
                                    <p className="text-xs text-muted-foreground">Active now</p>
                                </div>
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                    Current
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Previous Session</p>
                                    <p className="text-sm text-muted-foreground">Safari on macOS • IP 192.168.1.2</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Revoke
                                </Button>
                            </div>

                            <Button variant="outline" className="w-full">
                                Log Out of All Sessions
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Manage how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New User Registrations</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when a new user registers</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New Product Listings</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when a new product is listed</p>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>System Updates</Label>
                                    <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Button className="bg-teal-600 hover:bg-teal-700">Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
