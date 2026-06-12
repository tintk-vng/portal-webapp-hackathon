import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import { DataPackageType, PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'

interface DataCodePackageProps {
  dataCodePackage: DataPackage
  selectedPackage: DataPackage | undefined
}

export default function DataCodePackage({
  dataCodePackage,
  selectedPackage,
}: DataCodePackageProps) {
  const { type, code, capacity, amount, duration, status, badgeText } = dataCodePackage
  const isMaintained = status === PackageStatus.MAINTENANCE
  const isSelected = code === selectedPackage?.code
  const isExclusive = type === DataPackageType.EXCLUSIVE

  return (
    <div
      className={classNames({
        'group relative flex h-16 w-full items-center justify-center rounded-lg border py-2 transition md:h-[68px]':
          true,
        'cursor-pointer md:hover:border-blue-500 md:hover:bg-other-background': !isMaintained,
        'cursor-not-allowed border-dark-50 bg-dark-25 md:hover:border-dark-50': isMaintained,
        'border-dark-50 md:hover:scale-105': !isSelected,
        'border-blue-500 bg-other-background': isSelected,
      })}
    >
      <div
        className={classNames({
          'flex h-full min-w-[64px] flex-col items-center justify-center border-r px-1 md:min-w-[74px]':
            true,
          'md:group-hover:border-blue-100': !isMaintained,
          'border-dark-50': isMaintained,
          'border-dark-25': !isSelected,
          'border-blue-100': isSelected,
        })}
      >
        <div
          className={classNames({
            'w-full truncate text-center text-label-md font-bold md:text-label-lg': true,
            'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
            'cursor-not-allowed text-dark-200': isMaintained,
            'text-blue-500': isSelected,
          })}
        >
          {capacity.display}
        </div>

        <div
          className={classNames({
            'mt-1 text-label-sm': true,
            'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
            'cursor-not-allowed text-dark-200': isMaintained,
            'text-blue-500': isSelected,
          })}
        >
          {duration.display}
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center px-1">
        <label
          className={classNames({
            'text-label-md font-bold md:text-label-lg': true,
            'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
            'cursor-not-allowed text-dark-200': isMaintained,
            'text-blue-500': isSelected,
          })}
        >
          {commonUtil.formatCurrency(amount)}
        </label>
      </div>

      {isMaintained && (
        <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Neutral}>
          Bảo trì
        </Badge>
      )}

      {status === PackageStatus.ACTIVE && badgeText && (
        <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Negative}>
          {badgeText}
        </Badge>
      )}
    </div>
  )
}
