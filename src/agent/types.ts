import { TopupItemType } from '@/src/data/catalog'

export type DraftCampaignProposalStatus = 'scanned' | 'draft' | 'approved' | 'applied' | 'rejected'

export type DraftRecommendedPopularSearchItem = {
  id: string
  targetId: string
  targetType: TopupItemType
  label: string
  iconUrl?: string
  priority?: number
  aiScore?: number
  searchCount?: number
  clickCount?: number
  purchaseCount?: number
  campaignBoost?: number
  manualBoost?: number
  enabled: boolean
  source: 'agent' | 'analytics' | 'manual' | 'fallback'
  updatedAt?: string
}

export type DraftCampaignProposal = {
  id: string
  title: string
  targetPublisherId: string
  targetGameIds: string[]
  discountPercent: number
  bannerTitle: string
  bannerSubtitle: string
  bannerImageUrl: string
  mobileBannerImageUrl?: string
  coverImageUrl?: string
  ctaText: string
  discountText?: string
  altText?: string
  imagePrompt?: string
  articleTitle: string
  articleSummary: string
  articleContent: string
  recommendedPopularSearchItems: DraftRecommendedPopularSearchItem[]
  proposedFileChanges: string[]
  createdAt: string
  status: DraftCampaignProposalStatus
  selectedPublisher?: string
  alternativesConsidered?: string[]
  researchSourceIds?: string[]
  researchVisitedUrls?: string[]
  reasoningSummary?: string
  validationWarnings?: string[]
  lastScannedAt?: string
  statusHistory?: { status: DraftCampaignProposalStatus; timestamp: string }[]
  inputSnapshot?: {
    weeklyBriefPath?: string
    analyticsPath?: string
    publisherPromoSignalsPath?: string
    generatedPromoSignalsPath?: string
    generatedBy?: string
  }
}
