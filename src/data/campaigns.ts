import { getItemById, topupSkus } from './catalog'
import { getArticleById } from './newsArticles'

export type CampaignSkuDiscount = {
  id: string
  skuId?: string
  publisherId?: string
  discountPercent?: number
  enabled: boolean
}

export type Campaign = {
  id: string
  title: string
  subtitle?: string
  bannerImageUrl: string
  mobileBannerImageUrl?: string
  altText: string
  targetPublisherId?: string
  targetGameIds?: string[]
  discountPercent?: number
  discountText?: string
  skuDiscounts?: CampaignSkuDiscount[]
  ctaText?: string
  articleId?: string
  enabled: boolean
  priority: number
  isTopBanner?: boolean
  validFrom?: string
  validTo?: string
  themeClassName?: string
}

type CampaignSource = 'editable' | 'last-known-valid' | 'fallback'

export type CampaignValidationResult = {
  campaign: Campaign
  errors: string[]
}

// AI_AGENT_EDITABLE: update active campaigns and banner slot content
export const campaigns: Campaign[] = [
  {
    id: "weekly-garena-2026-06-16-4",
    title: "Ưu đãi nạp Garena trong tuần",
    subtitle: "Giảm 5% cho Free Fire, Liên Quân Mobile trên NapTheVui.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    altText: "Garena promotion banner",
    targetPublisherId: "garena",
    targetGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    discountPercent: 5,
    discountText: "Giảm 5%",
    skuDiscounts: [
      {
        id: "weekly-garena-2026-06-16-4-garena-eligible-skus",
        publisherId: "garena",
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-garena-2026-06-16-4",
    enabled: true,
    priority: 260,
    isTopBanner: true,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  }
]

// FALLBACK_SAFE: previous validated campaign/discount data used when editable campaign data is invalid.
const lastKnownValidCampaigns: Campaign[] = [
  {
    id: 'garena-free-fire-week-safe',
    title: 'Free Fire Anniversary',
    subtitle: 'Nạp thẻ Garena, ưu đãi đồng bộ cho thẻ đủ điều kiện',
    bannerImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png',
    altText: 'Garena Free Fire Anniversary banner',
    targetPublisherId: 'garena',
    targetGameIds: ['free-fire'],
    discountPercent: 5,
    discountText: 'Giảm 5%',
    skuDiscounts: [
      {
        id: 'garena-safe-all-skus',
        publisherId: 'garena',
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: 'Xem ưu đãi',
    articleId: 'garena-free-fire-week',
    enabled: true,
    priority: 100,
    validFrom: '2026-06-10T00:00:00+07:00',
    validTo: '2026-06-30T23:59:59+07:00',
    themeClassName: 'from-[#E75648] via-[#F1865F] to-[#FFD58F]'
  }
]

const fallbackCampaigns: Campaign[] = [
  {
    id: 'fallback-garena-discount',
    title: 'Ưu đãi Garena',
    subtitle: 'Chọn Garena và nhận ưu đãi cho mệnh giá đủ điều kiện',
    bannerImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png',
    altText: 'Garena promotion banner',
    targetPublisherId: 'garena',
    discountPercent: 3,
    discountText: 'Giảm 3%',
    skuDiscounts: [
      {
        id: 'fallback-garena-all-skus',
        publisherId: 'garena',
        discountPercent: 3,
        enabled: true
      }
    ],
    ctaText: 'Xem ưu đãi',
    enabled: true,
    priority: 1,
    themeClassName: 'from-[#E75648] via-[#F1865F] to-[#FFD58F]'
  }
]

function isPositiveDiscountPercent(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value < 100
}

function formatDiscountPercent(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
}

export function getCampaignDiscountLabel(campaign: Campaign) {
  return isPositiveDiscountPercent(campaign.discountPercent) ? `-${formatDiscountPercent(campaign.discountPercent)}%` : undefined
}

export function getCampaignBannerDiscountText(campaign: Campaign) {
  return isPositiveDiscountPercent(campaign.discountPercent)
    ? campaign.discountText ?? `Giảm ${formatDiscountPercent(campaign.discountPercent)}%`
    : campaign.discountText
}

function isPublisherOrStore(id: string) {
  const item = getItemById(id)
  return item?.type === 'publisher' || item?.type === 'store'
}

function validateCampaign(campaign: Campaign): CampaignValidationResult {
  const errors: string[] = []

  if (campaign.targetPublisherId && !isPublisherOrStore(campaign.targetPublisherId)) {
    errors.push(`Campaign ${campaign.id} targetPublisherId does not exist: ${campaign.targetPublisherId}`)
  }

  if (campaign.targetGameIds?.some((gameId) => getItemById(gameId)?.type !== 'game')) {
    errors.push(`Campaign ${campaign.id} has an invalid targetGameIds entry`)
  }

  if (campaign.discountPercent !== undefined && !isPositiveDiscountPercent(campaign.discountPercent)) {
    errors.push(`Campaign ${campaign.id} discountPercent must be a positive number below 100`)
  }

  if (isPositiveDiscountPercent(campaign.discountPercent)) {
    const expectedPercentText = `${formatDiscountPercent(campaign.discountPercent)}%`

    if (campaign.discountText && !campaign.discountText.includes(expectedPercentText)) {
      errors.push(`Campaign ${campaign.id} discountText must match ${expectedPercentText}`)
    }
  }

  for (const skuDiscount of campaign.skuDiscounts ?? []) {
    const referencesRealSku = skuDiscount.skuId ? topupSkus.some((sku) => sku.id === skuDiscount.skuId) : false
    const referencesRealPublisher = skuDiscount.publisherId ? isPublisherOrStore(skuDiscount.publisherId) : false

    if (!referencesRealSku && !referencesRealPublisher) {
      errors.push(`Campaign ${campaign.id} skuDiscount ${skuDiscount.id} must reference a real skuId or publisherId`)
    }

    const discountPercent = skuDiscount.discountPercent ?? campaign.discountPercent
    if (!isPositiveDiscountPercent(discountPercent)) {
      errors.push(`Campaign ${campaign.id} skuDiscount ${skuDiscount.id} must have a valid discount percent`)
    }

    if (
      isPositiveDiscountPercent(campaign.discountPercent) &&
      skuDiscount.discountPercent !== undefined &&
      skuDiscount.discountPercent !== campaign.discountPercent
    ) {
      errors.push(`Campaign ${campaign.id} skuDiscount ${skuDiscount.id} must match campaign discountPercent`)
    }
  }

  return { campaign, errors }
}

function isCampaignVisible(campaign: Campaign) {
  if (!campaign.enabled) return false

  const now = new Date()
  if (campaign.validFrom && now < new Date(campaign.validFrom)) return false
  if (campaign.validTo && now > new Date(campaign.validTo)) return false
  return true
}

function getValidActiveCampaigns(candidateCampaigns: Campaign[]) {
  const validationResults = candidateCampaigns.map(validateCampaign)

  if (validationResults.some((result) => result.errors.length > 0)) {
    return []
  }

  return validationResults
    .filter((result) => result.errors.length === 0 && isCampaignVisible(result.campaign))
    .map((result) => result.campaign)
    .sort((a, b) => b.priority - a.priority)
}

export function validateCampaignData(candidateCampaigns: Campaign[] = campaigns) {
  return candidateCampaigns.map(validateCampaign)
}

function getCampaignsFromSource(): { campaigns: Campaign[]; source: CampaignSource } {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs')
      const path = require('path')
      const statePath = path.join(process.cwd(), 'src', 'agent', 'campaignState.json')
      if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'))
        const activeTopBannerId = state.topBannerCampaignId
        const disabledCampaigns = state.disabledCampaigns || []

        for (const c of campaigns) {
          if (disabledCampaigns.includes(c.id)) {
            c.enabled = false
          }
          c.isTopBanner = c.id === activeTopBannerId
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const validEditableCampaigns = getValidActiveCampaigns(campaigns)
  if (validEditableCampaigns.length > 0) {
    return { campaigns: validEditableCampaigns, source: 'editable' }
  }

  const validLastKnownCampaigns = getValidActiveCampaigns(lastKnownValidCampaigns)
  if (validLastKnownCampaigns.length > 0) {
    return { campaigns: validLastKnownCampaigns, source: 'last-known-valid' }
  }

  return { campaigns: getValidActiveCampaigns(fallbackCampaigns), source: 'fallback' }
}

export function getActiveCampaign() {
  const { campaigns: activeCampaigns } = getCampaignsFromSource()
  return activeCampaigns.find((c) => c.isTopBanner)
}

export function setTopBanner(campaignId: string) {
  for (const campaign of campaigns) {
    campaign.isTopBanner = campaign.id === campaignId
  }
}

export function unsetTopBanner() {
  for (const campaign of campaigns) {
    campaign.isTopBanner = false
  }
}


export function getCampaignSkuDiscounts(campaign: Campaign) {
  if (!isPositiveDiscountPercent(campaign.discountPercent)) {
    return []
  }

  const explicitRules = (campaign.skuDiscounts ?? [])
    .filter((rule) => rule.enabled)
    .map((rule) => ({ ...rule, discountPercent: rule.discountPercent ?? campaign.discountPercent }))

  if (explicitRules.length > 0) {
    return explicitRules
  }

  if (campaign.targetPublisherId) {
    return [
      {
        id: `${campaign.id}-${campaign.targetPublisherId}-all-skus`,
        publisherId: campaign.targetPublisherId,
        discountPercent: campaign.discountPercent,
        enabled: true
      }
    ]
  }

  return []
}
export function getCampaignArticle(campaignId: string) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign || !campaign.articleId) return null;
  return getArticleById(campaign.articleId);
}
