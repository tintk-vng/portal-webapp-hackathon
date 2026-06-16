# Game Page — 4 Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix four reported bugs on the `/game` (`/mua-the-game`) page — denomination card UI for Garena, news banner redirect, top banner image on mobile, and responsive header bar.

**Architecture:** Each fix is isolated. Tasks 1–3 touch individual components in `app/game/_components/`. Task 4 (header) requires fetching napthevui.vn as a design reference then updating `app/game/_components/layout/Header.tsx`.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, TypeScript strict, `next/image`, `next/link`, react-hook-form

---

## File Map

| File | Task | Change |
|---|---|---|
| `app/game/_components/packages/GamePackage.tsx` | Task 1 | Simplify denomination card to single-price row |
| `app/game/_components/packages/index.tsx` | Task 1 (minor) | Header text update ("Chọn mệnh giá & số lượng" → conditional) |
| `app/game/blog/page.tsx` | Task 2 | Verify/fix slug parsing + missing article IDs |
| `src/data/newsArticles.ts` | Task 2 | Add missing articles for active campaigns |
| `app/game/_components/banner-slot/BannerSlot.tsx` | Task 3 | Show image on mobile using `mobileBannerImageUrl` |
| `next.config.js` | Task 3 | Add missing image domains if needed |
| `app/game/_components/layout/Header.tsx` | Task 4 | Responsive header matching napthevui.vn |

---

## Task 1: Fix Garena Denomination Card UI

**Root cause:** `GamePackage.tsx` always renders a 2-row layout (crossed-out original price + dashed HR + "Giá bán:" row) even when there is no campaign discount. The fixed `h-[60px]` card is too short for this 2-row layout when discount IS active. Compare with GooglePlay or any publisher without an active campaign — they show a clean single price.

**Fix:** Replace the always-visible HR + "Giá bán:" row with a compact layout: one price line (the effective sale price), optional small struck-through original price when discounted. Keep the ribbon badge (`-5%`) to communicate the discount.

**Files:**
- Modify: `app/game/_components/packages/GamePackage.tsx`

- [ ] **Step 1.1: Read the current file to capture exact content**

  ```bash
  cat app/game/_components/packages/GamePackage.tsx
  ```

- [ ] **Step 1.2: Replace GamePackage with a clean single-price layout**

  Open `app/game/_components/packages/GamePackage.tsx` and replace the entire inner content block (lines 31–91) with the following. The container stays `h-[60px]` but the internal layout becomes one vertical column instead of a 2-row split:

  ```tsx
  import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
  import { PackageStatus } from '@/constants/telco'
  import { DataPackage } from '@/types/telco'
  import commonUtil from '@/utils/common'
  import classNames from 'classnames'
  import { Campaign } from '@/src/data/campaigns'
  import { getEffectiveSku } from '@/src/data/discounts'
  import { TopupSku } from '@/src/data/catalog'

  interface GamePackageProps {
    dataPackage: DataPackage
    selectedPackage: DataPackage | undefined
    campaign: Campaign
  }

  export default function GamePackage({ dataPackage, selectedPackage, campaign }: GamePackageProps) {
    const { amount, originalAmount, status, badgeText } = dataPackage
    const isMaintained = status === PackageStatus.MAINTENANCE
    const isSelected = amount === selectedPackage?.amount
    const tempSku: TopupSku = {
      id: `${dataPackage.telcoCode.toLowerCase()}-${dataPackage.originalAmount || dataPackage.amount}`,
      publisherId: dataPackage.telcoCode.toLowerCase(),
      amount: dataPackage.originalAmount || dataPackage.amount,
      displayAmount: `${(dataPackage.originalAmount || dataPackage.amount) / 1000}.000đ`,
    }
    const effectiveSku = getEffectiveSku(campaign, tempSku)
    const hasCampaignDiscount = (effectiveSku.discountPercent ?? 0) > 0
    const displayedSalePrice = hasCampaignDiscount ? effectiveSku.salePrice : dataPackage.amount
    const displayedOriginalPrice = hasCampaignDiscount
      ? effectiveSku.basePrice
      : dataPackage.originalAmount || dataPackage.amount

    return (
      <div
        className={classNames({
          'group relative flex h-[60px] w-full flex-col items-center justify-center gap-0.5 rounded-lg border p-2 transition md:h-16':
            true,
          'cursor-pointer md:hover:border-blue-500': !isMaintained,
          'cursor-not-allowed border-dark-50 bg-dark-25 md:hover:border-dark-50': isMaintained,
          'border-dark-50 md:hover:scale-105': !isSelected,
          'border-blue-500': isSelected,
        })}
      >
        {hasCampaignDiscount && (
          <span
            className={classNames({
              'text-center text-label-xs line-through': true,
              'cursor-pointer text-dark-300': !isMaintained,
              'cursor-not-allowed text-dark-200': isMaintained,
            })}
          >
            {commonUtil.formatCurrency(displayedOriginalPrice)}
          </span>
        )}

        <label
          className={classNames({
            'text-center font-bold': true,
            'text-label-md': hasCampaignDiscount,
            'text-label-lg': !hasCampaignDiscount,
            'cursor-pointer md:group-hover:text-blue-500': !isMaintained,
            'cursor-not-allowed text-dark-200': isMaintained,
            'text-blue-500': isSelected && !isMaintained,
          })}
        >
          {commonUtil.formatCurrency(displayedSalePrice)}
        </label>

        {isMaintained && (
          <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Neutral}>
            Bảo trì
          </Badge>
        )}

        {status === PackageStatus.ACTIVE && (badgeText || hasCampaignDiscount) && (
          <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Negative}>
            {hasCampaignDiscount ? `-${effectiveSku.discountPercent}%` : badgeText}
          </Badge>
        )}
      </div>
    )
  }
  ```

- [ ] **Step 1.3: Run lint and type-check**

  ```bash
  cd portal-webapp-frontend-active
  npm run lint -- --max-warnings 0 app/game/_components/packages/GamePackage.tsx
  npx tsc --noEmit --pretty false 2>&1 | head -30
  ```

  Expected: no errors on the modified file.

- [ ] **Step 1.4: Manually verify in browser**

  Navigate to `http://localhost:8080/mua-the-game`, select Garena. Each denomination card should show:
  - With active campaign (5% discount): small struck-through original price + larger sale price + `-5%` badge
  - With no campaign: single clean price, no horizontal separator, no "Giá bán:" label

- [ ] **Step 1.5: Commit**

  ```bash
  git add app/game/_components/packages/GamePackage.tsx
  git commit -m "fix: simplify game denomination card to single-price layout"
  ```

---

## Task 2: Investigate and Fix News Banner Redirect

**Root cause analysis:**
1. `NewsCards.tsx` generates links `/mua-the-game/tin-tuc?slug=${article.id}-0`
2. `BannerSlot.tsx` generates links `/mua-the-game/tin-tuc?slug=${campaign.articleId}-0`
3. Rewrite `/mua-the-game/tin-tuc` → `/game/blog` is configured correctly in `next.config.js`
4. `blog/page.tsx` parses the slug: strips `-0` suffix, looks up `getArticleById(cleanId)`

**Most likely issue:** The active campaign `weekly-garena-2026-06-16-4` has `articleId: "weekly-garena-2026-06-16-4"` but `newsArticles.ts` may not have an article with that exact ID — in which case clicking the top banner shows EmptyState on the blog page.

**Secondary possible issue:** `extractBlogID` regex `/-(\d+)$/` on slug `weekly-garena-2026-06-16-4` extracts `4` (the trailing number), then calls `blogAPI.getBlogByID(4)` which likely fails. The catch fallback calls `getArticleById('weekly-garena-2026-06-16')` (strips `-4`), which also likely doesn't exist → EmptyState.

**Files:**
- Modify: `src/data/newsArticles.ts` (add missing articles)
- Possibly modify: `app/game/blog/page.tsx` (fix slug parsing edge case)

- [ ] **Step 2.1: Check which article IDs are missing**

  Run a quick Node snippet to cross-check:

  ```bash
  node -e "
  const { newsArticles } = require('./src/data/newsArticles');
  const { campaigns } = require('./src/data/campaigns');
  const enabledCampaigns = campaigns.filter(c => c.enabled && c.articleId);
  console.log('Campaigns with articleId:', enabledCampaigns.map(c => c.articleId));
  const articleIds = newsArticles.map(a => a.id);
  console.log('Missing articles:', enabledCampaigns.filter(c => !articleIds.includes(c.articleId)).map(c => c.articleId));
  "
  ```

  Expected output will list any `articleId` in enabled campaigns that has no matching article.

- [ ] **Step 2.2: Fix slug parsing edge case in blog/page.tsx**

  The current `extractBlogID` regex `/-(\d+)$/` matches the LAST numeric segment of any ID that ends in a number (e.g. `weekly-garena-2026-06-16-4` → `4`, `garena-free-fire-week-0` → `0`). When this numeric ID is `0`, the falsy check `!blogID` works correctly. But when it's a non-zero number like `4`, the code tries to call `blogAPI.getBlogByID(4)` which fails, then strips `-4` to get `weekly-garena-2026-06-16` — which is WRONG (should be `weekly-garena-2026-06-16-4`).

  The URL format used is `slug = articleId + '-0'` (explicitly appending `-0`). So the ONLY numeric suffix ever used is `-0`. Change the slug parsing to ALWAYS strip the `-0` suffix:

  Open `app/game/blog/page.tsx` and replace:

  ```tsx
  const extractBlogID = (slug: string): number | null => {
    const match = slug.match(/-(\d+)$/)
    return match ? parseInt(match[1], 10) : null
  }
  ```

  With a simpler approach that respects the `-0` convention:

  ```tsx
  function extractNumericBlogID(slug: string): number | null {
    const match = slug.match(/-(\d+)$/)
    if (!match) return null
    const n = parseInt(match[1], 10)
    return n > 0 ? n : null
  }

  function stripSuffix(slug: string): string {
    return slug.replace(/-\d+$/, '')
  }
  ```

  And update `fetchBlog` to use these:

  ```tsx
  async function fetchBlog() {
    const slug = commonUtil.getParameterByName('slug')
    if (!slug) {
      setIsLoading(false)
      return
    }

    try {
      const blogID = extractNumericBlogID(slug)
      if (!blogID) {
        // slug ends in -0 or has no numeric suffix → static article
        const cleanId = stripSuffix(slug)
        const staticArticle = getArticleById(cleanId)
        if (staticArticle) {
          setBlog(buildStaticBlog(slug, staticArticle))
          return
        }
        throw new Error(`No static article found for slug: ${cleanId}`)
      }

      const data = await blogAPI.getBlogByID(blogID)
      setBlog(data)
    } catch (error) {
      console.error('Failed to fetch blog:', error)
      const cleanId = stripSuffix(slug)
      const staticArticle = getArticleById(cleanId)
      if (staticArticle) {
        setBlog(buildStaticBlog(slug, staticArticle))
      }
    } finally {
      setIsLoading(false)
    }
  }
  ```

  Full file after changes:

  ```tsx
  'use client'

  import blogAPI from '@/api-client/common/blog'
  import ErrorBoundary from '@/components/layout/error-boundary'
  import commonUtil from '@/utils/common'
  import { useEffect, useState } from 'react'
  import { getArticleById, NewsArticle } from '@/src/data/newsArticles'
  import Breadcrumb from '../_components/breadcrumb'
  import BlogContent from './_components/blog-content'
  import EmptyState from './_components/empty-state'
  import LoadingState from './_components/loading-state'

  function extractNumericBlogID(slug: string): number | null {
    const match = slug.match(/-(\d+)$/)
    if (!match) return null
    const n = parseInt(match[1], 10)
    return n > 0 ? n : null
  }

  function stripSuffix(slug: string): string {
    return slug.replace(/-\d+$/, '')
  }

  function buildStaticBlog(slug: string, article: NewsArticle): Blog {
    return {
      ID: 0,
      slug,
      title: article.title,
      description: article.summary,
      content: article.content,
      publishedAt: article.publishedAt,
      createdAt: article.publishedAt,
      updatedAt: article.publishedAt,
      publishTimer: article.publishedAt,
      avatar: article.coverImageUrl || '',
      author: 'Ban Biên Tập NapTheVui',
      thumbnail: {
        url: article.coverImageUrl || '',
        name: article.title,
      },
      tags: [],
      subCategory: {
        ID: 0,
        name: 'Tin tức',
        slug: 'tin-tuc',
      },
    }
  }

  export default function Page() {
    const [isLoading, setIsLoading] = useState(true)
    const [blog, setBlog] = useState<Blog | null>(null)

    useEffect(() => {
      async function fetchBlog() {
        const slug = commonUtil.getParameterByName('slug')
        if (!slug) {
          setIsLoading(false)
          return
        }

        try {
          const blogID = extractNumericBlogID(slug)
          if (!blogID) {
            const cleanId = stripSuffix(slug)
            const staticArticle = getArticleById(cleanId)
            if (staticArticle) {
              setBlog(buildStaticBlog(slug, staticArticle))
              return
            }
            throw new Error(`No static article found for slug: ${cleanId}`)
          }

          const data = await blogAPI.getBlogByID(blogID)
          setBlog(data)
        } catch (error) {
          console.error('Failed to fetch blog:', error)
          const cleanId = stripSuffix(slug)
          const staticArticle = getArticleById(cleanId)
          if (staticArticle) {
            setBlog(buildStaticBlog(slug, staticArticle))
          }
        } finally {
          setIsLoading(false)
        }
      }

      fetchBlog()
    }, [])

    if (isLoading) {
      return <LoadingState />
    }

    if (!blog) {
      return <EmptyState />
    }

    return (
      <ErrorBoundary>
        <Breadcrumb />
        <BlogContent blog={blog} />
      </ErrorBoundary>
    )
  }
  ```

- [ ] **Step 2.3: Add missing articles to newsArticles.ts for active campaigns**

  Based on the output of Step 2.1, add stub articles for any `articleId` in enabled campaigns that has no corresponding `newsArticles` entry. Example — if `weekly-garena-2026-06-16-4` is missing, add:

  ```ts
  {
    id: 'weekly-garena-2026-06-16-4',
    title: 'Ưu đãi nạp Garena trong tuần (16/06)',
    summary: 'Giảm 5% cho Free Fire, Liên Quân Mobile trên NapTheVui.',
    coverImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png',
    content: 'Chương trình ưu đãi nạp thẻ Garena tuần này. Áp dụng cho Free Fire, Liên Quân Mobile, FC Online, Liên Minh Huyền Thoại với mức giảm 5%.',
    relatedCampaignId: 'weekly-garena-2026-06-16-4',
    relatedPublisherId: 'garena',
    relatedGameIds: ['free-fire', 'lien-quan-mobile', 'fc-online', 'lien-minh-huyen-thoai'],
    publishedAt: '2026-06-16T08:00:00+07:00',
    enabled: true,
  },
  ```

  Add one entry for each ID listed in the Step 2.1 output.

- [ ] **Step 2.4: Run lint and type-check**

  ```bash
  npm run lint -- app/game/blog/page.tsx src/data/newsArticles.ts
  npx tsc --noEmit --pretty false 2>&1 | head -30
  ```

- [ ] **Step 2.5: Verify in browser**

  1. Start dev server: `npm run dev`
  2. Navigate to `http://localhost:8080/mua-the-game`
  3. Click any news card → should navigate to `/mua-the-game/tin-tuc?slug=...` and display the article content (not EmptyState)
  4. Click the top banner (if it has a CTA that links to an article) → same check

- [ ] **Step 2.6: Commit**

  ```bash
  git add app/game/blog/page.tsx src/data/newsArticles.ts
  git commit -m "fix: correct slug parsing for news articles and add missing campaign articles"
  ```

---

## Task 3: Fix Top Banner Image Display

**Root cause:** `BannerSlot.tsx` wraps the image in `<div className="hidden h-20 w-28 ... sm:flex ...">`. On screens narrower than 640px (`sm`), `display: none` is applied and the image is invisible. The `Campaign` type has a `mobileBannerImageUrl` field that is never used.

**Fix:** Show the image on mobile too — as a small thumbnail using `mobileBannerImageUrl` (fallback: `bannerImageUrl`). Use the same `sm:flex` container but replace `hidden` with `flex` on all screen sizes, reducing size on mobile.

Also add any missing `remotePatterns` entries if campaign bannerImageUrls use external domains not in `next.config.js`.

**Files:**
- Modify: `app/game/_components/banner-slot/BannerSlot.tsx`
- Possibly modify: `next.config.js`

- [ ] **Step 3.1: Audit image domains used in campaigns**

  ```bash
  node -e "
  const { campaigns } = require('./src/data/campaigns');
  const urls = campaigns.flatMap(c => [c.bannerImageUrl, c.mobileBannerImageUrl].filter(Boolean));
  const domains = [...new Set(urls.map(u => new URL(u).hostname))];
  console.log('Image domains:', domains);
  "
  ```

  Compare against the `remotePatterns` in `next.config.js`. Any domain not listed needs to be added.

- [ ] **Step 3.2: Add missing domains to next.config.js remotePatterns (if any)**

  If the previous step shows domains like `images.unsplash.com` missing, add them:

  Open `next.config.js` and add to the `remotePatterns` array inside `images`:

  ```js
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  ```

  Add one entry per missing domain. Restart the dev server after this change.

- [ ] **Step 3.3: Update BannerSlot to show image on mobile**

  Open `app/game/_components/banner-slot/BannerSlot.tsx` and replace the image container div:

  **Before:**
  ```tsx
  <div className="hidden h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-white-500/95 p-4 shadow-soft sm:flex md:h-24 md:w-32 relative">
    <Image
      className="max-h-full max-w-full object-contain"
      src={campaign.bannerImageUrl}
      alt={campaign.altText}
      fill
      sizes="(max-width: 768px) 100px, 120px"
      loader={({ src }) => src}
      unoptimized
    />
  </div>
  ```

  **After:**
  ```tsx
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
  ```

  Key changes:
  - `hidden sm:flex` → `flex` (always visible)
  - Added responsive sizing: `h-16 w-20` on mobile, `sm:h-20 sm:w-28` on sm, `md:h-24 md:w-32` on md
  - `src` uses `mobileBannerImageUrl` when available, falls back to `bannerImageUrl`
  - Moved `relative` inside the div's class list (it was already there, just reorganized)

- [ ] **Step 3.4: Run lint and type-check**

  ```bash
  npm run lint -- app/game/_components/banner-slot/BannerSlot.tsx
  npx tsc --noEmit --pretty false 2>&1 | head -30
  ```

- [ ] **Step 3.5: Verify in browser (mobile + desktop)**

  1. Open Chrome DevTools → toggle device toolbar to iPhone SE (375px)
  2. Navigate to `http://localhost:8080/mua-the-game`
  3. The campaign banner should show the image in the top-right corner even on mobile
  4. Switch back to desktop → image should still be present, slightly larger

- [ ] **Step 3.6: Commit**

  ```bash
  git add app/game/_components/banner-slot/BannerSlot.tsx next.config.js
  git commit -m "fix: show banner image on mobile using mobileBannerImageUrl"
  ```

---

## Task 4: Responsive Header Bar — Match napthevui.vn

**Context:** The current `Header.tsx` uses the ZaloPay logo and a custom 2-item nav. The user wants the header bar to match the responsive design of napthevui.vn. This task requires fetching napthevui.vn to extract its header structure, then replicating the responsive behavior in `Header.tsx`.

**Files:**
- Modify: `app/game/_components/layout/Header.tsx`

- [ ] **Step 4.1: Fetch and analyze napthevui.vn header**

  Use the browser (not the dev server) to open `https://napthevui.vn` and inspect the header element. Note:
  - Logo placement and size
  - Navigation items and their order
  - Mobile breakpoint behavior (hamburger menu vs inline nav)
  - Height on mobile vs desktop
  - Background color, shadow, border
  - Any sticky/fixed positioning behavior
  - Font sizes and spacing of nav links

  Key questions to answer before coding:
  - Does napthevui.vn use a hamburger on mobile? If yes, same as current implementation.
  - Does it show a different logo than the current ZaloPay SVG?
  - What nav items exist beyond "Nạp ngay" and "Tin tức"?

  Alternatively, if using Claude Code with WebFetch:
  ```bash
  # Fetch napthevui.vn and look at header HTML structure
  curl -s https://napthevui.vn | grep -A 50 '<header'
  ```

- [ ] **Step 4.2: Identify diffs between current Header.tsx and napthevui.vn**

  Current header issues to check (common responsive failures):
  1. Logo wrapping — on very narrow screens (< 375px), the logo + hamburger + right link might overflow
  2. Nav link font size on mobile — `text-label-xs` might be too small or "Web nạp thẻ\nrẻ, nhanh và uy tín" multiline text breaks layout
  3. Hamburger icon — uses `lnl-*` prefixed Tailwind classes (from `@dgs/looknlearn`) which may not render correctly with stub

  Check header height consistency: the current header uses `h-14` on mobile and `md:h-[72px]` on desktop. Confirm napthevui.vn uses the same heights.

- [ ] **Step 4.3: Fix identified responsive issues in Header.tsx**

  Based on the analysis in Steps 4.1 and 4.2, apply the minimum changes needed to match napthevui.vn. Likely fixes include:

  **Fix 1 — Right link overflow on mobile:**
  Current: `flex-1 cursor-pointer flex-col items-end whitespace-break-spaces text-right text-label-xs font-bold`
  → This creates a multi-line text block that can push the layout on narrow screens.

  Replace the right side link with a simpler single-line version on mobile:

  ```tsx
  <a
    href="https://napthevui.vn"
    rel="noopener noreferrer"
    target="_blank"
    className="flex items-center gap-1 text-label-sm font-bold text-blue-500 underline md:text-label-lg"
  >
    <span>napthevui.vn</span>
  </a>
  ```

  **Fix 2 — Logo size on mobile:**
  Current: `w-[105px]` on mobile. If napthevui.vn uses a smaller logo, change to `w-[90px] md:w-[124px]`.

  **Fix 3 — Nav spacing on mobile drawer:**
  Current: `space-y-4 px-4`. Ensure consistent padding on mobile drawer.

  > NOTE: After fetching napthevui.vn in Step 4.1, adjust these specific changes to match the actual design. The fixes above are the most common responsive issues found in the current code.

- [ ] **Step 4.4: Verify responsive behavior in browser**

  Test at these breakpoints in Chrome DevTools:
  - 320px (iPhone SE narrow)
  - 375px (iPhone SE standard)
  - 414px (iPhone XR)
  - 768px (iPad portrait, md breakpoint)
  - 1280px (desktop)

  At each breakpoint check:
  - [ ] Logo is fully visible, not clipped
  - [ ] Right link text fits in one line (or wraps cleanly without breaking layout)
  - [ ] Hamburger button visible on mobile, hidden on md+
  - [ ] Nav links visible inline on md+
  - [ ] No horizontal overflow (no scrollbar)

- [ ] **Step 4.5: Run lint and type-check**

  ```bash
  npm run lint -- app/game/_components/layout/Header.tsx
  npx tsc --noEmit --pretty false 2>&1 | head -30
  ```

- [ ] **Step 4.6: Commit**

  ```bash
  git add app/game/_components/layout/Header.tsx
  git commit -m "fix: responsive header bar matching napthevui.vn design"
  ```

---

## Post-Fix Smoke Test

After all 4 tasks are complete, run this checklist against `http://localhost:8080/mua-the-game`:

- [ ] Select Garena → denomination cards show clean single price with `-5%` badge (no "Giá bán:" row)
- [ ] Click any news card → navigates to article page, content visible (not EmptyState)
- [ ] Click top banner CTA → same article redirect behavior
- [ ] On mobile (375px): banner image visible in top-right corner of the campaign banner
- [ ] On mobile (375px): header bar has no overflow, logo + hamburger + right link all fit
- [ ] On desktop (1280px): all above still correct

## Self-Review

**Spec coverage check:**
1. ✅ Responsive header bar — Task 4
2. ✅ News banner redirect — Task 2
3. ✅ Top banner image from campaign system — Task 3
4. ✅ Garena denomination & quantity card UI — Task 1

**Placeholder scan:**
- Step 4.3 says "adjust based on actual napthevui.vn design" — this is intentional: the specific pixel values depend on the reference fetched in Step 4.1. The 3 example fixes provided are concrete starting points.
- No TBD or TODO markers in code blocks.

**Type consistency:**
- `extractBlogID` is renamed to `extractNumericBlogID` throughout Task 2 — consistent.
- `stripSuffix` is defined and used in the same function block — consistent.
- `mobileBannerImageUrl` is already typed as `string | undefined` in the `Campaign` type — the `??` fallback is type-safe.
