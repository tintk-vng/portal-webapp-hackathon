import Skeleton from '@/components/common/skeleton'

export default function Loading() {
  return (
    <div>
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">Tin tức</div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl">
            <Skeleton className="aspect-[2/1] w-full rounded-xl" />

            <div className="space-y-3 py-4">
              <Skeleton className="h-4 w-1/3 rounded" />

              <Skeleton className="h-5 w-full rounded" />

              <Skeleton className="h-4 w-full rounded" />

              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
