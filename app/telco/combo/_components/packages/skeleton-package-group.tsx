import Skeleton, { SkeletonType } from '@/components/common/skeleton'

function SkeletonPackage() {
  return (
    <div className="group relative flex h-[122px] w-full items-center justify-center rounded-lg border border-dark-50 py-3">
      <div className="flex h-full w-full flex-col items-start justify-between overflow-hidden border-r border-dark-25 px-3">
        <div className="w-full">
          <div className="flex h-5 items-center">
            <Skeleton className="w-2/3" type={SkeletonType.TITLE} />
          </div>

          <ul className="mt-3 w-full space-y-2">
            {Array.apply(null, Array(2)).map((value, index) => (
              <li key={index} className="flex h-[18px] items-center">
                <Skeleton className="mr-1 h-4 min-w-[16px]" />

                <Skeleton type={SkeletonType.SUB_TITLE} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 flex h-[18px] w-1/2 items-center">
          <Skeleton type={SkeletonType.SUB_TITLE} />
        </div>
      </div>

      <div className="min-w-[102px] px-2">
        <div className="flex h-full w-full items-center">
          <Skeleton type={SkeletonType.TITLE} />
        </div>
      </div>
    </div>
  )
}

export default function SkeletonPackageGroup() {
  return (
    <>
      <div className="mb-3 flex h-6 w-1/3 items-center md:mb-4">
        <Skeleton type={SkeletonType.TITLE} />
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.apply(null, Array(3)).map((value, index) => (
          <li key={index}>
            <SkeletonPackage />
          </li>
        ))}
      </ul>
    </>
  )
}
