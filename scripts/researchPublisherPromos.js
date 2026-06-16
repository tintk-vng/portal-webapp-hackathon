const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const defaultSourcesPath = path.join(root, 'src', 'agent', 'inputs', 'publisherResearchSources.json')
const defaultOutputPath = path.join(root, 'src', 'agent', 'outputs', 'publisherPromoSignals.generated.json')

const disallowedPathParts = [
  'account',
  'admin',
  'cart',
  'checkout',
  'dang-nhap',
  'login',
  'logout',
  'policy',
  'privacy',
  'register',
  'signup',
  'terms'
]

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function parseArgs(argv) {
  const args = {
    sourcesPath: defaultSourcesPath,
    outputPath: defaultOutputPath
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--sources') {
      args.sourcesPath = path.resolve(root, argv[index + 1])
      index += 1
    } else if (value === '--out') {
      args.outputPath = path.resolve(root, argv[index + 1])
      index += 1
    }
  }

  return args
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function stripHtml(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function getOgImage(html, baseUrl) {
  const ogMatch = String(html || '').match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  String(html || '').match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
  if (ogMatch) {
    try {
      return new URL(ogMatch[1], baseUrl).toString()
    } catch {}
  }

  const twitterMatch = String(html || '').match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                       String(html || '').match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i)
  if (twitterMatch) {
    try {
      return new URL(twitterMatch[1], baseUrl).toString()
    } catch {}
  }

  const imgMatches = String(html || '').matchAll(/<img[^>]*src=["']([^"']+)["']/gi)
  for (const match of imgMatches) {
    const src = match[1]
    if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && !src.endsWith('.svg')) {
      try {
        const resolved = new URL(src, baseUrl).toString()
        return resolved
      } catch {}
    }
  }

  return null
}

function getTitle(html) {
  const titleMatch = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) {
    return stripHtml(titleMatch[1]).slice(0, 160)
  }

  const h1Match = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  return h1Match ? stripHtml(h1Match[1]).slice(0, 160) : ''
}

function isAllowedUrl(candidateUrl, source) {
  let parsed
  try {
    parsed = new URL(candidateUrl)
  } catch {
    return false
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return false
  }

  const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase()
  const allowedDomains = (source.allowedDomains || []).map((domain) => String(domain).replace(/^www\./, '').toLowerCase())
  if (!allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
    return false
  }

  const pathText = normalizeText(`${parsed.pathname} ${parsed.search}`)
  return !disallowedPathParts.some((part) => pathText.includes(part))
}

function scoreLink(link, source) {
  const searchable = normalizeText(`${link.url} ${link.text}`)
  return (source.keywords || []).reduce((score, keyword) => {
    return searchable.includes(normalizeText(keyword)) ? score + 1 : score
  }, 0)
}

function extractLinks(html, baseUrl, source) {
  const links = []
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match

  while ((match = anchorPattern.exec(String(html || '')))) {
    let href = match[1]
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue
    }

    try {
      href = new URL(href, baseUrl).toString()
    } catch {
      continue
    }

    const cleanUrl = href.replace(/#.*$/, '')
    if (!isAllowedUrl(cleanUrl, source)) {
      continue
    }

    links.push({
      url: cleanUrl,
      text: stripHtml(match[2]).slice(0, 120)
    })
  }

  const byUrl = new Map()
  for (const link of links) {
    if (!byUrl.has(link.url)) {
      byUrl.set(link.url, link)
    }
  }

  return [...byUrl.values()]
    .map((link) => ({ ...link, score: scoreLink(link, source) }))
    .filter((link) => link.score > 0)
    .sort((a, b) => b.score - a.score)
}

async function fetchPage(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'NapTheVui local campaign research prototype/1.0',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    })

    const contentType = response.headers.get('content-type') || ''
    const body = await response.text()

    return {
      ok: response.ok && contentType.toLowerCase().includes('text/html'),
      status: response.status,
      contentType,
      body
    }
  } finally {
    clearTimeout(timeout)
  }
}

function findEvidence(text, source) {
  const normalized = normalizeText(text)
  const keywords = (source.keywords || []).map(normalizeText)
  let bestIndex = -1

  for (const keyword of keywords) {
    const index = normalized.indexOf(keyword)
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index
    }
  }

  const percentMatch = normalized.match(/\d+(?:[.,]\d+)?\s*%/)
  if (percentMatch && (bestIndex === -1 || percentMatch.index < bestIndex)) {
    bestIndex = percentMatch.index
  }

  if (bestIndex === -1) {
    return text.slice(0, 420)
  }

  const start = Math.max(0, bestIndex - 160)
  const end = Math.min(text.length, bestIndex + 420)
  return text.slice(start, end).trim()
}

function detectDiscount(text) {
  const match = String(text || '').match(/(\d+(?:[.,]\d+)?)\s*%/)
  if (!match) {
    return null
  }

  const value = Number(match[1].replace(',', '.'))
  if (!Number.isFinite(value) || value <= 0 || value >= 100) {
    return null
  }

  return {
    type: 'percent',
    value,
    label: `${Number.isInteger(value) ? value : value.toFixed(2).replace(/\.?0+$/, '')}%`
  }
}

function detectDates(text) {
  const matches = String(text || '').match(/\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/g)
  return matches ? [...new Set(matches)].slice(0, 6) : []
}

function summarizeSignal({ source, pages, warnings, observedAt }) {
  const visitedUrls = pages.map((page) => page.url)
  const combinedText = pages.map((page) => `${page.title}. ${page.text}`).join(' ')
  const evidenceSnippet = combinedText ? findEvidence(combinedText, source) : ''
  const detectedDiscount = detectDiscount(evidenceSnippet) || detectDiscount(combinedText)
  const detectedImageUrl = pages.find((page) => page.imageUrl)?.imageUrl || null
  const keywordHits = (source.keywords || []).filter((keyword) => normalizeText(combinedText).includes(normalizeText(keyword))).length
  const confidence = pages.length === 0 ? 0.05 : Math.min(0.95, 0.2 + keywordHits * 0.06 + (detectedDiscount ? 0.25 : 0))
  const signalWarnings = [...warnings]

  if (!detectedDiscount) {
    signalWarnings.push('No clear public discount percent was detected. Do not publish a discount from this research signal alone.')
  }
  if (pages.length === 0) {
    signalWarnings.push('No public pages could be fetched for this source.')
  }
  if (keywordHits === 0 && pages.length > 0) {
    signalWarnings.push('Fetched pages did not contain configured promotion keywords.')
  }

  return {
    id: `research-${source.id}`,
    publisherId: source.publisherId,
    gameIds: source.gameIds || [],
    sourceName: source.sourceName,
    sourceUrl: source.url,
    sourcePriority: source.priority || 0,
    visitedUrls,
    title: pages[0]?.title || source.sourceName,
    summary: evidenceSnippet.slice(0, 260),
    detectedPromotionText: evidenceSnippet,
    detectedDates: detectDates(combinedText),
    detectedDiscount,
    detectedImageUrl,
    confidence: Number(confidence.toFixed(2)),
    observedAt,
    evidenceSnippet,
    warnings: signalWarnings
  }
}

async function researchSource(source) {
  const warnings = []
  const pages = []
  const queue = [{ url: source.url, depth: 0 }]
  const visited = new Set()
  const maxDepth = source.crawlMode === 'single_page' ? 0 : Number(source.maxDepth) || 1
  const maxPages = Math.max(1, Number(source.maxPages) || 1)

  while (queue.length > 0 && visited.size < maxPages) {
    const current = queue.shift()
    if (!current || visited.has(current.url) || current.depth > maxDepth) {
      continue
    }

    if (!isAllowedUrl(current.url, source)) {
      warnings.push(`Skipped disallowed URL: ${current.url}`)
      continue
    }

    visited.add(current.url)

    try {
      const fetched = await fetchPage(current.url)
      if (!fetched.ok) {
        warnings.push(`Fetch failed or returned non-HTML for ${current.url}: status ${fetched.status}, ${fetched.contentType || 'unknown content-type'}`)
        continue
      }

      const title = getTitle(fetched.body)
      const text = stripHtml(fetched.body)
      pages.push({ url: current.url, title, text, imageUrl: getOgImage(fetched.body, current.url) })

      if (source.crawlMode === 'shallow' && current.depth < maxDepth) {
        for (const link of extractLinks(fetched.body, current.url, source)) {
          if (visited.size + queue.length >= maxPages) {
            break
          }
          if (!visited.has(link.url) && !queue.some((queued) => queued.url === link.url)) {
            queue.push({ url: link.url, depth: current.depth + 1 })
          }
        }
      }
    } catch (error) {
      warnings.push(`Fetch failed for ${current.url}: ${error.message}`)
    }
  }

  return summarizeSignal({
    source,
    pages,
    warnings,
    observedAt: new Date().toISOString()
  })
}

async function researchPublisherPromos(options) {
  const sourceConfig = readJsonIfExists(options.sourcesPath, { sources: [] })
  const sources = (sourceConfig.sources || []).filter((source) => source.enabled)
  const signals = []

  for (const source of sources) {
    signals.push(await researchSource(source))
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.relative(root, options.sourcesPath),
    signals
  }

  writeJson(options.outputPath, output)

  return { output, outputPath: options.outputPath }
}

if (require.main === module) {
  researchPublisherPromos(parseArgs(process.argv.slice(2)))
    .then(({ output, outputPath }) => {
      const succeeded = output.signals.filter((signal) => signal.visitedUrls.length > 0)
      const failed = output.signals.filter((signal) => signal.visitedUrls.length === 0)
      const useful = output.signals.filter((signal) => signal.confidence >= 0.5 || signal.detectedDiscount)

      console.log(`Sources researched: ${output.signals.length}`)
      console.log(`URLs visited: ${output.signals.reduce((count, signal) => count + signal.visitedUrls.length, 0)}`)
      console.log(`Sources succeeded: ${succeeded.length}`)
      console.log(`Sources failed: ${failed.length}`)
      console.log(`Promotion signals found: ${useful.length}`)
      for (const signal of output.signals) {
        console.log(`- ${signal.publisherId}: confidence ${signal.confidence}, visited ${signal.visitedUrls.length}, discount ${signal.detectedDiscount?.label || '(none)'}`)
        for (const warning of signal.warnings) {
          console.log(`  warning: ${warning}`)
        }
      }
      console.log(`Saved generated research to: ${path.relative(root, outputPath)}`)
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}

module.exports = {
  researchPublisherPromos
}
