import classNames from 'classnames'
import { BadgeVariant } from '.'

interface RibbonBadge1Props {
  children: string
  variant?: BadgeVariant
  position?: 'static' | 'absolute'
}

export default function RibbonBadge1({
  children,
  variant = BadgeVariant.Positive,
  position,
}: RibbonBadge1Props) {
  return (
    <div
      className={classNames({
        [`${position}`]: true,
        'right-[-8px] top-[-8px] z-10 flex h-[18px] items-center justify-center rounded-md rounded-bl-none border border-white-500 px-1 pt-px text-white-500':
          true,
        'bg-green-500': variant === BadgeVariant.Positive,
        'bg-red-500': variant === BadgeVariant.Negative,
        'bg-dark-300': variant === BadgeVariant.Neutral,
      })}
    >
      <label className="whitespace-nowrap text-center text-label-sm font-bold">{children}</label>
    </div>
  )
}
