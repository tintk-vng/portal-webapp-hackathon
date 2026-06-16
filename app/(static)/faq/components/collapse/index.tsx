'use client'

import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState, useCallback } from 'react'

interface CollapseProps {
  title: string
  children: ReactNode
  className?: string
  postIcon?: ReactNode
  isCollapsed?: boolean
}
export default function Collapse({
  title,
  children,
  className = '',
  postIcon,
  isCollapsed: initCollapsed,
}: CollapseProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const handleClick = useCallback(() => {
    setIsCollapsed(!isCollapsed)
    if (contentRef?.current) {
      const content = contentRef.current
      if (!isCollapsed) {
        content.style.maxHeight = content.scrollHeight + 'px'
      } else {
        content.style.maxHeight = '0'
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
        'overflow-hidden rounded-lg bg-other-background': true,
        collapsed: isCollapsed,
        [className]: !!className,
      })}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center p-4"
        onClick={handleClick}
      >
        <p
          className={classNames({
            'w-full text-left text-label-lg': true,
            'font-bold': isCollapsed,
          })}
        >
          {title}
        </p>
        {postIcon && (
          <div
            className="ml-3 transition-transform duration-200"
            style={isCollapsed ? {} : { transform: 'rotateX(180deg)' }}
          >
            {postIcon}
          </div>
        )}
      </button>
      <div ref={contentRef} style={{ transition: 'max-height 150ms ease', maxHeight: '0px' }}>
        {children}
      </div>
    </div>
  )
}
