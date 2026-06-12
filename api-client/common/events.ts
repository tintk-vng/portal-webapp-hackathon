// Event Intelligence feed published by the NapTheVui agent (Scanner -> UI Updater).
// In production set NEXT_PUBLIC_EVENTS_URL to the published events.json (CDN / agent endpoint).
// Falls back to /events.json served from public/ so the page renders out of the box.

const EVENTS_URL = process.env.NEXT_PUBLIC_EVENTS_URL || '/events.json'

export interface EventBannerData {
  publisher: string
  telco_code: string
  game: string
  title: string
  cta?: string
  summary?: string
  source_url?: string
  reason?: string
}

export interface EventsPayload {
  updated_at: string
  default_state: boolean
  banner: EventBannerData | null
  card_badges: Record<string, { label: string; event_name: string; highlight: boolean }>
  news_posts: Array<Record<string, string>>
}

const eventsAPI = {
  async getEvents(): Promise<EventsPayload> {
    const res = await fetch(EVENTS_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load events.json')
    return res.json()
  },
}

export default eventsAPI