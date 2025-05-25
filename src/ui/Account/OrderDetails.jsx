import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const OrdersTab = ({ user, activeTab }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewingOrderId, setReviewingOrderId] = useState(null);
    const [reviewText, setReviewText] = useState("");

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        console.log(`Review for Order #${reviewingOrderId}:`, reviewText);
        // Example: API call to submit review here
        setReviewText("");
        setReviewingOrderId(null);
    };

    return (
        <>
            {activeTab === "orders" && (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground">View and track your orders.</p>
                    </div>

                    <div className="space-y-4">
                        {user.orders.map((order) => (
                            <Card key={order.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                                        <div>
                                            <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                            <CardDescription>{order.date}</CardDescription>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${order.status === "Delivered"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                            <span className="font-medium">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground">{item.format}</p>
                                                </div>
                                                <p className="font-medium">${item.price.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                        View Details
                                    </Button>
                                    {order.status === "Delivered" && (
                                        <Button variant="outline" size="sm" onClick={() => setReviewingOrderId(order.id)}>
                                            Write a Review
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Order #{selectedOrder.id} Details</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                                Close
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Date: {selectedOrder.date}</p>
                        <p className="text-sm text-muted-foreground">Status: {selectedOrder.status}</p>

                        <div className="space-y-2">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.format}</p>
                                    </div>
                                    <p className="font-medium">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <p className="font-semibold text-right">Total: ${selectedOrder.total.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Write Review Modal */}
            {reviewingOrderId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <form
                        onSubmit={handleReviewSubmit}
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Write a Review for Order #{reviewingOrderId}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setReviewingOrderId(null)}>
                                Close
                            </Button>
                        </div>

                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows="5"
                            placeholder="Write your review..."
                            className="w-full p-2 border rounded-md bg-background"
                            required
                        ></textarea>

                        <div className="flex justify-end">
                            <Button type="submit" size="sm">
                                Submit Review
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default OrdersTab;
