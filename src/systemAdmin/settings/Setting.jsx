"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function Setting() {
    const [activeTab, setActiveTab] = useState("general")
    const [maintenanceMode, setMaintenanceMode] = useState(false)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">Manage your platform settings and configurations</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "general"
                                ? "border-teal-500 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab("appearance")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "appearance"
                                ? "border-teal-500 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Appearance
                        </button>
                        <button
                            onClick={() => setActiveTab("advanced")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "advanced"
                                ? "border-teal-500 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Advanced
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === "general" && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Site Information</h3>
                            <p className="text-sm text-gray-500">Update your platform's basic information</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Site Name</label>
                                <input type="text" className="input w-full" defaultValue="E-commerce SaaS Platform" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Site Description</label>
                                <textarea
                                    className="input w-full h-20 resize-none"
                                    defaultValue="A platform for managing e-commerce products and users"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                <input type="email" className="input w-full" defaultValue="contact@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Support Phone</label>
                                <input type="text" className="input w-full" defaultValue="+1 (555) 123-4567" />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-primary px-4 py-2">
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Maintenance Mode</h3>
                            <p className="text-sm text-gray-500">
                                Enable maintenance mode to temporarily disable access to the platform
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-medium">Enable Maintenance Mode</h3>
                                    <p className="text-sm text-gray-500">When enabled, only administrators can access the platform</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={maintenanceMode}
                                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                            {maintenanceMode && (
                                <div className="space-y-2 pt-4">
                                    <label className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                                    <textarea
                                        className="input w-full h-20 resize-none"
                                        defaultValue="We're currently performing maintenance. Please check back later."
                                    />
                                    <p className="text-sm text-gray-500">This message will be displayed to users during maintenance</p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-primary px-4 py-2">Save Settings</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "appearance" && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Theme Settings</h3>
                            <p className="text-sm text-gray-500">Customize the appearance of your admin panel</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Theme Mode</label>
                                <select className="input w-full" defaultValue="light">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                <select className="input w-full" defaultValue="teal">
                                    <option value="teal">Teal</option>
                                    <option value="blue">Blue</option>
                                    <option value="purple">Purple</option>
                                    <option value="green">Green</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Font Size</label>
                                <select className="input w-full" defaultValue="medium">
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-medium">Reduced Motion</h3>
                                    <p className="text-sm text-gray-500">Minimize animations for accessibility</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-primary px-4 py-2">Apply Theme</button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Dashboard Layout</h3>
                            <p className="text-sm text-gray-500">Customize the layout of your dashboard</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Sidebar Position</label>
                                <select className="input w-full" defaultValue="left">
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-medium">Compact Mode</h3>
                                    <p className="text-sm text-gray-500">Use a more compact layout for the dashboard</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-medium">Show Quick Actions</h3>
                                    <p className="text-sm text-gray-500">Display quick action buttons on the dashboard</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-primary px-4 py-2">Save Layout</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "advanced" && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">API Settings</h3>
                            <p className="text-sm text-gray-500">Manage API access and keys</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-medium">Enable API Access</h3>
                                    <p className="text-sm text-gray-500">Allow external applications to access your platform via API</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">API Key</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        className="input flex-1"
                                        defaultValue="sk_live_51NcgYtKV7tLgCKPzJAPtgbTwTtqIyZcDgkrNGMY"
                                    />
                                    <button className="btn btn-outline px-4 py-2">Regenerate</button>
                                </div>
                                <p className="text-sm text-gray-500">Keep this key secret. Do not share it with others.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
                                <input type="url" className="input w-full" placeholder="https://your-app.com/webhook" />
                                <p className="text-sm text-gray-500">URL to receive webhook notifications</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-primary px-4 py-2">Save API Settings</button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
                            <p className="text-sm text-gray-500">Manage your platform data and exports</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">Export Data</h3>
                                <p className="text-sm text-gray-500">Download a backup of your platform data</p>
                                <div className="flex gap-2 pt-2">
                                    <button className="btn btn-outline px-4 py-2">Export Users</button>
                                    <button className="btn btn-outline px-4 py-2">Export Products</button>
                                    <button className="btn btn-outline px-4 py-2">Full Backup</button>
                                </div>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="space-y-2">
                                <h3 className="font-medium">Clear Cache</h3>
                                <p className="text-sm text-gray-500">Clear the application cache to resolve potential issues</p>
                                <button className="btn btn-outline px-4 py-2 mt-2">Clear Cache</button>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="space-y-2">
                                <h3 className="font-medium text-red-600">Danger Zone</h3>
                                <p className="text-sm text-gray-500">These actions are irreversible</p>
                                <div className="flex gap-2 pt-2">
                                    <button className="btn btn-destructive px-4 py-2">Reset Platform</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
