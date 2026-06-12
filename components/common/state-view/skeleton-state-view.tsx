import Skeleton, { SkeletonType } from '../skeleton'

export default function SkeletonStateView() {
  return (
    <div className="jutify-center flex flex-col items-center px-8 py-6">
      <Skeleton
        className="h-[120px] w-[120px] md:h-[180px] md:w-[180px]"
        type={SkeletonType.IMAGE}
      />

      <div className="mt-6 flex h-5 w-full items-center justify-center md:h-8">
        <Skeleton className="w-1/2" type={SkeletonType.TITLE} />
      </div>

      <div className="mt-2 flex h-[18px] w-full items-center md:mt-4 md:h-5">
        <Skeleton type={SkeletonType.SUB_TITLE} />
      </div>

      <Skeleton className="mt-6 h-10 w-[280px] rounded-lg md:h-[44px]" />
    </div>
  )
}
