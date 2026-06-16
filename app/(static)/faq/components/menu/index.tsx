'use client'

import Image from '@/components/common/image'
import { DesignSystemIconSize } from '@/constants/common'
import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState, useCallback } from 'react'

interface MenuProps {
  title: string
  children: ReactNode
  preIconLink?: string
  className?: string
  isCollapsed?: boolean
}
export default function Menu({
  preIconLink,
  title,
  children,
  className = '',
  isCollapsed: initCollapsed,
}: MenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const inlineSpacing = 12
  let missingWidth = DesignSystemIconSize.ic24 + inlineSpacing
  if (preIconLink) {
    missingWidth += DesignSystemIconSize.ic36 + inlineSpacing
  }

  const handleClick = useCallback(() => {
    setIsCollapsed(!isCollapsed)
    if (contentRef?.current) {
      const it = contentRef.current
      if (!isCollapsed) {
        it.style.maxHeight = it.scrollHeight + 'px'
      } else {
        it.style.maxHeight = '0'
      }
    }
  }, [isCollapsed])

  useEffect(() => {
    if (initCollapsed) {
      handleClick()
    }
  }, [initCollapsed, handleClick])

  return (
    <div
      className={classNames({
        'ease overflow-hidden rounded-lg border transition-colors': true,
        'border-other-background bg-other-background': !isCollapsed,
        'border-blue-500 bg-white-500': isCollapsed,
        [className]: !!className,
      })}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center space-x-3 px-4 py-3 md:py-4"
        onClick={handleClick}
      >
        {preIconLink && (
          <div className="h-[36px] w-[36px]">
            <Image src={preIconLink} width={36} height={36} alt="logo" />
          </div>
        )}
        <p className="text-left text-label-lg" style={{ width: `calc(100% - ${missingWidth}px)` }}>
          {title}
        </p>
        <div className="h-[24px] w-[24px]">
          <Image
            className={classNames({
              'transition-transform duration-200': true,
              'rotate-90': !isCollapsed,
            })}
            src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_arrow_up1.svg"
            width={DesignSystemIconSize.ic24}
            height={DesignSystemIconSize.ic24}
            alt="icon"
          />
        </div>
      </button>
      <div ref={contentRef} style={{ transition: 'max-height 150ms ease', maxHeight: '0px' }}>
        {children}
      </div>
    </div>
  )
}
