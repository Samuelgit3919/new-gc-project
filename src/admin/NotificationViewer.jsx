import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Search, XCircle, Loader2 } from 'lucide-react';

export default function NotificationViewer() {
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/notifications");
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const data = await res.json();
            console.log(data);
            setNotifications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        // Optionally send a PATCH to backend to update `read` status
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
        // Optionally send a PATCH to backend for all
    };

    const filteredNotifications = notifications.filter((n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="text-blue-600" />
                    Notifications
                    {unreadCount > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h2>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Mark all as read
                </button>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search notifications..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-8">
                    <Loader2 className="animate-spin mx-auto mb-3 text-blue-500" size={32} />
                    Loading notifications...
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">
                    <XCircle className="mx-auto mb-3 text-red-400" size={40} />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`cursor-pointer rounded-lg p-4 shadow transition ${notification.read
                                    ? 'bg-white hover:bg-gray-50'
                                    : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                                    {!notification.read && (
                                        <span className="text-sm text-blue-600 font-medium">New</span>
                                    )}
                                </div>
                                <p className="text-gray-600 mt-1">{notification.message}</p>
                                <div className="text-xs text-gray-400 mt-2">
                                    {new Date(notification.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <XCircle className="mx-auto mb-3 text-red-400" size={40} />
                            <p>No notifications found</p>
                        </div>
                    )}
                </div>
            )}

            {!loading && notifications.length > 0 && unreadCount === 0 && (
                <div className="text-center text-green-600 mt-6">
                    <CheckCircle className="mx-auto mb-2" size={32} />
                    You're all caught up!
                </div>
            )}
        </div>
    );
}
