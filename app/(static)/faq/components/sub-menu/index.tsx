import { DesignSystemIconSize } from '@/constants/common'
import classNames from 'classnames'

interface SubMenuProps {
  title: string
  onClick: () => void
  className?: string
  isActive?: boolean
}

export default function SubMenu({ title, className = '', onClick, isActive }: SubMenuProps) {
  const handleClick = () => {
    !isActive && onClick()
  }

  return (
    <>
      <span className="divider block px-4">
        <span className="block h-px bg-dark-50" />
      </span>
      <button
        type="button"
        className={classNames({
          'flex w-full px-4 py-3 transition-[background] hover:bg-blue-25/40': true,
          [className]: !!className,
        })}
        onClick={handleClick}
      >
        <p
          className="pr-3 text-left"
          style={{ width: `calc(100% - ${DesignSystemIconSize.ic24}px)` }}
        >
          {title}
        </p>

        <span
          className={classNames({
            'h-6 w-6 min-w-6 bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons/check.svg")] bg-contain bg-no-repeat':
              true,
            invisible: !isActive,
          })}
        />
      </button>
    </>
  )
}
