# Campaign MKT Page — Fix & Improvements Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix production bugs and improve the campaign-mkt dashboard with deactivate action, image sync, mock data removal, and UI cleanup.

**Architecture:** Single Next.js page (`app/game/campaign-mkt/page.tsx`) backed by a Pages API route (`pages/api/campaign/index.ts`). Campaign state persists via `src/data/campaigns.ts` (static) and `src/agent/campaignState.json` (runtime overrides). Proposals stored as JSON in `src/agent/proposals/`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Node.js child_process for agent scripts.

---

## Task Overview

| # | Task | Files Changed | Risk |
|---|------|--------------|------|
| 1 | Cleanup dummy entries in campaigns.ts + delete stale proposals | `src/data/campaigns.ts`, 9 `.json` deletions | Low |
| 2 | Fix generateWeeklyCampaignProposal.js to skip mock data | `scripts/generateWeeklyCampaignProposal.js` | Low |
| 3 | Add `campaignState.json` + `disableCampaign()` in campaigns.ts | `src/agent/campaignState.json`, `src/data/campaigns.ts` | Medium |
| 4 | API — add `deactivate` + `delete-proposal` actions, update GET | `pages/api/campaign/index.ts`, `src/data/campaigns.ts` | Medium |
| 5 | UI — "Tắt" button in live campaigns table + "Đã tắt" section | `app/game/campaign-mkt/page.tsx` | Medium |
| 6 | UI — Image sync button, rename enrich button, add delete button | `app/game/campaign-mkt/page.tsx` | Medium |

---

## TASK 1 — Cleanup: Remove dummy entries from campaigns.ts + delete test proposal files

**Rationale:** Multiple stale test campaigns and proposal JSON files pollute the data layer and cause the live campaigns table to show entries that should never reach production.

**Files affected:**
- Modify: `src/data/campaigns.ts`
- Delete (use `rm -f`): `src/agent/proposals/weekly-vtc-test-2026-06-14.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-googleplay-test-2026-06-14.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-googleplay-clean-slate-2026-06-14.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-garena-2026-06-14.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-garena-2026-06-15.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-googleplay-v1a-2026-06-15.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-garena-v1a-2026-06-15.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-garena-2026-06-16-2.json`
- Delete (use `rm -f`): `src/agent/proposals/weekly-garena-2026-06-16.json`

**Entries to keep in `campaigns` array (the main editable block, lines ~41–316 of `src/data/campaigns.ts`):**
- `weekly-garena-2026-06-16-4` — the only active campaign (`enabled: true`, `isTopBanner: true`)

**Entries to keep in `lastKnownValidCampaigns` array (lines ~319–346):**
- `garena-free-fire-week-safe` — marked `// FALLBACK_SAFE`

**Entries to keep in `fallbackCampaigns` array (lines ~348–371):**
- `fallback-garena-discount`

**Entries to REMOVE from the `campaigns` array:**
- `garena-free-fire-week` (lines ~43–67)
- `google-play-store` (lines ~68–79)
- `weekly-garena-2026-06-14` (lines ~81–109)
- `weekly-googleplay-test-2026-06-14` (lines ~110–138)
- `weekly-vtc-test-2026-06-14` (lines ~140–166)
- `weekly-googleplay-clean-slate-2026-06-14` (lines ~168–195)
- `weekly-googleplay-v1a-2026-06-15` (lines ~196–224)
- `weekly-garena-v1a-2026-06-15` (lines ~225–254)
- `weekly-garena-2026-06-16-2` (lines ~255–284)

After cleanup, the `campaigns` array should contain exactly ONE entry: `weekly-garena-2026-06-16-4`.

### Steps

- [ ] **1.1** Read `src/data/campaigns.ts` fully to confirm the current line positions of entries before editing
- [ ] **1.2** Remove the 9 entries from the `campaigns: Campaign[]` array. After cleanup the array body must be exactly:

```typescript
// AI_AGENT_EDITABLE: update active campaigns and banner slot content
export const campaigns: Campaign[] = [
  {
    id: "weekly-garena-2026-06-16-4",
    title: "Ưu đãi nạp Garena trong tuần",
    subtitle: "Giảm 5% cho Free Fire, Liên Quân Mobile trên NapTheVui.",
    bannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    mobileBannerImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    altText: "Garena promotion banner",
    targetPublisherId: "garena",
    targetGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    discountPercent: 5,
    discountText: "Giảm 5%",
    skuDiscounts: [
      {
        id: "weekly-garena-2026-06-16-4-garena-eligible-skus",
        publisherId: "garena",
        discountPercent: 5,
        enabled: true
      }
    ],
    ctaText: "Xem ưu đãi",
    articleId: "weekly-garena-2026-06-16-4",
    enabled: true,
    priority: 260,
    isTopBanner: true,
    themeClassName: "from-[#E75648] via-[#F1865F] to-[#FFD58F]"
  }
]
```

- [ ] **1.3** Delete the 9 stale proposal JSON files (use `rm -f` to avoid errors if some do not exist on disk):
```bash
rm -f src/agent/proposals/weekly-vtc-test-2026-06-14.json
rm -f src/agent/proposals/weekly-googleplay-test-2026-06-14.json
rm -f src/agent/proposals/weekly-googleplay-clean-slate-2026-06-14.json
rm -f src/agent/proposals/weekly-garena-2026-06-14.json
rm -f src/agent/proposals/weekly-garena-2026-06-15.json
rm -f src/agent/proposals/weekly-googleplay-v1a-2026-06-15.json
rm -f src/agent/proposals/weekly-garena-v1a-2026-06-15.json
rm -f src/agent/proposals/weekly-garena-2026-06-16-2.json
rm -f src/agent/proposals/weekly-garena-2026-06-16.json
```

- [ ] **1.4** Run `npm run build` and confirm zero TypeScript errors
- [ ] **1.5** Commit: `chore: remove stale test campaigns and proposal files from data layer`

---

## TASK 2 — Fix generateWeeklyCampaignProposal.js: Skip mock data when `--run-research` is passed

**Rationale:** When the API calls the scan script with `--run-research` (API route line 55), the script should rely exclusively on real researched data. Currently it loads `mockAnalytics.json` and `publisherPromoSignals.json` (manual static fixtures) even in research mode, diluting AI output with hardcoded values.

**File affected:** `scripts/generateWeeklyCampaignProposal.js`

**Key locations (verified):**
- Line 8: `const defaultAnalyticsPath = path.join(root, 'src', 'agent', 'inputs', 'mockAnalytics.json')`
- Line 9: `const defaultSignalsPath = path.join(root, 'src', 'agent', 'inputs', 'publisherPromoSignals.json')`
- Line 59: `runResearch: false` (set to `true` by `--run-research` flag at line 82)
- Line 664: `const analytics = readJsonIfExists(options.analyticsPath, { items: [] })`
- Line 665: `const manualPromoSignals = readJsonIfExists(options.signalsPath, { signals: [] })`

### Steps

- [ ] **2.1** Read `scripts/generateWeeklyCampaignProposal.js` lines 650–690 to confirm exact line numbers before editing

- [ ] **2.2** Apply Change 1 — replace the `analytics` assignment at line ~664:

```javascript
// BEFORE:
const analytics = readJsonIfExists(options.analyticsPath, { items: [] })
```
```javascript
// AFTER:
const analytics = options.runResearch
  ? { items: [] }  // skip mock analytics during research mode; rely on AI judgment
  : readJsonIfExists(options.analyticsPath, { items: [] })
```

- [ ] **2.3** Apply Change 2 — replace the `manualPromoSignals` assignment at line ~665:

```javascript
// BEFORE:
const manualPromoSignals = readJsonIfExists(options.signalsPath, { signals: [] })
```
```javascript
// AFTER:
const manualPromoSignals = options.runResearch
  ? { signals: [] }  // skip manual signals during research mode; use generated signals only
  : readJsonIfExists(options.signalsPath, { signals: [] })
```

- [ ] **2.4** Verify warning messages at lines ~677–684 still make sense — they will now correctly warn that analytics/signals are empty during research mode (expected and acceptable; the warnings are informational only)

- [ ] **2.5** Verify script parses without syntax errors:
```bash
node --check scripts/generateWeeklyCampaignProposal.js
```
Expected: no output (clean parse)

- [ ] **2.6** Commit: `fix: skip mockAnalytics and manual signals when generateWeeklyCampaignProposal runs with --run-research`

---

## TASK 3 — Add campaignState.json + disableCampaign() in campaigns.ts

**Rationale:** The `set-top-banner` toggle updates in-memory state only and does not survive server restarts. The new `deactivate` action (TASK 4) needs the same durability. This task adds the persistence file and the mutation/read functions before the API wires them up.

**Files affected:**
- Create: `src/agent/campaignState.json`
- Modify: `src/data/campaigns.ts`

### Steps

- [ ] **3.1** Create `src/agent/campaignState.json` with this exact content:
```json
{
  "disabledCampaigns": []
}
```

- [ ] **3.2** Read `src/data/campaigns.ts` to confirm the current top-of-file imports block (currently only `import { getItemById, topupSkus } from './catalog'`)

- [ ] **3.3** Add `fs` and `path` imports at the very top of `src/data/campaigns.ts`, before the existing import:
```typescript
import fs from 'fs'
import path from 'path'
import { getItemById, topupSkus } from './catalog'
```

- [ ] **3.4** Locate the existing exported functions near the bottom of `src/data/campaigns.ts` — specifically `setTopBanner` and `unsetTopBanner`. Add the four new functions immediately after `unsetTopBanner`:

```typescript
function getCampaignStatePath() {
  return path.join(process.cwd(), 'src', 'agent', 'campaignState.json')
}

function loadCampaignState(): { disabledCampaigns: string[] } {
  try {
    const raw = fs.readFileSync(getCampaignStatePath(), 'utf8')
    return JSON.parse(raw)
  } catch {
    return { disabledCampaigns: [] }
  }
}

function writeCampaignState(state: { disabledCampaigns: string[] }) {
  fs.writeFileSync(getCampaignStatePath(), JSON.stringify(state, null, 2))
}

export function disableCampaign(campaignId: string) {
  const campaign = campaigns.find(c => c.id === campaignId)
  if (campaign) campaign.enabled = false
  const state = loadCampaignState()
  if (!state.disabledCampaigns.includes(campaignId)) {
    state.disabledCampaigns.push(campaignId)
    writeCampaignState(state)
  }
}
```

- [ ] **3.5** Update the existing `isCampaignVisible` function (currently at line ~444). Replace its body:

```typescript
// BEFORE:
function isCampaignVisible(campaign: Campaign) {
  if (!campaign.enabled) {
    return false
  }

  const now = new Date()
  if (campaign.validFrom && now < new Date(campaign.validFrom)) {
    return false
  }
  if (campaign.validTo && now > new Date(campaign.validTo)) {
    return false
  }
  return true
}
```
```typescript
// AFTER:
function isCampaignVisible(campaign: Campaign) {
  if (!campaign.enabled) return false

  const state = loadCampaignState()
  if (state.disabledCampaigns.includes(campaign.id)) return false

  const now = new Date()
  if (campaign.validFrom && now < new Date(campaign.validFrom)) return false
  if (campaign.validTo && now > new Date(campaign.validTo)) return false
  return true
}
```

- [ ] **3.6** Run `npm run build` and confirm zero TypeScript errors
- [ ] **3.7** Commit: `feat: add campaignState.json persistence layer and disableCampaign() export`

---

## TASK 4 — API: Add deactivate + delete-proposal actions; update GET response

**Rationale:** The dashboard needs server-side endpoints for the new deactivate and delete-proposal UI actions, and the GET response must include `disabledCampaigns` so the new "Đã tắt" section in the UI can render.

**Files affected:**
- Modify: `src/data/campaigns.ts` — add `getDisabledCampaigns()` export
- Modify: `pages/api/campaign/index.ts` — update import, GET handler, and add two new POST action blocks

### Steps

- [ ] **4.1** Add `getDisabledCampaigns()` to `src/data/campaigns.ts`, immediately after `disableCampaign` (added in TASK 3):

```typescript
export function getDisabledCampaigns(): Campaign[] {
  const state = loadCampaignState()
  return campaigns.filter(c => state.disabledCampaigns.includes(c.id))
}
```

- [ ] **4.2** Read `pages/api/campaign/index.ts` line 1–10 to see the current import block. Update the `campaigns` import at line 4:

```typescript
// BEFORE:
import { getActiveCampaign, setTopBanner, unsetTopBanner, campaigns } from '@/src/data/campaigns'
```
```typescript
// AFTER:
import { getActiveCampaign, setTopBanner, unsetTopBanner, campaigns, disableCampaign, getDisabledCampaigns } from '@/src/data/campaigns'
```

- [ ] **4.3** Add `import fs from 'fs'` to the top of `pages/api/campaign/index.ts` if not already present. Place it as the first import:

```typescript
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import path from 'path'
```

- [ ] **4.4** Update the GET handler's `res.status(200).json(...)` call (currently lines ~36–41). Replace:

```typescript
// BEFORE:
return res.status(200).json({
  activeCampaign,
  topBannerCampaign,
  liveCampaigns,
  proposals
})
```
```typescript
// AFTER:
const disabledCampaigns = getDisabledCampaigns()
return res.status(200).json({
  activeCampaign,
  topBannerCampaign,
  liveCampaigns,
  disabledCampaigns,
  proposals
})
```

- [ ] **4.5** Add the `deactivate` action block after the `set-top-banner` block (currently ending around line 129), before the `if (action === 'update')` block:

```typescript
if (action === 'deactivate') {
  const { campaignId } = req.body
  if (!campaignId) {
    return res.status(400).json({ error: 'Missing campaignId parameter' })
  }
  const found = campaigns.find((c) => c.id === campaignId)
  if (!found) {
    return res.status(404).json({ error: 'Campaign not found' })
  }
  disableCampaign(campaignId)
  return res.status(200).json({ status: 'success', message: `Campaign "${campaignId}" đã bị tắt.` })
}
```

- [ ] **4.6** Update the `proposalId`-required action guard at line ~83 to include `delete-proposal`:

```typescript
// BEFORE:
if (action === 'acknowledge' || action === 'approve' || action === 'reject' || action === 'apply' || action === 'revert' || action === 'update' || action === 'enrich-content') {
```
```typescript
// AFTER:
if (action === 'acknowledge' || action === 'approve' || action === 'reject' || action === 'apply' || action === 'revert' || action === 'update' || action === 'enrich-content' || action === 'delete-proposal') {
```

- [ ] **4.7** Add the `delete-proposal` action block after the `deactivate` block:

```typescript
if (action === 'delete-proposal') {
  if (!proposalId) {
    return res.status(400).json({ error: 'Missing proposalId parameter' })
  }
  const proposal = getCampaignProposal(proposalId)
  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' })
  }
  if (proposal.status === 'applied') {
    return res.status(400).json({ error: 'Không thể xóa proposal đang được áp dụng.' })
  }
  const proposalFilePath = path.join(process.cwd(), 'src', 'agent', 'proposals', `${proposalId}.json`)
  if (fs.existsSync(proposalFilePath)) {
    fs.unlinkSync(proposalFilePath)
  }
  return res.status(200).json({ status: 'success', message: `Proposal "${proposalId}" đã bị xóa.` })
}
```

- [ ] **4.8** Run `npm run build` and confirm zero TypeScript errors
- [ ] **4.9** Commit: `feat: add deactivate and delete-proposal API actions; expose disabledCampaigns in GET response`

---

## TASK 5 — UI: "Tắt" button in live campaigns table + "Đã tắt" section

**Rationale:** Users need a visible one-click way to deactivate a live campaign. Deactivated campaigns should move to a new collapsed "Đã tắt" section so they remain auditable without cluttering the main view.

**File affected:** `app/game/campaign-mkt/page.tsx`

### Steps

- [ ] **5.1** Add `disabledCampaigns` state in `CampaignMktPage` (in the state declarations block, currently lines 499–511). Add after the `editFields` state:

```typescript
const [disabledCampaigns, setDisabledCampaigns] = useState<Campaign[]>([])
```

- [ ] **5.2** Update `fetchData` (currently lines 530–545). In the `if (res.ok)` block, add the new state setter:

```typescript
// BEFORE (inside if (res.ok)):
setTopBannerCampaign(data.topBannerCampaign)
setLiveCampaigns(data.liveCampaigns || [])
setProposals(data.proposals || [])
```
```typescript
// AFTER:
setTopBannerCampaign(data.topBannerCampaign)
setLiveCampaigns(data.liveCampaigns || [])
setProposals(data.proposals || [])
setDisabledCampaigns(data.disabledCampaigns || [])
```

- [ ] **5.3** Update the live campaigns table action cell (currently lines 784–788). Replace the `<td>` that contains only the "Xem trên site" link:

```tsx
// BEFORE:
<td className="py-3.5 text-right sticky right-0">
  <Link href="/game" target="_blank" className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition whitespace-nowrap">
    Xem trên site
  </Link>
</td>
```
```tsx
// AFTER:
<td className="py-3.5 text-right sticky right-0" onClick={(e) => e.stopPropagation()}>
  <div className="flex justify-end gap-1.5">
    <Link href="/game" target="_blank" className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition whitespace-nowrap">
      Xem trên site
    </Link>
    <button
      onClick={() => apiAction('deactivate', { campaignId: c.id })}
      disabled={actionLoading !== null}
      className="rounded-lg bg-rose-600/70 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50 whitespace-nowrap"
    >
      Tắt
    </button>
  </div>
</td>
```

- [ ] **5.4** Add Section 4 "Đã tắt" between the closing `</Section>` of Section 3 (line ~853) and the `{/* ═══ Slide-in Drawer ═══ */}` comment (line ~855):

```tsx
{/* ═══ Section 4: Đã tắt ═══ */}
{disabledCampaigns.length > 0 && (
  <Section title="Đã tắt" icon="⛔" count={disabledCampaigns.length} defaultOpen={false} accentColor="blue">
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-slate-500">
            <th className="pb-3 pr-4 font-semibold">Chiến dịch</th>
            <th className="hidden pb-3 pr-4 font-semibold md:table-cell">Publisher</th>
            <th className="hidden pb-3 pr-4 font-semibold sm:table-cell">Giảm giá</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {disabledCampaigns.map((c) => (
            <tr key={c.id} className="opacity-50">
              <td className="py-3.5 pr-4">
                <div className="font-semibold text-white truncate max-w-[240px]">{c.title}</div>
                <div className="text-xs text-slate-500 truncate max-w-[240px] mt-0.5">{c.id}</div>
              </td>
              <td className="hidden py-3.5 pr-4 md:table-cell">
                <span className="rounded-md bg-slate-800/80 px-2 py-1 text-xs font-semibold text-slate-300 uppercase">{c.targetPublisherId}</span>
              </td>
              <td className="hidden py-3.5 pr-4 sm:table-cell">
                {c.discountPercent ? <span className="font-bold text-slate-400">-{c.discountPercent}%</span> : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Section>
)}
```

- [ ] **5.5** Run `npm run dev` locally and verify:
  - Live campaigns table shows "Tắt" button next to "Xem trên site"
  - Clicking "Tắt" calls the deactivate endpoint and refreshes data
  - Deactivated campaign disappears from live table and appears in collapsed "Đã tắt" section
- [ ] **5.6** Run `npm run build` and confirm zero TypeScript errors
- [ ] **5.7** Commit: `feat: add deactivate button to live campaigns table and Đã tắt section`

---

## TASK 6 — UI: Rename enrich button + Image sync button + Delete proposal button

**Rationale:** Three UX improvements in the proposal drawer:
1. Rename "Cào nội dung chính thức" to a clearer label for non-technical operators
2. Add a one-click sync to copy `bannerImageUrl` → `coverImageUrl` to prevent URL duplication
3. Add a delete button so stale proposals can be removed without a terminal command

**File affected:** `app/game/campaign-mkt/page.tsx`

### Steps

**6a — Rename enrich button**

- [ ] **6.1** Find the enrich button label at line ~478. Replace:

```tsx
// BEFORE:
{actionLoading?.startsWith('enrich-content') ? '⏳ Đang cào nội dung...' : '🌐 Cào nội dung chính thức'}
```
```tsx
// AFTER:
{actionLoading?.startsWith('enrich-content') ? '⏳ Đang cập nhật...' : '🔄 Lấy nội dung mới nhất từ website'}
```

**6b — Add image sync button in drawer editable fields section**

- [ ] **6.2** Find the editable fields `.map()` block in the Drawer component (currently lines 316–332). Refactor it from a single array `.map()` to individually rendered groups so the sync button can be inserted after the image URL fields.

Replace the entire `.map()` block (from the array `{[` opening to `})}` closing) AND the save button that follows it:

```tsx
// BEFORE (lines ~316–339):
<div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
  {[
    { key: 'bannerTitle', label: 'Tiêu đề Banner' },
    { key: 'bannerSubtitle', label: 'Mô tả Banner' },
    { key: 'bannerImageUrl', label: 'URL ảnh Banner (Desktop)' },
    { key: 'mobileBannerImageUrl', label: 'URL ảnh Banner (Mobile)' },
    { key: 'coverImageUrl', label: 'URL ảnh đại diện bài viết' },
  ].map(({ key, label }) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <input
        type="text"
        value={(editFields as any)[key]}
        onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, [key]: e.target.value } : null)}
        className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
      />
    </div>
  ))}
  <button
    onClick={onSave}
    disabled={actionLoading !== null}
    className="w-full rounded-lg bg-blue-600/90 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition disabled:opacity-50"
  >
    {actionLoading?.startsWith('save-') ? 'Đang lưu...' : 'Lưu chỉnh sửa'}
  </button>
</div>
```
```tsx
// AFTER:
<div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
  {(['bannerTitle', 'bannerSubtitle'] as const).map((key) => {
    const labels: Record<string, string> = {
      bannerTitle: 'Tiêu đề Banner',
      bannerSubtitle: 'Mô tả Banner',
    }
    return (
      <div key={key}>
        <label className="block text-xs font-semibold text-slate-400 mb-1">{labels[key]}</label>
        <input
          type="text"
          value={(editFields as any)[key]}
          onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, [key]: e.target.value } : null)}
          className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
        />
      </div>
    )
  })}
  {(['bannerImageUrl', 'mobileBannerImageUrl', 'coverImageUrl'] as const).map((key) => {
    const labels: Record<string, string> = {
      bannerImageUrl: 'URL ảnh Banner (Desktop)',
      mobileBannerImageUrl: 'URL ảnh Banner (Mobile)',
      coverImageUrl: 'URL ảnh đại diện bài viết',
    }
    return (
      <div key={key}>
        <label className="block text-xs font-semibold text-slate-400 mb-1">{labels[key]}</label>
        <input
          type="text"
          value={(editFields as any)[key]}
          onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, [key]: e.target.value } : null)}
          className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
        />
      </div>
    )
  })}
  <button
    type="button"
    onClick={() => setEditFields((prev: any) => prev ? {
      ...prev,
      coverImageUrl: prev.bannerImageUrl
    } : null)}
    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-slate-800/50 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 transition w-full justify-center"
  >
    ↕ Đồng bộ: dùng URL Banner làm Thumbnail bài viết
  </button>
  <button
    onClick={onSave}
    disabled={actionLoading !== null}
    className="w-full rounded-lg bg-blue-600/90 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition disabled:opacity-50"
  >
    {actionLoading?.startsWith('save-') ? 'Đang lưu...' : 'Lưu chỉnh sửa'}
  </button>
</div>
```

**6c — Add delete proposal button in drawer footer**

- [ ] **6.3** In the Drawer footer (currently lines 434–481), add the delete button after the enrich-content `</button>` closing tag (line ~480) and before the footer's closing `</div>`:

```tsx
{proposal.status !== 'applied' && (
  <button
    onClick={() => {
      if (confirm(`Xóa proposal "${proposal.id}"? Hành động này không thể hoàn tác.`)) {
        onAction('delete-proposal')
      }
    }}
    disabled={actionLoading !== null}
    className="w-full rounded-xl border border-rose-500/30 bg-rose-900/20 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/40 transition disabled:opacity-50"
  >
    🗑 Xóa proposal này
  </button>
)}
```

**6d — Update handleDrawerAction to close drawer on successful delete**

- [ ] **6.4** Update `handleDrawerAction` in `CampaignMktPage` (currently lines 583–586). Replace:

```typescript
// BEFORE:
const handleDrawerAction = (action: string) => {
  if (!selectedProposal) return
  apiAction(action, { proposalId: selectedProposal.id })
}
```
```typescript
// AFTER:
const handleDrawerAction = async (action: string) => {
  if (!selectedProposal) return
  const result = await apiAction(action, { proposalId: selectedProposal.id })
  if (action === 'delete-proposal' && result?.status === 'success') {
    setSelectedProposal(null)
  }
}
```

- [ ] **6.5** Run `npm run dev` locally and test all three changes:
  - Enrich button shows new label "🔄 Lấy nội dung mới nhất từ website" and loading text "⏳ Đang cập nhật..."
  - "↕ Đồng bộ" button copies `bannerImageUrl` value into `coverImageUrl` field immediately in the form
  - "🗑 Xóa proposal này" appears for all non-applied proposals; clicking triggers confirm dialog; on confirm the drawer closes and the proposal disappears from all sections
- [ ] **6.6** Run `npm run build` and confirm zero TypeScript errors
- [ ] **6.7** Commit: `feat: image sync button, rename enrich button, add delete proposal button in drawer`

---

## Self-Review Checklist

### Spec Coverage Scan

| Requirement from spec | Covered by | Status |
|---|---|---|
| Remove dummy campaign entries from campaigns.ts | Task 1 | Covered |
| Delete 9 stale test proposal JSON files | Task 1 | Covered |
| Skip mockAnalytics when `--run-research` is passed | Task 2 | Covered |
| Skip manual publisherPromoSignals when `--run-research` is passed | Task 2 | Covered |
| Create `src/agent/campaignState.json` with `disabledCampaigns` array | Task 3 | Covered |
| `disableCampaign()` — mutates in-memory + persists to JSON | Task 3 | Covered |
| `isCampaignVisible` checks persisted disabled state | Task 3 | Covered |
| `getDisabledCampaigns()` export from campaigns.ts | Task 4 | Covered |
| GET `/api/campaign` returns `disabledCampaigns` array | Task 4 | Covered |
| POST `deactivate` action with campaignId guard | Task 4 | Covered |
| POST `delete-proposal` action with applied-status guard | Task 4 | Covered |
| `disabledCampaigns` useState in CampaignMktPage | Task 5 | Covered |
| fetchData populates `disabledCampaigns` from API response | Task 5 | Covered |
| "Tắt" button in live campaigns action cell | Task 5 | Covered |
| Section 4 "Đã tắt" collapsed by default | Task 5 | Covered |
| Rename enrich button label | Task 6 | Covered |
| Image sync button copies bannerImageUrl → coverImageUrl | Task 6 | Covered |
| Delete proposal button in drawer footer (non-applied only) | Task 6 | Covered |
| `handleDrawerAction` closes drawer after successful delete | Task 6 | Covered |

### Placeholder / TODO Scan

After implementation, search for these strings to confirm none remain as stubs:

```bash
grep -r "TODO\|FIXME\|PLACEHOLDER\|implement later" \
  src/data/campaigns.ts \
  pages/api/campaign/index.ts \
  app/game/campaign-mkt/page.tsx \
  scripts/generateWeeklyCampaignProposal.js
```

Expected: zero matches.

### Build Verification Checkpoints

Every TypeScript-touching task includes `npm run build` before committing:

| Task | Build step |
|---|---|
| Task 1 | Step 1.4 |
| Task 2 | Step 2.5 (Node syntax check, not tsc) |
| Task 3 | Step 3.6 |
| Task 4 | Step 4.8 |
| Task 5 | Step 5.6 |
| Task 6 | Step 6.6 |

### What is NOT in this plan (already done, per spec)

- `coverImageUrl` input field in drawer — already exists at `page.tsx` line 321
- `coverImageUrl` fallback in apply script — already at `scripts/applyApprovedCampaignProposal.js` line 382 (`proposal.coverImageUrl || proposal.bannerImageUrl`)
- `set-top-banner` API action with exclusivity logic via `setTopBanner()` — already implemented (API route lines 117–129)
- Top Banner card UI already showing active banner — already rendered
- Toggle button per running campaign — already exists at `page.tsx` lines 775–782

---

## Dependency Order

```
Task 1 (cleanup)
   └─ independent, run first

Task 2 (script fix)
   └─ independent, can run in parallel with Task 1

Task 3 (campaignState + disableCampaign)
   └─ must complete before Task 4

Task 4 (API actions)
   └─ depends on Task 3
   └─ must complete before Task 5

Task 5 (UI deactivate + Đã tắt section)
   └─ depends on Task 4

Task 6 (UI drawer improvements)
   └─ independent of Tasks 3–5, can run in parallel with Task 5
```

**Recommended execution order for a single agent:** 1 → 2 → 3 → 4 → 5 → 6

**Recommended execution for parallel agents:**
- Agent A: Tasks 1 → 3 → 4 → 5
- Agent B: Tasks 2 + 6 (both fully independent of the state/API chain)
