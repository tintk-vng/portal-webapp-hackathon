import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import Button, { ButtonType } from '@/components/common/button'
import StaticImage from '@/components/common/static-image'
import { PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'

interface ComboPackageProps {
  comboPackage: DataPackage
  selectedPackage: DataPackage | undefined
  onViewDetailsClick: (comboPackage: DataPackage) => void
}

export default function ComboPackage({
  comboPackage,
  selectedPackage,
  onViewDetailsClick,
}: ComboPackageProps) {
  const { ID, name, amount, capacity, duration, status, badgeText, features } = comboPackage
  const isMaintained = status === PackageStatus.MAINTENANCE
  const isSelected = ID === selectedPackage?.ID
  const descriptions = features[0]?.descriptions || []

  const handleViewDetailsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onViewDetailsClick(comboPackage)
  }

  return (
    <div
      className={classNames({
        'group relative flex h-32 w-full items-center justify-center rounded-lg border py-3 transition':
          true,
        'cursor-pointer md:hover:border-blue-500 md:hover:bg-other-background': !isMaintained,
        'cursor-not-allowed border-dark-50 bg-dark-25 md:hover:border-dark-50': isMaintained,
        'border-dark-50 md:hover:scale-105': !isSelected,
        'border-blue-500 bg-other-background': isSelected,
      })}
    >
      <div
        className={classNames({
          'flex h-full w-full flex-col items-start justify-between overflow-hidden border-r px-3':
            true,
          'md:group-hover:border-blue-100': !isMaintained,
          'border-dark-50': isMaintained,
          'border-dark-25': !isSelected,
          'border-blue-100': isSelected,
        })}
      >
        <div className="w-full">
          <div
            className={classNames({
              'whitespace-nowrap text-label-lg': true,
              'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
              'cursor-not-allowed text-dark-200': isMaintained,
              'text-blue-500': isSelected,
            })}
          >
            <b>{name || `${capacity.display} - ${duration.display}`}</b>
          </div>

          {!commonUtil.isEmpty(descriptions) && (
            <ul className="mt-3 w-full space-y-2">
              {descriptions!.slice(0, 2).map((description, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <StaticImage
                    src={
                      isMaintained
                        ? 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/disabled_circle_check.svg'
                        : 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/circle_check.svg'
                    }
                    width={16}
                    height={16}
                    alt="check-icon"
                    style={{ marginTop: 1 }}
                  />

                  <label
                    className={classNames({
                      'text-label-md text-dark-400': true,
                      'cursor-pointer': !isMaintained,
                      'cursor-not-allowed text-dark-200': isMaintained,
                      truncate: descriptions!.length > 1,
                      'line-clamp-2': descriptions!.length <= 1,
                    })}
                  >
                    <abbr className="no-underline" title={description}>
                      {description}
                    </abbr>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2">
          <Button type={ButtonType.TEXT_LINK} bold={false} onClick={handleViewDetailsClick}>
            Xem chi tiết
          </Button>
        </div>
      </div>

      <div className="flex h-full min-w-[102px] flex-col items-center justify-center px-2">
        <div
          className={classNames({
            'text-center text-label-lg font-bold': true,
            'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
            'cursor-not-allowed text-dark-200': isMaintained,
            'text-blue-500': isSelected,
          })}
        >
          {commonUtil.formatCurrency(amount)}
        </div>
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
