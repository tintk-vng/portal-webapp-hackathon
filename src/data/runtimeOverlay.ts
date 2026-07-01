import type { Campaign } from './campaigns'
import type { NewsArticle } from './newsArticles'

// Runtime overlay for campaign content that is applied AFTER the server bundle was built.
//
// The campaign console writes newly applied campaigns/articles into src/data/*.ts
// (the compile-time source of truth) AND into src/agent/appliedContent.json (this overlay).
// A running server (dev or prod) cannot see new entries in the compiled *.ts modules
// without a rebuild/restart, so the data layer merges this overlay at request time instead.
//
// Reads happen server-side only. On the client we always rely on props passed from the
// server components, so this returns empty arrays in the browser.

type AppliedOverlay = {
  campaigns: Campaign[]
  articles: NewsArticle[]
}

const EMPTY_OVERLAY: AppliedOverlay = { campaigns: [], articles: [] }

function loadOverlay(): AppliedOverlay {
  if (typeof window !== 'undefined') {
    return EMPTY_OVERLAY
  }

  try {
    const fs = require('fs')
    const path = require('path')
    const overlayPath = path.join(process.cwd(), 'src', 'agent', 'appliedContent.json')

    if (!fs.existsSync(overlayPath)) {
      return EMPTY_OVERLAY
    }

    const parsed = JSON.parse(fs.readFileSync(overlayPath, 'utf8'))
    return {
      campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : [],
      articles: Array.isArray(parsed.articles) ? parsed.articles : []
    }
  } catch {
    return EMPTY_OVERLAY
  }
}

// Upsert overlay entries (by id) onto a base list. Overlay wins so applied content
// reflects the latest state even when the compiled bundle is stale.
export function mergeById<T extends { id: string }>(base: T[], overlay: T[]): T[] {
  if (overlay.length === 0) {
    return base
  }

  const merged = [...base]
  for (const item of overlay) {
    const index = merged.findIndex((existing) => existing.id === item.id)
    if (index >= 0) {
      merged[index] = { ...merged[index], ...item }
    } else {
      merged.push(item)
    }
  }
  return merged
}

export function loadOverlayCampaigns(): Campaign[] {
  return loadOverlay().campaigns
}

export function loadOverlayArticles(): NewsArticle[] {
  return loadOverlay().articles
}
