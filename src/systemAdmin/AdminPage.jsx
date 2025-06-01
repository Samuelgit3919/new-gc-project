import { useState, useContext } from "react"
import {
    BarChart3,
    Users,
    Package,
    SettingsIcon,
    User,
    ChevronDown,
    LogOut,
    Bell,
    Plus,
    Search,
    Home,
    Activity,
    PanelLeft,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Import all components
import Dashboard from "./dashboard/Dashboard"
import UserManagement from "./users/UserManagement"
import ProductManagement from "./products/ProductManagement"
import AdminProfile from "./profile/AdminProfile"
import Settings from "./settings/Settings"

// Built-in Sidebar Components
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Sheet, SheetContent } from "../components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { DataContext } from "../DataProvider/DataProvider"
import { Type } from "../Utility/action.type"

const mainNavigation = [
    {
        title: "Dashboard",
        icon: BarChart3,
        id: "dashboard",
        badge: null,
    },
]

const managementItems = [
    {
        title: "User Management",
        icon: Users,
        id: "users",
        badge: "2.8k",
    },
    {
        title: "Product Management",
        icon: Package,
        id: "products",
        badge: "12k",
    },
]

const accountItems = [
    {
        title: "Admin Profile",
        icon: User,
        id: "profile",
        badge: null,
    },
    {
        title: "Settings",
        icon: SettingsIcon,
        id: "settings",
        badge: null,
    },
]

const quickActions = [
    {
        title: "Add User",
        icon: Plus,
        action: "add-user",
    },
    {
        title: "Add Product",
        icon: Package,
        action: "add-product",
    },
    {
        title: "View Analytics",
        icon: Activity,
        action: "analytics",
    },
]

function SidebarTrigger({ onClick, className = "" }) {
    return (
        <Button variant="ghost" size="icon" className={`h-7 w-7 ${className}`} onClick={onClick}>
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
}

function AppSidebar({ activeSection, setActiveSection, isCollapsed, isMobile, onClose }) {
    const navigate = useNavigate();
    const [{ user }, dispatch] = useContext(DataContext);
    const handleQuickAction = (action) => {
        switch (action) {
            case "add-user":
                setActiveSection("users")
                break
            case "add-product":
                setActiveSection("products")
                break
            case "analytics":
                setActiveSection("dashboard")
                break
            default:
                break
        }
        if (isMobile) onClose?.()
    }

    const handleNavigation = (sectionId) => {
        setActiveSection(sectionId)
        if (isMobile) onClose?.()
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: Type.SET_USER, user: null });
        navigate("/login");
    };

    const SidebarContent = () => (
        <div className="flex h-full w-full flex-col bg-sidebar">
            {/* Sidebar Header */}
            <div className="flex flex-col gap-2 p-2 border-b border-sidebar-border">
                <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex w-full items-center gap-2 text-left">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                                    <BarChart3 className="size-4" />
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">Admin Panel</span>
                                            <span className="truncate text-xs text-sidebar-foreground/70">BookStore Platform</span>
                                        </div>
                                        <ChevronDown className="ml-auto size-4" />
                                    </>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="start" sideOffset={4}>
                            <DropdownMenuItem onClick={() => handleNavigation("dashboard")}>
                                <Home className="mr-2 h-4 w-4" />
                                <span>Go to Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigation("settings")}>
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                <span>Platform Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Notifications</span>
                                <Badge variant="secondary" className="ml-auto">
                                    3
                                </Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Search className="mr-2 h-4 w-4" />
                                <span>Search Platform</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">
                {/* Main Navigation */}
                <div className="relative flex w-full min-w-0 flex-col">
                    {!isCollapsed && (
                        <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2">
                            Overview
                        </div>
                    )}
                    <div className="w-full text-sm">
                        <ul className="flex w-full min-w-0 flex-col gap-1">
                            {mainNavigation.map((item) => (
                                <li key={item.id} className="group/menu-item relative">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handleNavigation(item.id)}
                                                    className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground ${activeSection === item.id ? "bg-teal-100 text-teal-700 font-medium" : ""
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4 shrink-0" />
                                                    {!isCollapsed && (
                                                        <>
                                                            <span className="truncate">{item.title}</span>
                                                            {item.badge && (
                                                                <Badge variant="secondary" className="ml-auto h-5 w-auto px-1 text-xs">
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                        </>
                                                    )}
                                                </button>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right" align="center">
                                                    {item.title}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="mx-2 w-auto bg-sidebar-border h-px" />

                {/* Management Section */}
                <div className="relative flex w-full min-w-0 flex-col">
                    {!isCollapsed && (
                        <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2">
                            Management
                        </div>
                    )}
                    <div className="w-full text-sm">
                        <ul className="flex w-full min-w-0 flex-col gap-1">
                            {managementItems.map((item) => (
                                <li key={item.id} className="group/menu-item relative">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handleNavigation(item.id)}
                                                    className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground ${activeSection === item.id ? "bg-teal-100 text-teal-700 font-medium" : ""
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4 shrink-0" />
                                                    {!isCollapsed && (
                                                        <>
                                                            <span className="truncate">{item.title}</span>
                                                            {item.badge && (
                                                                <Badge variant="secondary" className="ml-auto h-5 w-auto px-1 text-xs">
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                        </>
                                                    )}
                                                </button>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right" align="center">
                                                    {item.title}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="mx-2 w-auto bg-sidebar-border h-px" />

                {/* Account Section */}
                <div className="relative flex w-full min-w-0 flex-col">
                    {!isCollapsed && (
                        <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2">
                            Account
                        </div>
                    )}
                    <div className="w-full text-sm">
                        <ul className="flex w-full min-w-0 flex-col gap-1">
                            {accountItems.map((item) => (
                                <li key={item.id} className="group/menu-item relative">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handleNavigation(item.id)}
                                                    className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground ${activeSection === item.id ? "bg-teal-100 text-teal-700 font-medium" : ""
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4 shrink-0" />
                                                    {!isCollapsed && (
                                                        <>
                                                            <span className="truncate">{item.title}</span>
                                                            {item.badge && (
                                                                <Badge variant="secondary" className="ml-auto h-5 w-auto px-1 text-xs">
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                        </>
                                                    )}
                                                </button>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right" align="center">
                                                    {item.title}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="mx-2 w-auto bg-sidebar-border h-px" />

                {/* Quick Actions Group */}
                <div className="relative flex w-full min-w-0 flex-col mt-auto">
                    {!isCollapsed && (
                        <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2">
                            Quick Actions
                        </div>
                    )}
                    <div className="w-full text-sm">
                        <ul className="flex w-full min-w-0 flex-col gap-1">
                            {quickActions.map((item) => (
                                <li key={item.action} className="group/menu-item relative">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handleQuickAction(item.action)}
                                                    className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-teal-50 hover:text-teal-700 focus-visible:ring-2 active:bg-teal-50 active:text-teal-700"
                                                >
                                                    <item.icon className="h-4 w-4 shrink-0" />
                                                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                                                </button>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right" align="center">
                                                    {item.title}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Sidebar Footer */}
                <div className="flex flex-col gap-2 p-2 border-t border-sidebar-border">
                    <ul className="flex w-full min-w-0 flex-col gap-1">
                        <li className="group/menu-item relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "Admin User"} />
                                            <AvatarFallback className="rounded-lg bg-teal-600 text-white">{user?.name ? user.name.split(" ").map(n => n[0]).join("") : "AU"}</AvatarFallback>
                                        </Avatar>
                                        {!isCollapsed && (
                                            <>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">{user?.name || "Admin User"}</span>
                                                    <span className="truncate text-xs text-sidebar-foreground/70">{user?.email || "admin@bookstore.com"}</span>
                                                </div>
                                                <ChevronDown className="ml-auto size-4" />
                                            </>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-lg" side="top" align="start" sideOffset={4}>
                                    <DropdownMenuItem onClick={() => handleNavigation("profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Account</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleNavigation("settings")}>
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Bell className="mr-2 h-4 w-4" />
                                        <span>Notifications</span>
                                        <Badge variant="secondary" className="ml-auto">
                                            3
                                        </Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )

    if (isMobile) {
        return (
            <Sheet open={true} onOpenChange={onClose}>
                <SheetContent side="left" className="w-[280px] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <div className="group peer hidden md:block text-sidebar-foreground">
            <div
                className={`duration-200 relative h-svh bg-transparent transition-[width] ease-linear ${isCollapsed ? "w-[3rem]" : "w-[16rem]"
                    }`}
            />
            <div
                className={`duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex ${isCollapsed ? "w-[3rem]" : "w-[16rem]"
                    } left-0 border-r border-sidebar-border`}
            >
                <SidebarContent />
            </div>
        </div>
    )
}

export default function AdminPanel() {
    const [activeSection, setActiveSection] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isMobile] = useState(false)

    const getSectionTitle = () => {
        switch (activeSection) {
            case "dashboard":
                return "Dashboard"
            case "users":
                return "User Management"
            case "products":
                return "Product Management"
            case "profile":
                return "Admin Profile"
            case "settings":
                return "Settings"
            default:
                return "Dashboard"
        }
    }

    const getSectionDescription = () => {
        switch (activeSection) {
            case "dashboard":
                return "Overview of your platform performance and key metrics"
            case "users":
                return "Manage all registered users on your platform"
            case "products":
                return "Manage all products listed on your platform"
            case "profile":
                return "Manage your account settings and preferences"
            case "settings":
                return "Configure platform settings and preferences"
            default:
                return "Overview of your platform performance and key metrics"
        }
    }

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <Dashboard />
            case "users":
                return <UserManagement />
            case "products":
                return <ProductManagement />
            case "profile":
                return <AdminProfile />
            case "settings":
                return <Settings />
            default:
                return <Dashboard />
        }
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div className="group/sidebar-wrapper flex min-h-svh w-full">
                <AppSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isCollapsed={!sidebarOpen}
                    isMobile={isMobile}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="relative flex min-h-svh flex-1 flex-col bg-background">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                        <div className="flex items-center gap-2 px-4 w-full">
                            <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} className="-ml-1" />
                            <div className="h-4 w-px bg-sidebar-border" />

                            {/* Breadcrumb Navigation */}
                            <div className="flex items-center gap-2 flex-1">
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">{getSectionTitle()}</h1>
                                    <p className="text-xs text-muted-foreground">{getSectionDescription()}</p>
                                </div>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="relative p-2 rounded-md hover:bg-sidebar-accent">
                                            <Bell className="h-4 w-4" />
                                            <Badge
                                                variant="destructive"
                                                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                                            >
                                                3
                                            </Badge>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80">
                                        <div className="p-2">
                                            <h4 className="font-medium">Notifications</h4>
                                            <p className="text-sm text-muted-foreground">You have 3 unread notifications</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium">New user registered</p>
                                                <p className="text-xs text-muted-foreground">John Doe joined the platform</p>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium">Product added</p>
                                                <p className="text-xs text-muted-foreground">New book "The Great Adventure" was listed</p>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium">System update</p>
                                                <p className="text-xs text-muted-foreground">Platform updated to version 2.1.0</p>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <button className="p-2 rounded-md hover:bg-sidebar-accent" onClick={() => setActiveSection("settings")}>
                                    <SettingsIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{renderContent()}</div>
                </main>
            </div>
        </TooltipProvider>
    )
}
