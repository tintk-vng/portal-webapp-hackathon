import Skeleton from '@/components/common/skeleton'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="flex flex-col gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
        <Skeleton className="h-[68px] w-full rounded-lg md:h-[92px]" />
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
