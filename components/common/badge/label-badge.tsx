import classNames from 'classnames'
import { BadgeVariant } from '.'

interface LabelBadgeProps {
  children: string
  variant?: BadgeVariant
}

export default function LabelBadge({ children, variant = BadgeVariant.Positive }: LabelBadgeProps) {
  return (
    <div
      className={classNames({
        'mx-2 flex h-6 items-center rounded-lg px-3 text-white-500': true,
        'bg-green-500': variant === BadgeVariant.Positive,
        'bg-orange-500 text-orange-800': variant === BadgeVariant.Informative,
        'bg-red-500': variant === BadgeVariant.Negative,
        'bg-dark-300': variant === BadgeVariant.Neutral,
      })}
    >
      <label className="whitespace-nowrap text-center text-label-md">{children}</label>
    </div>
  )
}
