export type TopupItemType = 'publisher' | 'store' | 'game'

export type TopupItem = {
  id: string
  type: TopupItemType
  name: string
  displayName: string
  logoUrl: string
  aliases: string[]
  publisherId?: string
  topGames?: string[]
  popularityScore?: number
  genre?: string
  isTrending?: boolean
}

export type TopupSku = {
  id: string
  publisherId: string
  amount: number
  displayAmount: string
}

export type PopularSearchItem = {
  id: string
  targetId: string
  targetType: 'game' | 'store' | 'publisher'
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

export type PopularSearchResolvedItem = PopularSearchItem & {
  target: TopupItem
}

// AI_AGENT_EDITABLE: update publisher/card catalog, game aliases, and game-to-publisher mapping
export const topupItems: TopupItem[] = [
  {
    id: 'garena',
    type: 'publisher',
    name: 'Garena',
    displayName: 'Garena',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png',
    aliases: ['garena', 'the garena', 'garena card'],
    topGames: ['Free Fire', 'Liên Quân Mobile', 'Liên Minh Huyền Thoại'],
    popularityScore: 98,
    isTrending: true
  },
  {
    id: 'zing',
    type: 'publisher',
    name: 'Zing',
    displayName: 'Zing',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/zing.png',
    aliases: ['zing', 'vng', 'zing xu', 'zing card'],
    topGames: ['Gunny', 'Võ Lâm Truyền Kỳ', 'Zing Xu'],
    popularityScore: 86
  },
  {
    id: 'vtc',
    type: 'publisher',
    name: 'VTC',
    displayName: 'VTC',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/vtc.png',
    aliases: ['vtc', 'vcoin', 'vtc game'],
    topGames: ['Audition', 'Đột Kích', 'Vcoin'],
    popularityScore: 82
  },
  {
    id: 'gate',
    type: 'publisher',
    name: 'Gate',
    displayName: 'Gate',
    logoUrl: '/images/logos/games/gate.svg',
    aliases: ['gate', 'gate card'],
    topGames: ['Gate Card', 'Game Gate'],
    popularityScore: 62
  },
  {
    id: 'appota',
    type: 'publisher',
    name: 'Appota',
    displayName: 'Appota',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/appota.png',
    aliases: ['appota', 'appota card'],
    topGames: ['Appota Games', 'Acoin'],
    popularityScore: 58
  },
  {
    id: 'scoin',
    type: 'publisher',
    name: 'Scoin',
    displayName: 'Scoin',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/scoin.png',
    aliases: ['scoin', 'soha scoin'],
    topGames: ['Tam Quốc', 'Kiếm Hiệp', 'Scoin'],
    popularityScore: 71
  },
  {
    id: 'sohacoin',
    type: 'publisher',
    name: 'SohaCoin',
    displayName: 'SohaCoin',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/sohacoin.png',
    aliases: ['sohacoin', 'soha coin', 'sohagame'],
    topGames: ['SohaGame', 'Đấu La', 'Thần Ma'],
    popularityScore: 68
  },
  {
    id: 'funcard',
    type: 'publisher',
    name: 'Funcard',
    displayName: 'Funcard',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/funcard.png',
    aliases: ['funcard', 'fun card'],
    topGames: ['Funcard', 'Fun Games'],
    popularityScore: 52
  },
  {
    id: 'gosu',
    type: 'publisher',
    name: 'Gosu',
    displayName: 'Gosu',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/gosu.png',
    aliases: ['gosu', 'gosu card'],
    topGames: ['Cửu Âm', 'Thiên Long', 'Gosu Games'],
    popularityScore: 57
  },
  {
    id: 'googleplay',
    type: 'store',
    name: 'Google Play',
    displayName: 'Google Play',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png',
    aliases: ['google play', 'googleplay', 'ch play', 'android'],
    topGames: ['Google Play'],
    popularityScore: 93,
    isTrending: true
  },
  {
    id: 'roblox-store',
    type: 'store',
    name: 'Roblox',
    displayName: 'Roblox',
    logoUrl: '/images/logos/games/roblox.svg',
    aliases: ['roblox', 'robux'],
    topGames: ['Roblox', 'Robux'],
    popularityScore: 89,
    isTrending: true
  },
  {
    id: 'free-fire',
    type: 'game',
    name: 'Free Fire',
    displayName: 'Free Fire',
    logoUrl: '/images/logos/games/free-fire.svg',
    aliases: ['free fire', 'ff', 'garena free fire'],
    publisherId: 'garena',
    popularityScore: 100,
    genre: 'battle royale',
    isTrending: true
  },
  {
    id: 'lien-quan-mobile',
    type: 'game',
    name: 'Lien Quan Mobile',
    displayName: 'Liên Quân Mobile',
    logoUrl: '/images/logos/games/lien-quan-mobile.png',
    aliases: ['lien quan', 'lqm', 'arena of valor', 'aov'],
    publisherId: 'garena',
    popularityScore: 97,
    genre: 'moba',
    isTrending: true
  },
  {
    id: 'lien-minh-huyen-thoai',
    type: 'game',
    name: 'Lien Minh Huyen Thoai',
    displayName: 'Liên Minh Huyền Thoại',
    logoUrl: '/images/logos/games/lien-minh-huyen-thoai.svg',
    aliases: ['lien minh', 'lmht', 'lol', 'league of legends'],
    publisherId: 'garena',
    popularityScore: 96,
    genre: 'moba',
    isTrending: true
  },
  {
    id: 'fc-online',
    type: 'game',
    name: 'FC Online',
    displayName: 'FC Online',
    logoUrl: '/images/logos/games/fc-online.svg',
    aliases: ['fifa online', 'fc online', 'fo4'],
    publisherId: 'garena',
    popularityScore: 85,
    genre: 'sports'
  },
  {
    id: 'audition',
    type: 'game',
    name: 'Audition',
    displayName: 'Audition',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/vtc.png',
    aliases: ['audition', 'au', 'vtc audition'],
    publisherId: 'vtc',
    popularityScore: 80,
    genre: 'music'
  },
  {
    id: 'dot-kich',
    type: 'game',
    name: 'Dot Kich',
    displayName: 'Đột Kích',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/vtc.png',
    aliases: ['dot kich', 'crossfire', 'cf'],
    publisherId: 'vtc',
    popularityScore: 76,
    genre: 'fps'
  },
  {
    id: 'gunny',
    type: 'game',
    name: 'Gunny',
    displayName: 'Gunny',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/zing.png',
    aliases: ['gunny', 'gunny origin'],
    publisherId: 'zing',
    popularityScore: 79,
    genre: 'casual'
  },
  {
    id: 'vo-lam',
    type: 'game',
    name: 'Vo Lam Truyen Ky',
    displayName: 'Võ Lâm Truyền Kỳ',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/zing.png',
    aliases: ['vo lam', 'vltk', 'vo lam truyen ky'],
    publisherId: 'zing',
    popularityScore: 74,
    genre: 'mmorpg'
  },
  {
    id: 'tam-quoc',
    type: 'game',
    name: 'Tam Quoc',
    displayName: 'Tam Quốc',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/scoin.png',
    aliases: ['tam quoc', 'scoin tam quoc'],
    publisherId: 'scoin',
    popularityScore: 63,
    genre: 'strategy'
  },
  {
    id: 'roblox',
    type: 'game',
    name: 'Roblox',
    displayName: 'Roblox',
    logoUrl: '/images/logos/games/roblox.svg',
    aliases: ['roblox', 'robux'],
    publisherId: 'roblox-store',
    popularityScore: 92,
    genre: 'sandbox',
    isTrending: true
  },
  {
    id: 'google-play-game',
    type: 'game',
    name: 'Google Play',
    displayName: 'Google Play',
    logoUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png',
    aliases: ['google play', 'ch play', 'android game'],
    publisherId: 'googleplay',
    popularityScore: 91,
    genre: 'store'
  },
  {
    id: 'genshin-impact',
    type: 'game',
    name: 'Genshin Impact',
    displayName: 'Genshin Impact',
    logoUrl: '/images/logos/games/genshin-impact.svg',
    aliases: ['genshin', 'genshin impact', 'hoyoverse'],
    publisherId: 'googleplay',
    popularityScore: 84,
    genre: 'rpg'
  },
  {
    id: 'toc-chien',
    type: 'game',
    name: 'Toc Chien',
    displayName: 'Tốc Chiến',
    logoUrl: '/images/logos/games/toc-chien.svg',
    aliases: ['toc chien', 'wild rift', 'league of legends wild rift'],
    publisherId: 'googleplay',
    popularityScore: 83,
    genre: 'moba'
  }
]

export const topupSkus: TopupSku[] = [
  { id: 'garena-10', publisherId: 'garena', amount: 10000, displayAmount: '10.000d' },
  { id: 'garena-20', publisherId: 'garena', amount: 20000, displayAmount: '20.000d' },
  { id: 'garena-50', publisherId: 'garena', amount: 50000, displayAmount: '50.000d' },
  { id: 'garena-100', publisherId: 'garena', amount: 100000, displayAmount: '100.000d' },
  { id: 'garena-200', publisherId: 'garena', amount: 200000, displayAmount: '200.000d' },
  { id: 'garena-500', publisherId: 'garena', amount: 500000, displayAmount: '500.000d' },
  { id: 'zing-20', publisherId: 'zing', amount: 20000, displayAmount: '20.000d' },
  { id: 'zing-50', publisherId: 'zing', amount: 50000, displayAmount: '50.000d' },
  { id: 'zing-100', publisherId: 'zing', amount: 100000, displayAmount: '100.000d' },
  { id: 'vtc-50', publisherId: 'vtc', amount: 50000, displayAmount: '50.000d' },
  { id: 'vtc-100', publisherId: 'vtc', amount: 100000, displayAmount: '100.000d' },
  { id: 'googleplay-100', publisherId: 'googleplay', amount: 100000, displayAmount: '100.000d' },
  { id: 'googleplay-200', publisherId: 'googleplay', amount: 200000, displayAmount: '200.000d' },
  { id: 'default-50', publisherId: 'default', amount: 50000, displayAmount: '50.000d' },
  { id: 'default-100', publisherId: 'default', amount: 100000, displayAmount: '100.000d' },
  { id: 'default-200', publisherId: 'default', amount: 200000, displayAmount: '200.000d' }
]

// AI_AGENT_EDITABLE: daily popular search recommendations
export const agentPopularSearchRecommendations: PopularSearchItem[] = [
  {
    id: "agent-weekly-garena-2026-06-16-5-free-fire",
    targetId: "free-fire",
    targetType: "game",
    label: "Free Fire",
    priority: 1,
    aiScore: 194,
    searchCount: 12840,
    clickCount: 4320,
    purchaseCount: 980,
    campaignBoost: 25,
    enabled: true,
    source: "agent",
    updatedAt: "2026-06-16T10:00:45.939Z"
  },
  {
    id: "agent-weekly-garena-2026-06-16-5-lien-quan-mobile",
    targetId: "lien-quan-mobile",
    targetType: "game",
    label: "Liên Quân Mobile",
    priority: 2,
    aiScore: 187,
    searchCount: 10820,
    clickCount: 3900,
    purchaseCount: 860,
    campaignBoost: 25,
    enabled: true,
    source: "agent",
    updatedAt: "2026-06-16T10:00:45.939Z"
  },
  {
    id: "agent-weekly-garena-2026-06-16-5-fc-online",
    targetId: "fc-online",
    targetType: "game",
    label: "FC Online",
    priority: 3,
    aiScore: 165,
    searchCount: 6120,
    clickCount: 2140,
    purchaseCount: 420,
    campaignBoost: 25,
    enabled: true,
    source: "agent",
    updatedAt: "2026-06-16T10:00:45.939Z"
  },
  {
    id: "agent-weekly-garena-2026-06-16-5-lien-minh-huyen-thoai",
    targetId: "lien-minh-huyen-thoai",
    targetType: "game",
    label: "Liên Minh Huyền Thoại",
    priority: 4,
    campaignBoost: 25,
    enabled: true,
    source: "agent",
    updatedAt: "2026-06-16T10:00:45.939Z"
  },
  {
    id: "agent-weekly-garena-2026-06-16-5-googleplay",
    targetId: "googleplay",
    targetType: "store",
    label: "Google Play",
    priority: 5,
    aiScore: 173,
    searchCount: 7400,
    clickCount: 2500,
    purchaseCount: 510,
    enabled: true,
    source: "agent",
    updatedAt: "2026-06-16T10:00:45.939Z"
  },
  {
    id: "agent-weekly-garena-2026-06-16-5-roblox",
    targetId: "roblox",
    targetType: "game",
    label: "Roblox",
    priority: 6,
    aiScore: 169,
    searchCount: 6920,
    clickCount: 2210,
    purchaseCount: 430,
    enabled: true,
    source: "agent",
    updatedAt: "2026-06-16T10:00:45.939Z"
  }
]

export const analyticsPopularSearchRecommendations: PopularSearchItem[] = []

export const cachedPopularSearchRecommendations: PopularSearchItem[] = []

// FALLBACK_SAFE: used when agent/analytics data is unavailable
export const fallbackPopularSearchRecommendations: PopularSearchItem[] = [
  {
    id: 'fallback-free-fire',
    targetId: 'free-fire',
    targetType: 'game',
    label: 'Free Fire',
    priority: 1,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-lien-quan-mobile',
    targetId: 'lien-quan-mobile',
    targetType: 'game',
    label: 'Liên Quân Mobile',
    priority: 2,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-lien-minh-huyen-thoai',
    targetId: 'lien-minh-huyen-thoai',
    targetType: 'game',
    label: 'Liên Minh Huyền Thoại',
    priority: 3,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-roblox',
    targetId: 'roblox',
    targetType: 'game',
    label: 'Roblox',
    priority: 4,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-google-play',
    targetId: 'googleplay',
    targetType: 'store',
    label: 'Google Play',
    priority: 5,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-fc-online',
    targetId: 'fc-online',
    targetType: 'game',
    label: 'FC Online',
    priority: 6,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-genshin-impact',
    targetId: 'genshin-impact',
    targetType: 'game',
    label: 'Genshin Impact',
    priority: 7,
    enabled: true,
    source: 'fallback'
  },
  {
    id: 'fallback-toc-chien',
    targetId: 'toc-chien',
    targetType: 'game',
    label: 'Tốc Chiến',
    priority: 8,
    enabled: true,
    source: 'fallback'
  }
]

export function getCardItems() {
  return topupItems.filter((item) => item.type === 'publisher' || item.type === 'store')
}

function rankPopularSearchItems(items: PopularSearchItem[]) {
  return [...items].sort((a, b) => {
    const priorityA = a.priority ?? 999
    const priorityB = b.priority ?? 999

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    const score = (item: PopularSearchItem) =>
      (item.aiScore ?? 0) +
      (item.searchCount ?? 0) +
      (item.clickCount ?? 0) * 2 +
      (item.purchaseCount ?? 0) * 4 +
      (item.campaignBoost ?? 0) +
      (item.manualBoost ?? 0)

    return score(b) - score(a)
  })
}

function resolvePopularSearchRecommendations(items: PopularSearchItem[]) {
  const byId = new Map(topupItems.map((item) => [item.id, item]))
  const seenTargetIds = new Set<string>()

  return rankPopularSearchItems(items)
    .filter((item) => item.enabled)
    .map((item) => {
      const target = byId.get(item.targetId)

      if (!target || target.type !== item.targetType || seenTargetIds.has(item.targetId)) {
        return undefined
      }

      seenTargetIds.add(item.targetId)
      return { ...item, target }
    })
    .filter(Boolean) as PopularSearchResolvedItem[]
}

export function getPopularSearchItems() {
  const recommendationGroups = [
    agentPopularSearchRecommendations.filter((item) => item.source === 'agent'),
    analyticsPopularSearchRecommendations.filter((item) => item.source === 'analytics'),
    cachedPopularSearchRecommendations,
    fallbackPopularSearchRecommendations.filter((item) => item.source === 'fallback')
  ]

  for (const recommendations of recommendationGroups) {
    const resolvedRecommendations = resolvePopularSearchRecommendations(recommendations)

    if (resolvedRecommendations.length > 0) {
      return resolvedRecommendations
    }
  }

  return resolvePopularSearchRecommendations(fallbackPopularSearchRecommendations)
}

export function getItemById(id: string) {
  return topupItems.find((item) => item.id === id)
}

export function resolveGameToPublisher(gameId: string) {
  const item = getItemById(gameId)
  if (!item) {
    return undefined
  }
  if (item.type === 'publisher' || item.type === 'store') {
    return item
  }
  return item.publisherId ? getItemById(item.publisherId) : undefined
}

export function getPublisherForItem(item: TopupItem) {
  return resolveGameToPublisher(item.id)
}

export function getSkusForPublisher(publisherId: string) {
  const skus = topupSkus.filter((sku) => sku.publisherId === publisherId)
  return skus.length ? skus : topupSkus.filter((sku) => sku.publisherId === 'default')
}
