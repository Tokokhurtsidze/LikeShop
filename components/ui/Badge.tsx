import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'sale' | 'rent_monthly' | 'rent_daily' | 'active' | 'inactive' | 'sold' | 'featured'
  className?: string
}

const variantClasses = {
  sale: 'bg-emerald-100 text-emerald-800',
  rent_monthly: 'bg-blue-100 text-blue-800',
  rent_daily: 'bg-purple-100 text-purple-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  sold: 'bg-red-100 text-red-800',
  featured: 'bg-amber-100 text-amber-800',
}

export function Badge({ children, variant = 'active', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
