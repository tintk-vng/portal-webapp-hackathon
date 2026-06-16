'use client'

import { PopularSearchResolvedItem, TopupItem } from '@/src/data/catalog'

type PopularSearchChipsProps = {
  items: PopularSearchResolvedItem[]
  onSelect: (item: TopupItem) => void
}

function hasRealIcon(iconUrl?: string) {
  return Boolean(iconUrl && !iconUrl.includes('supplier_placeholder'))
}

export default function PopularSearchChips({ items, onSelect }: PopularSearchChipsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="mb-7 pl-1 md:mb-8">
      <div className="mb-2 text-label-sm font-bold text-dark-300">Tìm kiếm phổ biến</div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const iconUrl = item.iconUrl ?? item.target.logoUrl

          return (
            <button
              key={item.id}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-dark-50 bg-white-500 px-3 text-label-sm font-bold text-dark-400 shadow-sm transition hover:border-blue-500 hover:bg-blue-25 hover:text-blue-500"
              onClick={() => onSelect(item.target)}
              type="button"
            >
              {hasRealIcon(iconUrl) && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white-500">
                  <img className="max-h-full max-w-full object-contain" src={iconUrl} alt="" />
                </span>
              )}
              {item.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
