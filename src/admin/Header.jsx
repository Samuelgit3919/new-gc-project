"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

export default function Header({ title, searchQuery, setSearchQuery }) {
    const navigate = useNavigate()

    const showBookshopToast = () => {
        const toastId = toast(
            <div className="flex flex-col items-center">
                <span className="mb-2 font-medium">Add your Bookshop information</span>
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={() => {
                        toast.dismiss(toastId)
                        navigate('/bookStoreProfilePage')
                    }}
                >
                    Go to Bookstore Profile Page
                </button>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                position: 'top-center',
            }
        )
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center flex-1 gap-4 md:gap-8">
                <h1 className="text-xl font-semibold">{title}</h1>
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full bg-gray-100 pl-8 dark:bg-gray-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    to="/bookStoreProfilePage"
                    variant="outline"
                    className="ml-2 border-1 border-amber-400 rounded-md px-4 py-2"
                    onClick={showBookshopToast}
                >
                    Add Bookshop Info
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Help</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
