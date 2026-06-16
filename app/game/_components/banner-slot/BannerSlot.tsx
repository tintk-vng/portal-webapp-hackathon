import { Campaign, getCampaignBannerDiscountText } from '@/src/data/campaigns'
import Link from 'next/link'

type BannerSlotProps = {
  campaign?: Campaign
}

export default function BannerSlot({ campaign }: BannerSlotProps) {
  if (!campaign) return null
  const discountText = getCampaignBannerDiscountText(campaign)
  const bgImg = campaign.bannerImageUrl
  const mobileBgImg = campaign.mobileBannerImageUrl ?? campaign.bannerImageUrl

  const content = (
    <div
      className="relative min-h-[80px] md:min-h-[100px] px-4 py-2 md:px-6 flex flex-col justify-center overflow-hidden bg-slate-900 text-white-500"
    >
      {/* Background Image for Desktop */}
      {bgImg && (
        <div 
          className="absolute inset-0 hidden sm:block bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
      )}
      {/* Background Image for Mobile */}
      {mobileBgImg && (
        <div 
          className="absolute inset-0 block sm:hidden bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${mobileBgImg})` }}
        />
      )}
      
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          {discountText && (
            <div className="mb-2 inline-flex rounded bg-white-500/95 px-2 py-0.5 text-label-xs font-bold text-blue-500">
              {discountText}
            </div>
          )}
          <h1 className="text-heading-md md:text-[22px] md:leading-7 font-extrabold text-white">{campaign.title}</h1>
          {campaign.subtitle && (
            <p className="mt-1 max-w-[520px] text-label-md text-white-500/90 md:text-label-lg font-medium">{campaign.subtitle}</p>
          )}
          {campaign.ctaText && (
            <div className="mt-3">
              <span className="inline-flex rounded-md bg-white-500 px-3 py-1.5 text-label-sm font-bold text-blue-500 shadow-sm">
                {campaign.ctaText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className="mb-7 overflow-hidden rounded-lg bg-white-500 shadow-soft md:mb-8">
      {campaign.articleId ? (
        <Link href={`/mua-the-game/tin-tuc?slug=${campaign.articleId}-0`} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </section>
  )
}
