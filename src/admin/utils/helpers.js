export function getTitle(activeView) {
  switch (activeView) {
    case "dashboard":
      return "Dashboard"
    case "books":
      return "Book Management"
    case "orders":
      return "Order Management"
    case "users":
      return "User Management"
    case "settings":
      return "Settings"
    default:
      return "Bookstore Admin"
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    // ... other cases
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }
}