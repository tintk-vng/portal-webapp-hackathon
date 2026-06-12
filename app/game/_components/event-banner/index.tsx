'use client'

import useCustomSWR from '@/hooks/use-custom-swr'
import eventsAPI from '@/api-client/common/events'

export default function EventBanner() {
  const { data } = useCustomSWR('game_events', () => eventsAPI.getEvents())
  const banner = data && !data.default_state ? data.banner : null

  if (!banner) return null

  return (
    <div className="relative z-0 mb-3 flex flex-row items-center gap-3 overflow-hidden rounded-lg bg-blue-25 px-4 py-3">
      <div className="text-2xl">⚡</div>
      <div className="min-w-0 flex-1">
        <p className="label-xs text-orange-500">
          {banner.publisher} · {banner.game}
        </p>
        <p className="heading-sm truncate">{banner.title}</p>
        {banner.summary ? <p className="paragraph-md text-dark-200">{banner.summary}</p> : null}
      </div>
      {banner.source_url ? (
        <a
          href={banner.source_url}
          className="label-md whitespace-nowrap rounded-lg bg-blue-500 px-4 py-2 text-white-500"
        >
          {banner.cta || 'Nạp ngay'}
        </a>
      ) : null}
    </div>
  )
}