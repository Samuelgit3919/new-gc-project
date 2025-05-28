"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export default function AdminProfile() {
    const [activeTab, setActiveTab] = useState("profile")

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
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                                    <AvatarFallback>AU</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Label>Profile Picture</Label>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload New
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Admin" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="User" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue="admin@example.com" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" defaultValue="Administrator" disabled />
                                <p className="text-xs text-muted-foreground">Your role cannot be changed</p>
                            </div>

                            <Button className="bg-teal-600 hover:bg-teal-700">Edit Profile</Button>
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
