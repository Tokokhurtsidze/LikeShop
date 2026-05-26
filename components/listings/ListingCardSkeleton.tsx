import { Skeleton } from '@/components/ui/Skeleton'

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
