// import { clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
// src/lib/utils.js
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
