import { Campaign, getCampaignBannerDiscountText } from '@/src/data/campaigns'
import Link from 'next/link'
import Image from 'next/image'

type BannerSlotProps = {
  campaign: Campaign
}

export default function BannerSlot({ campaign }: BannerSlotProps) {
  const discountText = getCampaignBannerDiscountText(campaign)

  const content = (
    <div
      className={`relative min-h-[124px] bg-gradient-to-br ${campaign.themeClassName ?? 'from-blue-500 via-green-500 to-blue-50'} px-4 py-4 text-white-500 md:min-h-[144px] md:px-6`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.20),rgba(255,255,255,0.02))]" />

      <div className="relative z-10 flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          {discountText && (
            <div className="mb-2 inline-flex rounded bg-white-500/95 px-2 py-1 text-label-xs font-bold text-blue-500">
              {discountText}
            </div>
          )}
          <h1 className="text-heading-lg md:text-[26px] md:leading-8">{campaign.title}</h1>
          {campaign.subtitle && (
            <p className="mt-1 max-w-[520px] text-label-md text-white-500/90 md:text-label-lg">{campaign.subtitle}</p>
          )}
          {campaign.ctaText && (
            <span className="mt-3 inline-flex rounded-md bg-white-500 px-3 py-1.5 text-label-sm font-bold text-blue-500">
              {campaign.ctaText}
            </span>
          )}
        </div>

        <div className="relative flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-white-500/95 p-3 shadow-soft sm:h-20 sm:w-28 md:h-24 md:w-32">
          <Image
            className="max-h-full max-w-full object-contain"
            src={campaign.mobileBannerImageUrl ?? campaign.bannerImageUrl}
            alt={campaign.altText}
            fill
            sizes="(max-width: 640px) 64px, (max-width: 768px) 100px, 120px"
            loader={({ src }) => src}
            unoptimized
          />
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
