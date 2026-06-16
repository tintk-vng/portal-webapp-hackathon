import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import { PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { Campaign } from '@/src/data/campaigns'
import { getEffectiveSku } from '@/src/data/discounts'
import { TopupSku } from '@/src/data/catalog'

interface GamePackageProps {
  dataPackage: DataPackage
  selectedPackage: DataPackage | undefined
  campaign?: Campaign
}

export default function GamePackage({ dataPackage, selectedPackage, campaign }: GamePackageProps) {
  const { amount, originalAmount, status, badgeText } = dataPackage
  const isMaintained = status === PackageStatus.MAINTENANCE
  const isSelected = amount === selectedPackage?.amount
  const tempSku: TopupSku = {
    id: `${dataPackage.telcoCode.toLowerCase()}-${dataPackage.originalAmount || dataPackage.amount}`,
    publisherId: dataPackage.telcoCode.toLowerCase(),
    amount: dataPackage.originalAmount || dataPackage.amount,
    displayAmount: `${(dataPackage.originalAmount || dataPackage.amount) / 1000}.000đ`,
  }
  const effectiveSku = campaign 
    ? getEffectiveSku(campaign, tempSku) 
    : { discountPercent: 0, salePrice: dataPackage.amount, basePrice: dataPackage.amount }
  const hasCampaignDiscount = (effectiveSku.discountPercent ?? 0) > 0
  const displayedSalePrice = hasCampaignDiscount ? effectiveSku.salePrice : dataPackage.amount
  const originalPriceWhenDiscounted = hasCampaignDiscount ? effectiveSku.basePrice : null

  const faceValue = dataPackage.originalAmount || dataPackage.amount

  return (
    <div
      className={classNames({
        'group relative flex h-[66px] w-full flex-col items-center justify-center gap-0.5 rounded-lg border p-2 transition md:h-[72px]':
          true,
        'cursor-pointer md:hover:border-blue-500 md:hover:bg-other-background': !isMaintained,
        'cursor-not-allowed border-dark-50 bg-dark-25 md:hover:border-dark-50': isMaintained,
        'border-dark-50 md:hover:scale-105': !isSelected,
        'border-blue-500 bg-other-background': isSelected,
      })}
    >
      <span
        className={classNames({
          'text-center font-bold text-label-lg': true,
          'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
          'cursor-not-allowed text-dark-200': isMaintained,
          'text-blue-500': isSelected && !isMaintained,
          'text-dark-500': !isSelected && !isMaintained,
        })}
      >
        {commonUtil.formatCurrency(faceValue)}
      </span>

      <span
        className={classNames({
          'text-center text-label-xs': true,
          'text-dark-200': isMaintained,
          'text-dark-300': !isMaintained,
        })}
      >
        Giá bán:{' '}
        <span
          className={classNames({
            'font-bold text-green-600': !isMaintained,
            'text-dark-200': isMaintained,
          })}
        >
          {commonUtil.formatCurrency(displayedSalePrice)}
        </span>
      </span>

      {isMaintained && (
        <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Neutral}>
          Bảo trì
        </Badge>
      )}

      {status === PackageStatus.ACTIVE && (badgeText || hasCampaignDiscount) && (
        <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Negative}>
          {hasCampaignDiscount ? `-${effectiveSku.discountPercent}%` : badgeText}
        </Badge>
      )}
    </div>
  )
}

