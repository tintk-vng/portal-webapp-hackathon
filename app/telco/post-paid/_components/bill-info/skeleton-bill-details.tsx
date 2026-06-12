import Skeleton, { SkeletonType } from '@/components/common/skeleton'

export default function SkeletonBillDetails() {
  return (
    <div className="mb-6">
      <div className="mb-6 flex flex-col items-center md:mb-9">
        <Skeleton
          className="mb-1 h-[60px] w-[60px] md:mb-4 md:h-[180px] md:w-[180px]"
          type={SkeletonType.IMAGE}
        />

        <div className="mb-0.5 flex h-9 items-center md:mb-3">
          <Skeleton className="w-40" type={SkeletonType.TITLE} />
        </div>

        <div className="flex h-7 items-center">
          <Skeleton className="w-48" type={SkeletonType.SUB_TITLE} />
        </div>
      </div>

      <ul>
        {Array.apply(null, Array(3)).map((value, index) => (
          <li
            key={index}
            className="flex min-h-[56px] items-center justify-between border-b border-dark-50 py-[18px] last:border-b-0"
          >
            <Skeleton className="w-32" type={SkeletonType.SUB_TITLE} />

            <Skeleton className="w-32" type={SkeletonType.SUB_TITLE} />
          </li>
        ))}
      </ul>
    </div>
  )
}
