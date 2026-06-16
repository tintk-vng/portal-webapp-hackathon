import { Campaign } from '@/src/data/campaigns'
import { NewsArticle } from '@/src/data/newsArticles'
import { PopularSearchItem } from '@/src/data/catalog'
import { DraftCampaignProposal } from './types'

function formatDiscountPercent(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
}

export function proposalToCampaign(proposal: DraftCampaignProposal): Campaign {
  return {
    id: proposal.id,
    title: proposal.bannerTitle,
    subtitle: proposal.bannerSubtitle,
    bannerImageUrl: proposal.bannerImageUrl,
    mobileBannerImageUrl: proposal.mobileBannerImageUrl,
    altText: proposal.altText ?? `${proposal.bannerTitle} banner`,
    targetPublisherId: proposal.targetPublisherId,
    targetGameIds: proposal.targetGameIds,
    discountPercent: proposal.discountPercent,
    discountText: proposal.discountText ?? `Giảm ${formatDiscountPercent(proposal.discountPercent)}%`,
    skuDiscounts: [
      {
        id: `${proposal.id}-${proposal.targetPublisherId}-eligible-skus`,
        publisherId: proposal.targetPublisherId,
        discountPercent: proposal.discountPercent,
        enabled: true
      }
    ],
    ctaText: proposal.ctaText,
    articleId: proposal.id,
    enabled: true,
    priority: 150,
    themeClassName: 'from-[#E75648] via-[#F1865F] to-[#FFD58F]'
  }
}

export function proposalToNewsArticle(proposal: DraftCampaignProposal): NewsArticle {
  return {
    id: proposal.id,
    title: proposal.articleTitle,
    summary: proposal.articleSummary,
    coverImageUrl: proposal.bannerImageUrl,
    content: proposal.articleContent,
    relatedCampaignId: proposal.id,
    relatedPublisherId: proposal.targetPublisherId,
    relatedGameIds: proposal.targetGameIds,
    publishedAt: proposal.createdAt,
    enabled: true
  }
}

export function proposalToPopularSearchItems(proposal: DraftCampaignProposal): PopularSearchItem[] {
  return proposal.recommendedPopularSearchItems.map((item, index) => ({
    ...item,
    priority: item.priority ?? index + 1,
    source: 'agent',
    updatedAt: item.updatedAt ?? proposal.createdAt
  }))
}
