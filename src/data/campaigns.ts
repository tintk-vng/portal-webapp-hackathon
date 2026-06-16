import { getItemById, topupSkus } from './catalog'

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
    id: 'garena-free-fire-week',
    title: 'Free Fire Anniversary',
    subtitle: 'Nạp thẻ Garena, săn ưu đãi trong sự kiện mới',
    bannerImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png',
    altText: 'Garena Free Fire Anniversary banner',
    targetPublisherId: 'garena',
    targetGameIds: ['free-fire'],
    discountPercent: 5,
    discountText: 'Giảm 5%',
    skuDiscounts: [
      {
        id: 'garena-campaign-all-skus',
        publisherId: 'garena',
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: 'Xem ưu đãi',
    articleId: 'garena-free-fire-week',
    enabled: false,
    priority: 100,
    validFrom: '2026-06-10T00:00:00+07:00',
    validTo: '2026-06-30T23:59:59+07:00',
    themeClassName: 'from-[#E75648] via-[#F1865F] to-[#FFD58F]'
  },
  {
    id: 'google-play-store',
    title: 'Google Play nạp nhanh',
    subtitle: 'Sẵn sàng cho mọi tựa game Android yêu thích',
    bannerImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png',
    altText: 'Google Play banner',
    targetPublisherId: 'googleplay',
    ctaText: 'Mua mã Google Play',
    enabled: false,
    priority: 20,
    themeClassName: 'from-[#2F72D8] via-[#45B8A8] to-[#D3EEFF]'
  },
  {
    id: "weekly-garena-2026-06-14",
    title: "Garena weekly offer",
    subtitle: "5% for Free Fire, Liên Quân Mobile, FC Online top-ups.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    altText: "Garena weekly offer banner",
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
        id: "weekly-garena-2026-06-14-garena-eligible-skus",
        publisherId: "garena",
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-garena-2026-06-14",
    enabled: false,
    priority: 200,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
  {
    id: "weekly-googleplay-test-2026-06-14",
    title: "Google Play weekly offer",
    subtitle: "3% for Google Play top-ups this week.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    altText: "Google Play weekly offer banner",
    targetPublisherId: "googleplay",
    targetGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    discountPercent: 3,
    discountText: "Giảm 3%",
    skuDiscounts: [
      {
        id: "weekly-googleplay-test-2026-06-14-googleplay-eligible-skus",
        publisherId: "googleplay",
        discountPercent: 3,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-googleplay-test-2026-06-14",
    enabled: false,
    priority: 160,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
  {
    id: "weekly-vtc-test-2026-06-14",
    title: "VTC weekly offer",
    subtitle: "4% for VTC top-ups this week.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/vtc.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/vtc.png",
    altText: "VTC weekly offer banner",
    targetPublisherId: "vtc",
    targetGameIds: [
      "audition",
      "dot-kich"
    ],
    discountPercent: 4,
    discountText: "Giảm 4%",
    skuDiscounts: [
      {
        id: "weekly-vtc-test-2026-06-14-vtc-eligible-skus",
        publisherId: "vtc",
        discountPercent: 4,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-vtc-test-2026-06-14",
    enabled: false,
    priority: 190,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
  {
    id: "weekly-googleplay-clean-slate-2026-06-14",
    title: "Google Play weekly offer",
    subtitle: "3% for Google Play top-ups this week.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    altText: "Google Play weekly offer banner",
    targetPublisherId: "googleplay",
    targetGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    discountPercent: 3,
    discountText: "Giảm 3%",
    skuDiscounts: [
      {
        id: "weekly-googleplay-clean-slate-2026-06-14-googleplay-eligible-skus",
        publisherId: "googleplay",
        discountPercent: 3,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-googleplay-clean-slate-2026-06-14",
    enabled: false,
    priority: 210,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
  {
    id: "weekly-googleplay-v1a-2026-06-15",
    title: "Ưu đãi nạp Google Play trong tuần",
    subtitle: "Giảm 3% cho Google Play, Genshin Impact trên NapTheVui.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    altText: "Google Play promotion banner",
    targetPublisherId: "googleplay",
    targetGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    discountPercent: 3,
    discountText: "Giảm 3%",
    skuDiscounts: [
      {
        id: "weekly-googleplay-v1a-2026-06-15-googleplay-eligible-skus",
        publisherId: "googleplay",
        discountPercent: 3,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-googleplay-v1a-2026-06-15",
    enabled: false,
    priority: 230,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
  {
    id: "weekly-garena-v1a-2026-06-15",
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
        id: "weekly-garena-v1a-2026-06-15-garena-eligible-skus",
        publisherId: "garena",
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-garena-v1a-2026-06-15",
    enabled: false,
    priority: 240,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
  {
    id: "weekly-garena-2026-06-16-2",
    title: "Sieu Uu Dai Garena Tuan Nay",
    subtitle: "Giam 5% cho cac tua game Free Fire, Lien Quan Mobile",
    bannerImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
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
        id: "weekly-garena-2026-06-16-2-garena-eligible-skus",
        publisherId: "garena",
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-garena-2026-06-16-2",
    enabled: false,
    priority: 250,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  },
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
  if (!campaign.enabled) {
    return false
  }

  const now = new Date()
  if (campaign.validFrom && now < new Date(campaign.validFrom)) {
    return false
  }
  if (campaign.validTo && now > new Date(campaign.validTo)) {
    return false
  }
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
  const topBanner = activeCampaigns.find((c) => c.isTopBanner)
  return topBanner ?? activeCampaigns[0] ?? fallbackCampaigns[0]
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
