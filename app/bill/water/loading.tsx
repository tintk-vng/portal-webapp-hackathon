import Skeleton from '@/components/common/skeleton'

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
        <div className="w-full">
          <Skeleton className="mb-3 h-6 w-[100px] rounded-full" />
          <div className="flex w-full gap-x-3">
            <Skeleton className="h-[40px] w-[80px] rounded-full" />
            <Skeleton className="h-[40px] w-[100px] rounded-full" />
            <Skeleton className="h-[40px] w-[75px] rounded-full" />
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="mb-6 h-6 w-[100px] rounded-full" />
          <Skeleton className="mb-3 h-[52px] w-full rounded-lg" />
        </div>
        <div className="w-full">
          <Skeleton className="mb-3 h-6 w-[100px] rounded-full" />
          <Skeleton className="h-[52px] w-full rounded-lg" />
        </div>
        <div className="w-full">
          <Skeleton className="mb-3 h-6 w-[100px] rounded-full" />
          <Skeleton className="mx-auto h-[100px] w-2/3 rounded-lg" />
        </div>
      </div>
    </>
  )
}
