import Image from '@/components/common/image'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface StateViewProps {
  artworkSrc: any
  children?: ReactNode
  className?: string
}
export default function StateView({ artworkSrc, children, className = '' }: StateViewProps) {
  return (
    <div
      className={classNames({
        'flex flex-col items-center justify-center pt-6 md:pb-6': true,
        [className]: className,
      })}
    >
      <Image
        className="h-[120px] w-[120px] md:h-[180px] md:w-[180px]"
        src={artworkSrc}
        priority
        width={180}
        height={180}
        alt="state-view-artwork"
      />
      {children && (
        <div className="flex w-full flex-col items-center justify-center gap-2 md:gap-4 px-8 py-6">
          {children}
        </div>
      )}
    </div>
  )
}
