"use client"

import { useState } from "react"
import { Download, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general")
    const [themeMode, setThemeMode] = useState("light")
    const [primaryColor, setPrimaryColor] = useState("teal")
    const [fontSize, setFontSize] = useState("medium")
    const [reducedMotion, setReducedMotion] = useState(false)
    const [sidebarPosition, setSidebarPosition] = useState("left")
    const [compactMode, setCompactMode] = useState(false)
    const [showQuickActions, setShowQuickActions] = useState(true)
    const [apiAccess, setApiAccess] = useState(true)
    const [apiKey, setApiKey] = useState("sk_live_abcd1234567890...")
    const [webhookUrl, setWebhookUrl] = useState("https://your-app.com/webhook")

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground text-blue-600">Manage your platform settings and configurations</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance" className="text-blue-600">
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="text-blue-600">
                        Advanced
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Information</CardTitle>
                            <CardDescription>Basic information about your platform</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="site-name">Site Name</Label>
                                <Input id="site-name" defaultValue="BookStore Platform" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="site-description">Site Description</Label>
                                <Textarea
                                    id="site-description"
                                    defaultValue="A comprehensive e-commerce platform for bookstores and readers"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact-email">Contact Email</Label>
                                <Input id="contact-email" type="email" defaultValue="support@bookstore.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="site-url">Site URL</Label>
                                <Input id="site-url" defaultValue="https://bookstore.com" />
                            </div>
                            <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Controls</CardTitle>
                            <CardDescription>Control platform-wide settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable to temporarily disable site access for maintenance
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New User Registration</Label>
                                    <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto-approve Products</Label>
                                    <p className="text-sm text-muted-foreground">Automatically approve new product listings</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Settings</CardTitle>
                            <CardDescription className="text-blue-600">
                                Customize the appearance of your <span className="text-blue-600">admin panel</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Theme Mode</Label>
                                <Select value={themeMode} onValueChange={setThemeMode}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Primary Color</Label>
                                <Select value={primaryColor} onValueChange={setPrimaryColor}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teal">Teal</SelectItem>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="purple">Purple</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Font Size</Label>
                                <Select value={fontSize} onValueChange={setFontSize}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Reduced Motion</Label>
                                    <p className="text-sm text-muted-foreground text-blue-600">Minimize animations for accessibility</p>
                                </div>
                                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                            </div>

                            <Button className="bg-teal-600 hover:bg-teal-700">Apply Theme</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard Layout</CardTitle>
                            <CardDescription className="text-blue-600">Customize the layout of your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Sidebar Position</Label>
                                <Select value={sidebarPosition} onValueChange={setSidebarPosition}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Compact Mode</Label>
                                    <p className="text-sm text-muted-foreground text-blue-600">
                                        Use a more compact layout for the dashboard
                                    </p>
                                </div>
                                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Show Quick Actions</Label>
                                    <p className="text-sm text-muted-foreground text-blue-600">
                                        Display quick action buttons on the dashboard
                                    </p>
                                </div>
                                <Switch checked={showQuickActions} onCheckedChange={setShowQuickActions} />
                            </div>

                            <Button className="bg-teal-600 hover:bg-teal-700">Save Layout</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Settings</CardTitle>
                            <CardDescription className="text-blue-600">Manage API access and keys</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable API Access</Label>
                                    <p className="text-sm text-muted-foreground text-blue-600">
                                        Allow external applications to access your platform via API
                                    </p>
                                </div>
                                <Switch checked={apiAccess} onCheckedChange={setApiAccess} />
                            </div>

                            <div className="space-y-3">
                                <Label>API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button variant="outline">Regenerate</Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-blue-600">
                                    Keep this key secret. Do not share it with others.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label>Webhook URL</Label>
                                <Input
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    placeholder="https://your-app.com/webhook"
                                />
                                <p className="text-xs text-muted-foreground text-blue-600">URL to receive webhook notifications</p>
                            </div>

                            <Button className="bg-teal-600 hover:bg-teal-700">Save API Settings</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription className="text-blue-600">Manage your platform data and exports</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Export Data</Label>
                                <p className="text-sm text-muted-foreground text-blue-600">Download a backup of your platform data</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Users
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Products
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Full Backup
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Clear Cache</Label>
                                <p className="text-sm text-muted-foreground text-blue-600">
                                    Clear the application cache to resolve potential issues
                                </p>
                                <Button variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Clear Cache
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription className="text-red-600">These actions are irreversible</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Reset Platform
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
