'use client'

import { TopupItem } from '@/src/data/catalog'
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

type SearchBarProps = {
  items: TopupItem[]
  onSelect: (item: TopupItem) => void
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
}

function getSearchText(item: TopupItem) {
  return normalizeText([item.name, item.displayName, ...item.aliases].join(' '))
}

export default function SearchBar({ items, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const results = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())
    const rankedItems = [...items].sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))

    if (!normalizedQuery) {
      return rankedItems.slice(0, 6)
    }

    return rankedItems
      .filter((item) => {
        const searchText = getSearchText(item)
        const tokens = [item.name, item.displayName, ...item.aliases].map(normalizeText)
        return searchText.includes(normalizedQuery) || tokens.some((token) => token.startsWith(normalizedQuery))
      })
      .slice(0, 8)
  }, [items, query])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleSelect = (item: TopupItem) => {
    onSelect(item)
    setQuery(item.displayName)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (event.key === 'Enter' && results[0]) {
      event.preventDefault()
      handleSelect(results[0])
    }
  }

  return (
    <section ref={rootRef} className="relative mb-3">
      <div className="rounded-lg border border-dark-50 bg-white-500 px-4 py-4 shadow-soft md:px-5">
        <label className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-500">
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className="h-9 min-w-0 flex-1 bg-transparent text-label-lg outline-none placeholder:text-dark-200"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm game, thẻ cào, hoặc nhà phát hành..."
          />
        </label>
        <div className="mt-3 pl-12 text-label-sm text-dark-300">
          Ví dụ: Liên Minh Huyền Thoại, Free Fire, Roblox, Google Play...
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-lg border border-dark-50 bg-white-500 shadow-soft">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-label-md text-dark-300">Không tìm thấy game hoặc thẻ phù hợp</div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-2">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-blue-25"
                    onClick={() => handleSelect(item)}
                    type="button"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-dark-50 bg-white-500 p-1">
                      <img className="max-h-full max-w-full object-contain" src={item.logoUrl} alt="" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-label-lg font-bold text-dark-500">{item.displayName}</span>
                      <span className="block truncate text-label-sm text-dark-300">
                        {item.type === 'game' ? 'Game' : 'The / nha phat hanh'}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
