'use client'

import Button, { ButtonType } from '@/components/common/button'
import classNames from 'classnames'
import StaticImage from '../static-image'

interface StateViewProps {
  artworkSrc: any
  title: string
  description: string
  className?: string
  buttonText?: string
  buttonType?: ButtonType
  onButtonClick?: () => void
}

export default function StateView({
  artworkSrc,
  title,
  description,
  className = '',
  buttonText,
  buttonType = ButtonType.PRIMARY,
  onButtonClick,
}: StateViewProps) {
  return (
    <div
      className={classNames({
        'jutify-center flex flex-col items-center px-8 py-6': true,
        [className]: className,
      })}
    >
      <StaticImage
        className="h-[120px] w-[120px] md:h-[180px] md:w-[180px]"
        src={artworkSrc}
        width={180}
        height={180}
        priority
        alt="state-view-artwork"
        loader={({ src }) => src}
      />

      <div className="mt-6 text-center text-label-lg font-bold md:text-2xl">{title}</div>

      <div className="mt-2 text-center text-label-md text-dark-300 md:mt-4 md:text-base/[20px]">
        {description}
      </div>

      {buttonText && (
        <div className="mt-6 w-[280px] md:h-[44px]">
          <Button
            width="w-full"
            type={buttonType}
            bold={buttonType === ButtonType.PRIMARY}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  )
}
