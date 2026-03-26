import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number as Malaysian Ringgit
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount)
}

// Format date in Malay format (e.g., "26 Mac 2026")
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

// Format time to HH:MM
export function formatTime(time: string | null): string {
  if (!time) return ''
  return time.substring(0, 5) // HH:MM
}