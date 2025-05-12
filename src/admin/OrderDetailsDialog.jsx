"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function OrderDetailsDialog({ open, onOpenChange, order, onUpdateStatus }) {
    if (!order) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Order ID</p>
                            <p>{order.id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p>{order.date}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p>{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Items</p>
                            <p>{order.items}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p>${order.total.toFixed(2)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Select defaultValue={order.status} onValueChange={(value) => onUpdateStatus(order.id, value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Order Items</p>
                        <div className="space-y-2">
                            {Array.from({ length: order.items }).map((_, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div>
                                        <p className="font-medium">Book Title {index + 1}</p>
                                        <p className="text-sm text-gray-500">Qty: 1</p>
                                    </div>
                                    <p>${(order.total / order.items).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderDetailsDialog
