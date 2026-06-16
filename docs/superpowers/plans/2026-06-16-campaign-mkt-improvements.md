# Campaign MKT — 4 Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 4 UX/feature bugs in the campaign-mkt dashboard: real news content scraping, exclusive top-banner toggle, sort-by-latest in Draft & Rejected, remove priority field, and full-image banner preview.

**Architecture:** All changes are in `portal-webapp-frontend-active`. Issues 1 and 2 touch the API route (`pages/api/campaign/index.ts`). Issues 3–5 are pure UI fixes in `app/game/campaign-mkt/page.tsx`. Issue 1 also adds a new Node.js script for content scraping.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Node.js `child_process.exec` for scripts.

---

## File Map

| File | Change |
|---|---|
| `app/game/campaign-mkt/page.tsx` | Issues 2–5: sort, remove priority, banner image UX, enrich button |
| `pages/api/campaign/index.ts` | Issue 1: `enrich-content` action; Issue 2: `set-top-banner` toggle-off |
| `src/data/campaigns.ts` | Issue 2: export `unsetTopBanner()` |
| `scripts/enrichArticleContent.js` (new) | Issue 1: fetch real content from publisher URLs |

---

## Task 1 — Export `unsetTopBanner` from campaigns.ts

**Files:**
- Modify: `src/data/campaigns.ts:496-500`

- [ ] **Step 1: Add `unsetTopBanner` after `setTopBanner`**

```ts
export function unsetTopBanner() {
  for (const campaign of campaigns) {
    campaign.isTopBanner = false
  }
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/data/campaigns.ts
git commit -m "feat: add unsetTopBanner helper to campaigns data"
```

---

## Task 2 — Fix Top Banner Toggle (Exclusive Radio Behavior)

**Context:** `setTopBanner(id)` already makes all others false. Bug: clicking the currently-active banner re-sets it instead of toggling OFF. Fix: if the target campaign is already `isTopBanner: true`, call `unsetTopBanner()` instead.

**Files:**
- Modify: `pages/api/campaign/index.ts`
  - Import `unsetTopBanner` at line 4
  - Replace `set-top-banner` block at line 117-124

- [ ] **Step 1: Update the import**

Replace:
```ts
import { getActiveCampaign, setTopBanner, campaigns } from '@/src/data/campaigns'
```
With:
```ts
import { getActiveCampaign, setTopBanner, unsetTopBanner, campaigns } from '@/src/data/campaigns'
```

- [ ] **Step 2: Replace the `set-top-banner` handler**

Replace:
```ts
      if (action === 'set-top-banner') {
        if (!campaignId) {
          return res.status(400).json({ error: 'Missing campaignId parameter' })
        }
        setTopBanner(campaignId)
        const activeCampaign = getActiveCampaign()
        return res.status(200).json({ status: 'success', activeCampaign })
      }
```
With:
```ts
      if (action === 'set-top-banner') {
        if (!campaignId) {
          return res.status(400).json({ error: 'Missing campaignId parameter' })
        }
        const alreadyActive = campaigns.find((c) => c.isTopBanner && c.id === campaignId)
        if (alreadyActive) {
          unsetTopBanner()
        } else {
          setTopBanner(campaignId)
        }
        const activeCampaign = getActiveCampaign()
        return res.status(200).json({ status: 'success', activeCampaign })
      }
```

- [ ] **Step 3: Verify the type-check passes**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
Expected: no TypeScript errors

- [ ] **Step 4: Manual test**

Visit `http://localhost:8080/game/campaign-mkt`
- Toggle ON a campaign → it becomes top banner (green dot moves right)
- Toggle the same campaign again → it turns OFF (green dot moves left, "Chưa có chiến dịch nào được kích hoạt" shows)
- Toggle campaign A → ON; toggle campaign B → B turns ON, A turns OFF automatically

- [ ] **Step 5: Commit**

```bash
git add pages/api/campaign/index.ts
git commit -m "fix: top banner toggle now works as exclusive radio (click same to unset)"
```

---

## Task 3 — Sort Draft & Rejected by Latest Update (Descending)

**Context:** `draftAndRejected` proposals come in filesystem order. User wants most recently updated shown first. Each proposal has `statusHistory: { status, timestamp }[]` — the last entry is the latest status change. Fall back to `createdAt` if no history.

**Files:**
- Modify: `app/game/campaign-mkt/page.tsx:569`

- [ ] **Step 1: Add a sort helper above the existing splits**

In `page.tsx`, find the block at line 566:
```ts
  // Split proposals into sections
  const scannedProposals = proposals.filter(p => p.status === 'scanned')
  const appliedProposals = proposals.filter(p => p.status === 'applied' || p.status === 'approved')
  const draftAndRejected = proposals.filter(p => p.status === 'draft' || p.status === 'rejected')
```

Replace with:
```ts
  // Split proposals into sections
  const scannedProposals = proposals.filter(p => p.status === 'scanned')
  const appliedProposals = proposals.filter(p => p.status === 'applied' || p.status === 'approved')

  function latestUpdateTs(p: Proposal): number {
    if (p.statusHistory && p.statusHistory.length > 0) {
      return new Date(p.statusHistory[p.statusHistory.length - 1].timestamp).getTime()
    }
    return new Date(p.createdAt).getTime()
  }

  const draftAndRejected = proposals
    .filter(p => p.status === 'draft' || p.status === 'rejected')
    .sort((a, b) => latestUpdateTs(b) - latestUpdateTs(a))
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
Expected: no errors

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:8080/game/campaign-mkt`
Check "Draft & Từ chối" section: the most recently modified proposal appears at the top.

- [ ] **Step 4: Commit**

```bash
git add app/game/campaign-mkt/page.tsx
git commit -m "feat: sort Draft & Từ chối proposals by latest update descending"
```

---

## Task 4 — Remove "Ưu tiên" from Top Banner Info Card

**Context:** The top banner card shows Publisher, Giảm giá, Ưu tiên. Priority is an internal field — remove it.

**Files:**
- Modify: `app/game/campaign-mkt/page.tsx:657-665`

- [ ] **Step 1: Remove the priority row**

Find in `page.tsx` (inside the top banner info `div`):
```ts
              {[
                { l: 'Publisher', v: topBannerCampaign.targetPublisherId || 'Tất cả' },
                { l: 'Giảm giá', v: topBannerCampaign.discountPercent ? `${topBannerCampaign.discountPercent}%` : '—' },
                { l: 'Ưu tiên', v: String(topBannerCampaign.priority) },
              ].map(({ l, v }) => (
```

Replace with:
```ts
              {[
                { l: 'Publisher', v: topBannerCampaign.targetPublisherId || 'Tất cả' },
                { l: 'Giảm giá', v: topBannerCampaign.discountPercent ? `${topBannerCampaign.discountPercent}%` : '—' },
              ].map(({ l, v }) => (
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
Expected: no errors

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:8080/game/campaign-mkt`
Top banner card info section shows only "Publisher" and "Giảm giá" — no "Ưu tiên" row.

- [ ] **Step 4: Commit**

```bash
git add app/game/campaign-mkt/page.tsx
git commit -m "feat: remove priority field from top banner info card"
```

---

## Task 5 — Banner Image as Full Background in Preview

**Context:** `bannerImageUrl` currently shows as a tiny 40×40 logo. User wants it as the full banner background (like the LoL Wild Rift screenshot: full game art fills the banner, text overlays it). The banner keeps its current size (min-h-[140px] in drawer, min-h-[100px] in live section). When no image URL is set or it's just a logo icon, fall back to the gradient.

**Files:**
- Modify: `app/game/campaign-mkt/page.tsx`
  - Drawer Banner Preview block (lines 259–281)
  - Live campaigns mini banner preview (lines 647–654)

- [ ] **Step 1: Update the Drawer banner preview**

Find and replace the entire banner preview div (the outer `<div className={...}>` that wraps the banner content with the gradient):

Replace:
```tsx
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#E75648] via-[#F1865F] to-[#FFD58F] p-5 text-white shadow-lg min-h-[140px] flex flex-col justify-between`}>
              <span className="absolute right-3 top-3 rounded-lg bg-white px-2.5 py-1 text-xs font-extrabold text-blue-600 shadow">
                {proposal.discountText || `Giảm ${proposal.discountPercent}%`}
              </span>
              <div>
                <h4 className="font-extrabold text-xl leading-tight mt-6 text-slate-900 drop-shadow-sm">
                  {editFields?.bannerTitle || proposal.bannerTitle}
                </h4>
                <p className="text-sm text-slate-800 font-medium mt-1.5">
                  {editFields?.bannerSubtitle || proposal.bannerSubtitle}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm font-bold text-blue-700">
                <span>{proposal.ctaText || 'Xem ưu đãi'}</span>
                {(editFields?.bannerImageUrl || proposal.bannerImageUrl) && (
                  <img src={editFields?.bannerImageUrl || proposal.bannerImageUrl} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-white/40 p-1" />
                )}
              </div>
            </div>
```

With:
```tsx
            {(() => {
              const imgUrl = editFields?.bannerImageUrl || proposal.bannerImageUrl
              const hasBgImage = !!imgUrl
              return (
                <div
                  className="relative overflow-hidden rounded-xl shadow-lg min-h-[140px] flex flex-col justify-between"
                  style={hasBgImage ? {
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  {/* gradient overlay — always present; stronger when image behind */}
                  <div className={`absolute inset-0 ${hasBgImage ? 'bg-gradient-to-r from-black/70 via-black/40 to-transparent' : 'bg-gradient-to-br from-[#E75648] via-[#F1865F] to-[#FFD58F]'} rounded-xl`} />
                  <div className="relative z-10 p-5 flex flex-col justify-between h-full min-h-[140px]">
                    <span className="absolute right-3 top-3 rounded-lg bg-white px-2.5 py-1 text-xs font-extrabold text-blue-600 shadow">
                      {proposal.discountText || `Giảm ${proposal.discountPercent}%`}
                    </span>
                    <div>
                      <h4 className={`font-extrabold text-xl leading-tight mt-6 drop-shadow-sm ${hasBgImage ? 'text-white' : 'text-slate-900'}`}>
                        {editFields?.bannerTitle || proposal.bannerTitle}
                      </h4>
                      <p className={`text-sm font-medium mt-1.5 ${hasBgImage ? 'text-white/80' : 'text-slate-800'}`}>
                        {editFields?.bannerSubtitle || proposal.bannerSubtitle}
                      </p>
                    </div>
                    <div className={`mt-5 flex items-center justify-between text-sm font-bold ${hasBgImage ? 'text-white' : 'text-blue-700'}`}>
                      <span>{proposal.ctaText || 'Xem ưu đãi'}</span>
                      {hasBgImage && (
                        <span className="rounded-lg bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold text-white border border-white/30">
                          {proposal.ctaText || 'Xem ưu đãi →'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
```

- [ ] **Step 2: Update the live campaigns mini banner preview**

Find in the live campaigns section (around line 647):
```tsx
              <div className={`relative flex-1 overflow-hidden rounded-xl bg-gradient-to-br ${topBannerCampaign.themeClassName || 'from-blue-600 to-green-600'} p-4 text-white shadow-inner min-h-[100px]`}>
                {topBannerCampaign.discountText && (
                  <span className="absolute right-2 top-2 rounded bg-white px-2 py-0.5 text-xs font-extrabold text-blue-600">{topBannerCampaign.discountText}</span>
                )}
                <h3 className="font-bold text-lg leading-tight mt-4">{topBannerCampaign.title}</h3>
                <p className="text-xs text-white/80 mt-1">{topBannerCampaign.subtitle}</p>
              </div>
```

Replace with:
```tsx
              {(() => {
                const hasBgImage = !!topBannerCampaign.bannerImageUrl
                return (
                  <div
                    className="relative flex-1 overflow-hidden rounded-xl shadow-inner min-h-[100px]"
                    style={hasBgImage ? {
                      backgroundImage: `url(${topBannerCampaign.bannerImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                  >
                    <div className={`absolute inset-0 rounded-xl ${hasBgImage ? 'bg-gradient-to-r from-black/60 via-black/30 to-transparent' : `bg-gradient-to-br ${topBannerCampaign.themeClassName || 'from-blue-600 to-green-600'}`}`} />
                    <div className="relative z-10 p-4 min-h-[100px] flex flex-col justify-between">
                      {topBannerCampaign.discountText && (
                        <span className="absolute right-2 top-2 rounded bg-white px-2 py-0.5 text-xs font-extrabold text-blue-600">{topBannerCampaign.discountText}</span>
                      )}
                      <h3 className="font-bold text-lg leading-tight mt-4 text-white">{topBannerCampaign.title}</h3>
                      <p className="text-xs text-white/80 mt-1">{topBannerCampaign.subtitle}</p>
                    </div>
                  </div>
                )
              })()}
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
Expected: no errors

- [ ] **Step 4: Verify in browser**

Visit `http://localhost:8080/game/campaign-mkt`
- Open a proposal's drawer
- In "URL ảnh Banner (Desktop)" field, paste a real game banner URL (e.g., `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80`)
- Click "Lưu chỉnh sửa"
- Reopen drawer → banner preview now shows the image as full background with text overlaid
- The live campaign mini-banner in "Đang chạy" also shows full-image when bannerImageUrl is a game banner

- [ ] **Step 5: Commit**

```bash
git add app/game/campaign-mkt/page.tsx
git commit -m "feat: banner preview uses full background image with gradient text overlay"
```

---

## Task 6 — Real News Content: Create enrichArticleContent.js Script

**Context:** Proposal `articleContent` currently contains AI-generated template HTML. This script fetches real content from official publisher URLs in `publisherResearchSources.json`, extracts promo/event text, and writes enriched HTML back into the proposal JSON.

**Files:**
- Create: `scripts/enrichArticleContent.js`

- [ ] **Step 1: Create the script**

```js
#!/usr/bin/env node
/**
 * enrichArticleContent.js
 *
 * Fetches real promotional content from official publisher websites and updates
 * a proposal's articleContent with real, useful information.
 *
 * Usage: node scripts/enrichArticleContent.js <proposalId>
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const root = path.resolve(__dirname, '..')
const proposalDir = path.join(root, 'src', 'agent', 'proposals')
const researchSourcesPath = path.join(root, 'src', 'agent', 'inputs', 'publisherResearchSources.json')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function fetchUrl(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, { headers: { 'User-Agent': 'NapTheVui-ContentBot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeoutMs).then(resolve).catch(reject)
      }
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => resolve(body))
    })
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)) })
    req.on('error', reject)
  })
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function stripHtml(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )
}

function extractTextBlocks(html, keywords) {
  // Extract paragraphs and headings that contain any keyword
  const blocks = []
  const tagPattern = /<(h[1-4]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi
  let match
  while ((match = tagPattern.exec(html)) !== null) {
    const text = stripHtml(match[2]).trim()
    if (text.length < 20) continue
    const lower = text.toLowerCase()
    const relevant = keywords.some(kw => lower.includes(kw.toLowerCase()))
    if (relevant) blocks.push({ tag: match[1], text })
    if (blocks.length >= 15) break
  }
  return blocks
}

function buildArticleHtml(proposal, blocks, sourceUrl) {
  const discount = proposal.discountPercent ? `${proposal.discountPercent}%` : ''
  const publisher = proposal.targetPublisherId || ''
  const games = (proposal.targetGameIds || []).join(', ')

  const blockHtml = blocks.length > 0
    ? blocks.map(b => {
        if (b.tag.startsWith('h')) return `<h4>${b.text}</h4>`
        return `<p>${b.text}</p>`
      }).join('\n')
    : `<p>Cập nhật ưu đãi mới nhất từ trang chính thức ${publisher.toUpperCase()} tại <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a>.</p>`

  return `<h3>Ưu Đãi Nạp ${publisher.toUpperCase()} ${discount ? `Giảm ${discount}` : ''}</h3>
<p><strong>Áp dụng cho:</strong> ${games || publisher.toUpperCase()}.</p>
<p><strong>Mức ưu đãi:</strong> ${discount ? `Giảm ${discount}` : 'Xem chi tiết tại trang nạp'} khi nạp qua NapTheVui.</p>

<h4>Nội dung từ nhà phát hành chính thức:</h4>
${blockHtml}

<h4>Hướng dẫn nạp và nhận ưu đãi:</h4>
<ol>
<li>Tìm kiếm <strong>${publisher.toUpperCase()}</strong> hoặc tên tựa game trong ô tìm kiếm NapTheVui.</li>
<li>Chọn mệnh giá thẻ nạp phù hợp.</li>
<li>Kiểm tra chiết khấu hiển thị tại màn hình thanh toán trước khi xác nhận.</li>
</ol>

<p><em>Nguồn: <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a>. Nội dung được tổng hợp tự động — kiểm tra và xác nhận trước khi xuất bản.</em></p>`
}

async function enrichProposal(proposalId) {
  const proposalPath = path.join(proposalDir, `${proposalId}.json`)
  if (!fs.existsSync(proposalPath)) {
    console.error(`Proposal not found: ${proposalPath}`)
    process.exit(1)
  }

  const proposal = readJson(proposalPath)
  const sources = readJson(researchSourcesPath)

  // Find the source for this proposal's publisher
  const source = sources.sources.find(
    s => s.publisherId === proposal.targetPublisherId && s.enabled
  )

  if (!source) {
    console.log(`No research source found for publisher: ${proposal.targetPublisherId}`)
    console.log('Writing placeholder with source attribution only.')
    proposal.articleContent = buildArticleHtml(proposal, [], proposal.targetPublisherId)
    writeJson(proposalPath, proposal)
    return
  }

  console.log(`Fetching content from: ${source.url}`)
  let html = ''
  try {
    html = await fetchUrl(source.url)
    console.log(`Fetched ${html.length} bytes from ${source.url}`)
  } catch (err) {
    console.warn(`Failed to fetch ${source.url}: ${err.message}`)
  }

  const blocks = html ? extractTextBlocks(html, source.keywords) : []
  console.log(`Extracted ${blocks.length} relevant text blocks`)

  proposal.articleContent = buildArticleHtml(proposal, blocks, source.url)
  writeJson(proposalPath, proposal)
  console.log(`Updated articleContent for proposal: ${proposalId}`)
}

const proposalId = process.argv[2]
if (!proposalId) {
  console.error('Usage: node scripts/enrichArticleContent.js <proposalId>')
  process.exit(1)
}

enrichArticleContent(proposalId).catch(err => {
  console.error(err)
  process.exit(1)
})

async function enrichArticleContent(id) {
  await enrichProposal(id)
}
```

- [ ] **Step 2: Test the script manually**

```bash
# Use an existing proposal id
PROPOSAL_ID=$(ls src/agent/proposals/ | head -1 | sed 's/.json//')
node scripts/enrichArticleContent.js $PROPOSAL_ID
```
Expected: script fetches URL, logs byte count and block count, writes updated proposal JSON.

- [ ] **Step 3: Check the updated proposal**

```bash
cat src/agent/proposals/${PROPOSAL_ID}.json | grep -A 20 '"articleContent"'
```
Expected: real paragraph text from the publisher site, not template boilerplate like "được tạo tự động dựa trên Weekly campaign brief".

- [ ] **Step 4: Commit**

```bash
git add scripts/enrichArticleContent.js
git commit -m "feat: add enrichArticleContent script to fetch real publisher content"
```

---

## Task 7 — Add `enrich-content` API Action and UI Button

**Context:** Wire the script from Task 6 into the campaign API and surface it as a button in the proposal drawer.

**Files:**
- Modify: `pages/api/campaign/index.ts` — add `enrich-content` action after the `update` handler
- Modify: `app/game/campaign-mkt/page.tsx` — add button in Drawer footer

- [ ] **Step 1: Add the `enrich-content` action to the API**

In `pages/api/campaign/index.ts`, find the closing of the `update` action block (around line 160), and add after it:

```ts
      if (action === 'enrich-content') {
        if (!proposalId) {
          return res.status(400).json({ error: 'Missing proposalId parameter' })
        }
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        const scriptPath = path.join(process.cwd(), 'scripts', 'enrichArticleContent.js')
        return new Promise<void>((resolve) => {
          exec(`node ${scriptPath} ${proposalId}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Enrich failed: ${error.message}\n${stderr}`)
              res.status(500).json({ error: 'Content enrichment failed', details: error.message, stderr })
              return resolve()
            }
            const updated = getCampaignProposal(proposalId)
            res.status(200).json({ status: 'success', message: 'Nội dung đã được cập nhật từ nguồn chính thức.', proposal: updated, stdout })
            return resolve()
          })
        })
      }
```

- [ ] **Step 2: Add the "Làm giàu nội dung" button in the Drawer footer**

In `page.tsx`, in the `Drawer` component's footer section (inside `<div className="border-t ... space-y-2 bg-slate-950/50">`), after the existing status action buttons, add the enrich button for `scanned` and `draft` proposals:

Find the closing `</div>` of the drawer footer section (the one that wraps all the action buttons). Before the closing `</div>`, add:

```tsx
          {(proposal.status === 'scanned' || proposal.status === 'draft') && (
            <button
              onClick={() => onAction('enrich-content')}
              disabled={actionLoading !== null}
              className="w-full rounded-xl border border-teal-500/40 bg-teal-900/30 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-800/40 transition disabled:opacity-50"
            >
              {actionLoading?.startsWith('enrich-content') ? '⏳ Đang cào nội dung...' : '🌐 Cào nội dung chính thức'}
            </button>
          )}
```

- [ ] **Step 3: Wire `enrich-content` in `handleDrawerAction`**

`handleDrawerAction` already passes through any action string to `apiAction`. No change needed — `onAction('enrich-content')` will call `apiAction('enrich-content', { proposalId: selectedProposal.id })`.

After the action succeeds and `fetchData()` is called, the drawer will auto-refresh if the user re-opens it. For a better UX, also update `selectedProposal` from the response. In `apiAction`, find:

```ts
        if (data.proposal && selectedProposal?.id === (body.proposalId)) {
          setSelectedProposal(data.proposal)
        }
```

This is already there — the drawer will refresh with real content.

- [ ] **Step 4: Verify no TypeScript errors**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
Expected: no errors

- [ ] **Step 5: Manual test**

Visit `http://localhost:8080/game/campaign-mkt`
- Click a draft or scanned proposal
- In the drawer footer, click "🌐 Cào nội dung chính thức"
- Toast shows "Đang xử lý..."
- After a few seconds (network request), toast shows "Nội dung đã được cập nhật từ nguồn chính thức."
- Scroll to "Bài viết đi kèm (CMS)" in the drawer → article content now shows real text extracted from the publisher's website

- [ ] **Step 6: Commit**

```bash
git add pages/api/campaign/index.ts app/game/campaign-mkt/page.tsx
git commit -m "feat: add enrich-content action to scrape real publisher article content"
```

---

## Self-Review Checklist

### Spec Coverage

| Issue | Tasks |
|---|---|
| 1. Real news content scraping | Task 6 (script) + Task 7 (API + UI button) |
| 2. Top banner toggle exclusive | Task 1 (unsetTopBanner) + Task 2 (API fix) |
| 3. Sort Draft & Rejected by latest update | Task 3 |
| 4. Remove "Ưu tiên" from top banner | Task 4 |
| 5. Banner image as full background | Task 5 |

### Placeholder Scan

- No TBD, TODO, or "implement later" present
- All code blocks are complete and runnable
- All file paths are exact

### Type Consistency

- `unsetTopBanner` added in Task 1, imported in Task 2 ✓
- `Proposal` type in `page.tsx` already has `statusHistory?: StatusHistoryEntry[]` at line 70 ✓
- `enrichArticleContent.js` is a plain Node.js script (no TS compilation needed) ✓
- Drawer `onAction` callback is `(action: string) => void` — `'enrich-content'` is a string ✓
