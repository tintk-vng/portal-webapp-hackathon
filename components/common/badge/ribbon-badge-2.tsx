import classNames from 'classnames'
import { BadgeVariant } from '.'

interface RibbonBadge2Props {
  children: string
  variant?: BadgeVariant
  position?: 'static' | 'absolute'
}

export default function RibbonBadge2({
  children,
  variant = BadgeVariant.Positive,
  position,
}: RibbonBadge2Props) {
  return (
    <div
      className={classNames({
        [`${position}`]: true,
        "right-[-3px] top-[-8px] z-10 flex h-[18px] items-center justify-center rounded-md rounded-br-none border border-white-500 px-1.5 pt-px text-white-500 after:absolute after:bottom-[-2px] after:right-0 after:h-0 after:w-0 after:border-r-2 after:border-t-2 after:border-solid after:border-transparent after:content-['']":
          true,
        'bg-green-500 after:border-t-green-700': variant === BadgeVariant.Positive,
        'bg-red-500 after:border-t-red-700': variant === BadgeVariant.Negative,
        'bg-dark-300 after:border-t-dark-700': variant === BadgeVariant.Neutral,
      })}
    >
      <label className="whitespace-nowrap text-center text-label-sm font-bold">{children}</label>
    </div>
  )
}
