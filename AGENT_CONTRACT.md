# Agent Contract

This document defines the MVP contract for future agents or scheduled jobs that update NapTheVui content. Agents should edit structured data only. React components, helper functions, validation code, and pricing logic are not agent-editable.

## Files The Agent May Edit

### `src/data/campaigns.ts`

Allowed edit area:

- `campaigns` array only.

Allowed fields:

- `id`
- `title`
- `subtitle`
- `bannerImageUrl`
- `mobileBannerImageUrl`
- `altText`
- `targetPublisherId`
- `targetGameIds`
- `discountPercent`
- `discountText`
- `skuDiscounts`
- `ctaText`
- `articleId`
- `enabled`
- `priority`
- `validFrom`
- `validTo`
- `themeClassName`

Campaign discount contract:

- Campaign discount percent must come from `campaigns.ts` only.
- The agent may set `discountPercent`.
- The agent may define eligible SKUs or publishers through `skuDiscounts`.
- The agent must not calculate final sale prices.
- Banner discount copy, publisher badge, SKU badge, displayed sale price, and checkout discount amount are derived from the active validated campaign.

### `src/data/catalog.ts`

Allowed edit areas:

- `agentPopularSearchRecommendations`
- `analyticsPopularSearchRecommendations` only if the scheduled analytics pipeline owns it
- `cachedPopularSearchRecommendations` only if used as a generated cache

Allowed fields for popular recommendations:

- `id`
- `targetId`
- `targetType`
- `label`
- `iconUrl`
- `priority`
- `aiScore`
- `searchCount`
- `clickCount`
- `purchaseCount`
- `campaignBoost`
- `manualBoost`
- `enabled`
- `source`
- `updatedAt`

Catalog maintenance fields, only for a dedicated catalog-maintenance job:

- `aliases`
- `topGames`
- `popularityScore`
- `genre`
- `isTrending`

Base SKU price contract:

- Base SKU price is `TopupSku.amount`.
- `amount` is catalog data and must not be changed by a campaign agent.
- Campaign discounts must never be stored as catalog sale prices.

### `src/data/newsArticles.ts`

Allowed edit area:

- `newsArticles` array only.

Allowed fields:

- `id`
- `title`
- `summary`
- `coverImageUrl`
- `content`
- `relatedCampaignId`
- `relatedPublisherId`
- `relatedGameIds`
- `publishedAt`
- `enabled`

Article contract:

- Article IDs should stay stable after publication.
- `relatedCampaignId` should match a real campaign ID when the article is campaign-linked.
- `relatedPublisherId` and `relatedGameIds` should match catalog IDs.

## Files The Agent Must Not Edit

Agents must not edit:

- `app/**`
- `components/**`
- `src/data/discounts.ts`
- validation/helper functions in `src/data/campaigns.ts`
- selector/helper functions in `src/data/catalog.ts`
- fallback arrays, unless a human explicitly promotes new safe defaults
- `tailwind.config.js`
- `next.config.js`
- `package.json`
- build output folders such as `.next`, `next-local`, and `next-local-v2`

Important helper ownership:

- `src/data/discounts.ts` is a derived helper layer.
- It computes publisher badges, SKU badges, sale price, and checkout discount amount from campaign data.
- Agents must not put independent discount or pricing logic there.

## Validation Rules

Campaign validation is system/schema validation, not human approval.

Current campaign rules:

- `targetPublisherId` must reference an existing publisher or store in `catalog.ts`.
- `targetGameIds` must reference existing game IDs in `catalog.ts`.
- `discountPercent`, when present, must be a positive number below `100`.
- `discountText`, when present with `discountPercent`, must contain the same percent value.
- Each `skuDiscounts` item must reference either:
  - a real `skuId`, or
  - a real `publisherId`.
- Each SKU discount must resolve to a valid positive discount percent.
- If both campaign-level and SKU-level discount percents are present, they must match.

Popular search validation behavior:

- Disabled items are ignored.
- Recommendations with invalid `targetId` are ignored.
- Recommendations with mismatched `targetType` are ignored.
- Duplicate targets are de-duplicated.
- Items are ranked by priority first, then score signals.

Catalog validation expectations:

- IDs should be stable.
- Games that use `publisherId` must reference a real publisher or store.
- SKU `publisherId` should reference a real publisher/store or the explicit `default` fallback.
- `TopupSku.amount` is the base price and should be positive.

News validation expectations:

- `publishedAt` should be an ISO date string.
- Linked campaign, publisher, and game IDs should exist.
- Disabled articles should not render in article lists.

## Fallback Behavior

Campaign fallback order:

1. Use valid active entries from `campaigns`.
2. If editable campaign data is invalid or no valid active campaign exists, use `lastKnownValidCampaigns`.
3. If that is unavailable, use `fallbackCampaigns`.

Discount fallback:

- If the active campaign has no valid discount percent, no campaign discount is shown.
- If a SKU is not eligible for the active campaign discount, its sale price is its base `amount`.
- Publisher badge appears only when that publisher has at least one eligible SKU in the active campaign.
- SKU badge appears only when that SKU is eligible.

Popular search fallback order:

1. Enabled `agent` recommendations.
2. Enabled `analytics` recommendations.
3. Cached recommendations.
4. `fallbackPopularSearchRecommendations`.

News fallback:

- Only enabled articles render.
- Missing campaign-linked articles should not break the banner or checkout page.

## Source Of Truth Summary

| Field | Source of truth |
| --- | --- |
| Base SKU price | `src/data/catalog.ts` -> `TopupSku.amount` |
| Campaign discount percent | `src/data/campaigns.ts` -> `Campaign.discountPercent` |
| Publisher badge | Derived from active campaign in `src/data/discounts.ts` |
| SKU badge | Derived from active campaign and eligible SKU/publisher rules |
| Displayed sale price | Computed by `getEffectiveSku(campaign, sku)` |
| Checkout discount amount | Computed by `getEffectiveSku(campaign, sku)` |
| Popular search chips | `src/data/catalog.ts` recommendation arrays |
| News content | `src/data/newsArticles.ts` |

## Agent Output Requirements

Before writing data, an agent should:

- Keep IDs stable.
- Prefer flat records over nested objects.
- Update only the allowed arrays and fields.
- Preserve fallback data.
- Avoid changing helper functions or UI components.
- Produce data that passes validation without human approval.

After writing data, the system should:

- Run validation selectors.
- Use previous valid data or fallback defaults when validation fails.
- Render without requiring React component changes.
