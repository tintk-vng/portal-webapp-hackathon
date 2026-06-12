import Breadcrumb from '@/app/game/_components/breadcrumb'
import Skeleton from '@/components/common/skeleton'

export default function LoadingState() {
  return (
    <>
      <Breadcrumb />

      <div className="space-y-6">
        <Skeleton className="h-6 w-full rounded" />

        <Skeleton className="h-6 w-1/2 rounded" />

        <div className="space-y-3">
          {Array.apply(null, Array(16)).map((value, index) => (
            <Skeleton key={index} className="h-4 w-full rounded" />
          ))}

          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </>
  )
}
