import Skeleton from '@/components/common/skeleton'

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center pt-6 text-label-md md:py-3 md:text-label-lg">
      <Skeleton className="h-[80px] w-[80px] rounded-full md:mb-4" />

      <div className="flex w-full flex-col items-center gap-y-2 px-8 pb-4 pt-6 md:gap-y-3 md:p-0">
        <Skeleton className="h-5 w-1/3 rounded-full md:mb-4 md:h-8" />

        <Skeleton className="h-[18px] w-2/3 rounded-full md:mb-4 md:h-7" />
      </div>
    </div>
  )
}
