import React from 'react'
import { useState } from 'react'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import classNames from 'classnames'

interface ITooltipProps {
  title: string
  placement?: 'top' | 'left' | 'right'
  children: React.ReactNode
  onClick?: Function
}

const Tooltip = (props: ITooltipProps) => {
  const { title, placement = 'top', children, onClick = () => {} } = props
  const [show, setShow] = useState(false)
  const { size } = useScreen()
  const isMobile = size === ScreenSize.MEDIUM || size === ScreenSize.SMALL
  return (
    <div
      className="relative inline-block"
      onClick={() => {
        setShow(!show)
        onClick(!show)
      }}
    >
      <span
        style={{ left: isMobile ? -100 : -16 }}
        className={classNames({
          'absolute w-[204px] rounded-lg bg-blue-500 px-3 py-2 opacity-0 transition-all duration-200 after:absolute':
            true,
          'top-[-62px] after:top-[calc(100%-6px)] after:border-l-[12px] after:border-r-[12px] after:border-t-[12px] after:border-l-transparent after:border-r-transparent after:border-t-blue-500':
            placement === 'top',
          'left-[calc(-100%-6px)] top-[50%] translate-x-[50%] translate-y-[-50%] after:right-[6px] after:top-[50%] after:translate-y-[-50%] after:border-b-[12px] after:border-l-[12px] after:border-t-[12px] after:border-b-transparent after:border-l-blue-500 after:border-t-transparent':
            placement === 'left',
          'right-[calc(-100%-6px)] top-[50%] translate-x-[-50%] translate-y-[-50%] after:left-[-6px] after:top-[50%] after:border-b-[12px] after:border-r-[12px] after:border-t-[12px] after:border-b-transparent after:border-r-blue-500 after:border-t-transparent':
            placement === 'right',
          'after:!left-[96px]': isMobile,
          'visible opacity-100': show,
          'invisible opacity-0': !show,
        })}
      >
        <label className="text-white-500">{title}</label>
      </span>
      {children}
    </div>
  )
}
export default Tooltip
