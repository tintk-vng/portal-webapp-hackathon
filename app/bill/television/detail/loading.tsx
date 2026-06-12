import Skeleton from '@/components/common/skeleton'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">Chi tiết hóa đơn</p>
      <div className="flex flex-col gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
        <Skeleton className="h-[68px] w-full rounded-lg md:h-[92px]" />
        <div className="flex flex-col items-center justify-center pt-6 md:px-8 md:pb-6">
          <Skeleton className="h-[120px] w-[120px] rounded-full md:h-[180px] md:w-[180px]" />
          <div className="flex w-full flex-col items-center justify-center gap-4 px-8 py-6">
            <Skeleton className="h-5 w-1/3 rounded-full md:h-8" />
            <Skeleton className="h-[18px] w-2/3 rounded-full md:h-5" />
          </div>
        </div>
        <Skeleton className="h-6 w-[150px] rounded-full" />
        <div className="divide-y divide-dark-50">
          <div className="flex justify-between py-3 md:py-[18px]">
            <Skeleton className="h-4 w-1/4 rounded-full md:h-5" />
            <Skeleton className="h-4 w-1/3 rounded-full md:h-5" />
          </div>
          <div className="flex justify-between py-3 md:py-[18px]">
            <Skeleton className="h-4 w-1/4 rounded-full md:h-5" />
            <Skeleton className="h-4 w-1/3 rounded-full md:h-5" />
          </div>
          <div className="flex justify-between py-3 md:py-[18px]">
            <Skeleton className="h-4 w-1/4 rounded-full md:h-5" />
            <Skeleton className="h-4 w-1/3 rounded-full md:h-5" />
          </div>
        </div>
      </div>
    </>
  )
}
