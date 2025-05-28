// Return page titles based on active view
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

// Return color classes based on stock or user status
export function getStatusColor(status) {
  if (!status || typeof status !== 'string') {
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }

  switch (status.toLowerCase()) {
    case "in stock":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "low stock":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "out of stock":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    case "banned":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }
}


// Return color classes based on user role
export function getRoleColor(role) {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "user":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "staff":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }
}

// Toggle filter for roles or statuses
export function toggleFilter(type, value, activeFilters, setActiveFilters) {
  const updated = activeFilters[type].includes(value)
    ? activeFilters[type].filter((item) => item !== value)
    : [...activeFilters[type], value]

  setActiveFilters({ ...activeFilters, [type]: updated })
}

// Clear all filters and optionally reset search
export function clearFilters(context, setActiveFilters, setSearchQuery) {
  setActiveFilters({
    roles: [],
    statuses: [],
  })

  if (setSearchQuery) {
    setSearchQuery("")
  }
}
// helpers.js

export function calculateMonthlySales(orders) {
  const months = Array(12).fill(0)
  const sales = Array(12).fill(0)

  orders.forEach(order => {
    const date = new Date(order.date)
    const month = date.getMonth()
    sales[month] += order.total
    months[month] = date.toLocaleString("default", { month: "short" })
  })

  return { months, sales }
}

export function getTopSellingBooks(books) {
  return books
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
}

