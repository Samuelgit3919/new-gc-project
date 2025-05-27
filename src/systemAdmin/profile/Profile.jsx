"use client"

import { useState } from "react"
import { User, Mail, Lock, Save } from "lucide-react"

export default function Profile() {
    const [activeTab, setActiveTab] = useState("profile")
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
                <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "profile"
                                ? "border-teal-500 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "security"
                                ? "border-teal-500 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "notifications"
                                ? "border-teal-500 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Notifications
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === "profile" && (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                        <p className="text-sm text-gray-500">Update your personal information and profile picture</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <img className="h-24 w-24 rounded-full" src="/placeholder.svg?height=96&width=96" alt="Admin" />
                            <div className="space-y-2">
                                <h3 className="font-medium">Profile Picture</h3>
                                <div className="flex gap-2">
                                    <button className="btn btn-outline text-sm px-3 py-1">Upload New</button>
                                    <button className="btn btn-outline text-sm px-3 py-1">Remove</button>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <input type="text" className="input flex-1" defaultValue="Admin" disabled={!isEditing} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <input type="text" className="input flex-1" defaultValue="User" disabled={!isEditing} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <input type="email" className="input flex-1" defaultValue="admin@example.com" disabled={!isEditing} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <input type="text" className="input" defaultValue="Administrator" disabled />
                                <p className="text-sm text-gray-500">Your role cannot be changed</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between">
                        <button className="btn btn-outline px-4 py-2" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                        {isEditing && (
                            <button className="btn btn-primary px-4 py-2">
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "security" && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Password</h3>
                            <p className="text-sm text-gray-500">Change your password to keep your account secure</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                    <input type="password" className="input flex-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                    <input type="password" className="input flex-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                    <input type="password" className="input flex-1" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-primary px-4 py-2">Update Password</button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-500">Protect your account with an additional security step</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Sessions</h3>
                            <p className="text-sm text-gray-500">Manage your active sessions across devices</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="font-medium">Current Session</h3>
                                        <p className="text-sm text-gray-500">Chrome on Windows • IP 192.168.1.1</p>
                                        <p className="text-xs text-gray-500">Active now</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                                </div>
                                <hr className="border-gray-200" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="font-medium">Previous Session</h3>
                                        <p className="text-sm text-gray-500">Safari on macOS • IP 192.168.1.2</p>
                                        <p className="text-xs text-gray-500">Last active: 2 days ago</p>
                                    </div>
                                    <button className="btn btn-outline text-sm px-3 py-1">Revoke</button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50">
                            <button className="btn btn-outline w-full px-4 py-2">Log Out of All Sessions</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "notifications" && (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                        <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">New User Registrations</h3>
                                <p className="text-sm text-gray-500">Get notified when a new user registers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">New Product Listings</h3>
                                <p className="text-sm text-gray-500">Get notified when a new product is listed</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">System Updates</h3>
                                <p className="text-sm text-gray-500">Get notified about system updates and maintenance</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50">
                        <button className="btn btn-primary px-4 py-2">Save Preferences</button>
                    </div>
                </div>
            )}
        </div>
    )
}
