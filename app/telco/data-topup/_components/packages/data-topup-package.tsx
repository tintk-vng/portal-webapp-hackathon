import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import Image from '@/components/common/image'
import { DataPackageType, PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'

interface DataTopupPackageProps {
  dataTopupPackage: DataPackage
  selectedPackage: DataPackage | undefined
}

export default function DataTopupPackage({
  dataTopupPackage,
  selectedPackage,
}: DataTopupPackageProps) {
  const { ID, type, amount, name, capacity, duration, status, badgeText, extraInfo } =
    dataTopupPackage
  const { icons } = extraInfo?.highlightFeatures || {}
  const isMaintained = status === PackageStatus.MAINTENANCE
  const isSelected = ID === selectedPackage?.ID
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
        {icons ? (
          <div className="flex flex-wrap">
            {[icons].map((icon: string) => {
              const src = `https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/${icon}.svg`
              return (
                <div key={icon} className="flex grow basis-6/12 items-center justify-center p-1">
                  <Image
                    className={classNames({
                      // 'h-4 w-4': icons.length > 1,
                      // 'h-12 w-12': icons.length === 1,
                      grayscale: isMaintained,
                    })}
                    width={icons.length === 1 ? 48 : 16}
                    height={icons.length === 1 ? 48 : 16}
                    src={src}
                    alt="feature-icon"
                  />
                </div>
              )
            })}
          </div>
        ) : name ? (
          <div
            className={classNames({
              'w-full truncate text-center text-label-md font-bold md:text-label-lg': true,
              'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
              'cursor-not-allowed text-dark-200': isMaintained,
              'text-blue-500': isSelected,
            })}
          >
            {name}
          </div>
        ) : (
          <>
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
          </>
        )}
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
