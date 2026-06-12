import classNames from 'classnames'
import Image from '../image'

export enum SkeletonType {
  IMAGE = 'IMAGE',
  TITLE = 'TITLE',
  SUB_TITLE = 'SUB_TITLE',
}

interface SkeletonProps {
  className?: string
  type?: SkeletonType
}

export default function Skeleton({ className = '', type }: SkeletonProps) {
  return (
    <div
      className={classNames({
        'min-h-2 animate-pulse rounded-full bg-[linear-gradient(91.83deg,#F0F6FF_0.64%,#E8F0FD_63.77%,#EEF4FE_100%)]':
          true,
        'h-2': type === SkeletonType.SUB_TITLE,
        'h-3': type === SkeletonType.TITLE,
        'relative overflow-hidden rounded-lg': type === SkeletonType.IMAGE,
        'w-full': !className,
        [className]: !!className,
      })}
    >
      {type === SkeletonType.IMAGE && (
        <Image
          className="h-full w-full scale-150"
          src={''}
          fill
          style={{ objectFit: 'cover' }}
          alt="skeleton-image"
        />
      )}
    </div>
  )
}
