"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

function SettingsView({ settings, setSettings }) {
    const [formData, setFormData] = useState(settings)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Reset form when settings change
    useEffect(() => {
        setFormData(settings)
    }, [settings])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNotificationChange = (name, checked) => {
        setFormData((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked,
            },
        }))
    }

    const handleCurrencyChange = (value) => {
        setFormData((prev) => ({ ...prev, currency: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveSettings = () => {
        setSettings(formData)
        alert("Settings saved successfully!")
    }

    const handleUpdatePassword = (e) => {
        e.preventDefault()
        // In a real app, you would validate and update the password
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords don't match!")
            return
        }
        if (!passwordData.currentPassword) {
            alert("Current password is required!")
            return
        }
        alert("Password updated successfully!")
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Store Information</CardTitle>
                        <CardDescription>Update your bookstore details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">Store Name</Label>
                                <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                        <SelectItem value="gbp">GBP (£)</SelectItem>
                                        <SelectItem value="cad">CAD ($)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveSettings}>Save Changes</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Notifications</CardTitle>
                        <CardDescription>Configure which emails you want to receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="newOrder">New Order</Label>
                                <p className="text-sm text-gray-500">Receive an email when a new order is placed.</p>
                            </div>
                            <Switch
                                id="newOrder"
                                checked={formData.notifications.newOrder}
                                onCheckedChange={(checked) => handleNotificationChange("newOrder", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="lowStock">Low Stock Alert</Label>
                                <p className="text-sm text-gray-500">Get notified when a book is running low on stock.</p>
                            </div>
                            <Switch
                                id="lowStock"
                                checked={formData.notifications.lowStock}
                                onCheckedChange={(checked) => handleNotificationChange("lowStock", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="customerAccount">Customer Account Creation</Label>
                                <p className="text-sm text-gray-500">Receive an email when a new customer creates an account.</p>
                            </div>
                            <Switch
                                id="customerAccount"
                                checked={formData.notifications.customerAccount}
                                onCheckedChange={(checked) => handleNotificationChange("customerAccount", checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="marketing">Marketing Updates</Label>
                                <p className="text-sm text-gray-500">Receive updates about new features and improvements.</p>
                            </div>
                            <Switch
                                id="marketing"
                                checked={formData.notifications.marketing}
                                onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveSettings}>Save Preferences</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Update your password and security settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleUpdatePassword}>
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                                    <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                                </div>
                                <Switch id="two-factor" />
                            </div>
                            <Button type="submit" className="mt-4">
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SettingsView
