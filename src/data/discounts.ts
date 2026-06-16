import { Campaign, getCampaignDiscountLabel, getCampaignSkuDiscounts } from './campaigns'
import { TopupSku, topupSkus } from './catalog'

export type DiscountBadge = {
  label: string
  campaignId: string
  discountPercent: number
}

export type EffectiveTopupSku = TopupSku & {
  basePrice: number
  salePrice: number
  displaySalePrice: string
  discountAmount: number
  discountPercent?: number
  campaignId?: string
}

function formatVnd(value: number) {
  return `${value.toLocaleString('vi-VN')}đ`
}

function findDiscountPercentForSku(campaign: Campaign, sku: TopupSku) {
  const rule = getCampaignSkuDiscounts(campaign).find((discountRule) => {
    if (discountRule.skuId) {
      return discountRule.skuId === sku.id
    }

    return discountRule.publisherId === sku.publisherId
  })

  return rule?.discountPercent
}

export function getDiscountForPublisher(campaign: Campaign, publisherId: string) {
  const hasEligibleSku = getCampaignSkuDiscounts(campaign).some((discountRule) => {
    if (discountRule.publisherId) {
      return discountRule.publisherId === publisherId
    }

    return topupSkus.some((sku) => sku.id === discountRule.skuId && sku.publisherId === publisherId)
  })

  if (!hasEligibleSku || !campaign.discountPercent) {
    return undefined
  }

  const label = getCampaignDiscountLabel(campaign)
  return label ? { label, campaignId: campaign.id, discountPercent: campaign.discountPercent } : undefined
}

export function getDiscountForSku(campaign: Campaign, sku: TopupSku) {
  const discountPercent = findDiscountPercentForSku(campaign, sku)
  const label = discountPercent ? getCampaignDiscountLabel({ ...campaign, discountPercent }) : undefined

  return label && discountPercent ? { label, campaignId: campaign.id, discountPercent } : undefined
}

export function getEffectiveSku(campaign: Campaign, sku: TopupSku): EffectiveTopupSku {
  const discountPercent = findDiscountPercentForSku(campaign, sku)
  const salePrice = discountPercent ? Math.round((sku.amount * (100 - discountPercent)) / 100) : sku.amount
  const discountAmount = Math.max(sku.amount - salePrice, 0)

  return {
    ...sku,
    basePrice: sku.amount,
    salePrice,
    displaySalePrice: formatVnd(salePrice),
    discountAmount,
    discountPercent,
    campaignId: discountPercent ? campaign.id : undefined
  }
}
