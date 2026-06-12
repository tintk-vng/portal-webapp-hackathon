import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import { PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'

interface PhoneCardPackageProps {
  phoneCardPackage: DataPackage
  selectedPackage: DataPackage | undefined
}

export default function PhoneCardPackage({
  phoneCardPackage,
  selectedPackage,
}: PhoneCardPackageProps) {
  const { amount, status, badgeText } = phoneCardPackage
  const isMaintained = status === PackageStatus.MAINTENANCE
  const isSelected = amount === selectedPackage?.amount

  return (
    <div
      className={classNames({
        'group relative flex h-[52px] w-full items-center justify-center rounded-lg border transition md:h-[68px]':
          true,
        'cursor-pointer md:hover:border-blue-500 md:hover:bg-other-background': !isMaintained,
        'cursor-not-allowed border-dark-50 bg-dark-25 md:hover:border-dark-50': isMaintained,
        'border-dark-50 md:hover:scale-105': !isSelected,
        'border-blue-500 bg-other-background': isSelected,
      })}
    >
      <label
        className={classNames({
          'text-label-lg font-bold': true,
          'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
          'cursor-not-allowed text-dark-200': isMaintained,
          'text-blue-500': isSelected,
        })}
      >
        {commonUtil.formatCurrency(amount)}
      </label>

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
