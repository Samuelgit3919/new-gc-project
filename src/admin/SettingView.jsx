"use client"

import type React from "react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Textarea } from "../components/ui/textarea"

interface SettingsViewProps {
    settings: {
        storeName: string
        email: string
        phone: string
        currency: string
        address: string
        notifications: {
            newOrder: boolean
            lowStock: boolean
            customerAccount: boolean
            marketing: boolean
        }
    }
    settingsFormData: {
        storeName: string
        email: string
        phone: string
        currency: string
        address: string
        notifications: {
            newOrder: boolean
            lowStock: boolean
            customerAccount: boolean
            marketing: boolean
        }
    }
    passwordData: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }
    handleSettingsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleNotificationChange: (name: string, checked: boolean) => void
    handleCurrencyChange: (value: string) => void
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSaveSettings: () => void
    handleUpdatePassword: (e: React.FormEvent) => void
}

export default function SettingsView({
    settings,
    settingsFormData,
    passwordData,
    handleSettingsChange,
    handleNotificationChange,
    handleCurrencyChange,
    handlePasswordChange,
    handleSaveSettings,
    handleUpdatePassword,
}: SettingsViewProps) {
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
                                <Input
                                    id="storeName"
                                    name="storeName"
                                    value={settingsFormData.storeName}
                                    onChange={handleSettingsChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={settingsFormData.email}
                                    onChange={handleSettingsChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={settingsFormData.phone}
                                    onChange={handleSettingsChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={settingsFormData.currency} onValueChange={handleCurrencyChange}>
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
                            <Textarea id="address" name="address" value={settingsFormData.address} onChange={handleSettingsChange} />
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
                                checked={settingsFormData.notifications.newOrder}
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
                                checked={settingsFormData.notifications.lowStock}
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
                                checked={settingsFormData.notifications.customerAccount}
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
                                checked={settingsFormData.notifications.marketing}
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
