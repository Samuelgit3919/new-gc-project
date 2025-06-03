import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Search, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function NotificationViewer() {
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const res = await fetch("https://bookcompass.onrender.com/api/users/notifications", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Please login to view notifications');
                }
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();
            setNotifications(data.data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const res = await fetch(`https://bookcompass.onrender.com/api/users/notifications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ read: true })
            });

            if (!res.ok) throw new Error("Failed to mark notification as read");

            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            toast.success('Notification marked as read');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const res = await fetch(`https://bookcompass.onrender.com/api/users/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Failed to mark all notifications as read");

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
            );
            toast.success('All notifications marked as read');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filteredNotifications = notifications.filter((n) =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-lg font-medium text-gray-900">{error}</p>
                <button 
                    onClick={fetchNotifications}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/page"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Page</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                </div>
                <div className="flex items-center gap-4">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Mark all as read
                        </button>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">No notifications found</p>
                    <p className="text-gray-500">We'll notify you when something important happens.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-lg border ${
                                notification.read ? 'bg-white' : 'bg-blue-50'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                    <p className="text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="ml-4 text-blue-600 hover:text-blue-800"
                                    >
                                        <CheckCircle className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
