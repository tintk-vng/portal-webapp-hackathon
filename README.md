# Utilities Portal Webapp

**Version:** 3.7.0  
**Framework:** Next.js 14.2.35 with React 18.2.0

A [Next.js](https://nextjs.org/) project for utility services

---

## Getting Started

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run analyze  # Bundle analyzer
```

Open [localhost:8080](localhost:8080) to view the app.

---

## Team setup (chạy trên máy cá nhân)

```bash
./setup.sh        # tự dựng môi trường (tự nhận VPN; không VPN → dùng stub offline)
npm run dev       # → http://localhost:8080/telco/topup
```

- **Có VPN VNG**: đặt `export VERDACCIO_ZTOOL_TOKEN=<token>` trước khi chạy `setup.sh` để dùng package `@dgs/looknlearn` thật.
- **Không VPN**: `setup.sh` dùng stub trong `stubs/looknlearn/`; telco/bill vẫn chạy LIVE data (proxy API trong `next.config.js`).
- Chi tiết kiến trúc, quy ước, gotchas: xem [`CLAUDE.md`](CLAUDE.md) (tự load khi mở repo bằng Claude Code).

### Deploy ngoài mạng nội bộ

```bash
docker build -f Dockerfile.local -t portal-webapp:local .
docker run -p 8080:8080 portal-webapp:local
```

> `Dockerfile` (bản gốc) build trên hạ tầng VNG (registry nội bộ + rsync CDN). Dùng `Dockerfile.local` khi build/deploy bên ngoài.

---

## Project Structure

### Root Level

```
.
├── api-client/        # API modules (axios-based)
├── components/        # Shared UI components
├── constants/         # Shared constants
├── hooks/             # Shared React hooks
├── models/            # Data models for API formatting
├── public/            # Static assets (images, icons)
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
├── utils/             # Shared utility functions
└── app/               # Next.js App Router
```

### App Directory Structure

```
app/
├── (static)/                    # Static pages
│   ├── about/
│   ├── faq/
│   ├── policy/
│   ├── privacy/
│   ├── refund-policy/
│   ├── terms/
│   └── layout.tsx
│
├── bill/
│
├── telco/
│   ├── _components/             # Private: Shared Telco components
│   ├── combo/
│   ├── data-code/
│   ├── data-topup/
│   ├── google-play/
│   ├── phone-card/
│   ├── post-paid/
│   ├── topup/
│   │   ├── _components/         # Private: Topup components
│   │   └── _hooks/              # Private: Topup hooks
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── layout.tsx
│
├── game/
│   ├── _components/             # Private: Game components
│   │   ├── layout/
│   │   ├── main/
│   │   ├── blog-card/
│   │   ├── packages/
│   │   ├── suppliers/
│   │   └── ...
│   ├── _hooks/                  # Private: Game hooks
│   ├── blogs/
│   │   ├── [slug]/              # Dynamic: Blog details page
│   │   └── page.tsx             # Blog list page
│   ├── transactions/            # Game's result page
│   ├── layout.tsx
│   └── page.tsx
│
├── transactions/                # Result page
│
├── layout.tsx                   # Root layout
├── page.tsx
└── globals.css
```

---

## Next.js App Router Conventions

### Folder Naming

| Convention  | Purpose                                          | Example                   |
| ----------- | ------------------------------------------------ | ------------------------- |
| `_folder/`  | **Private folder** - excluded from routing       | `_components/`, `_hooks/` |
| `(folder)/` | **Route group** - organize without affecting URL | `(main)/`, `(static)/`    |
| `[folder]/` | **Dynamic segment** - captures URL params        | `[slug]/`, `[code]/`      |

### Domain Structure Pattern

```
domain/
├── _components/         # Private: Domain-specific components
├── _hooks/              # Private: Domain-specific hooks
├── layout.tsx           # Domain layout
└── page.tsx             # Domain entry point
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form
- **Data Fetching:** SWR, Axios
- **Styling:** Tailwind CSS, SCSS Modules

---

## AI Agents & Data Layer

This project ships a **structured static data layer** designed for AI agents to safely update content (campaigns, catalog, news) without touching React components or pricing logic. The full rulebook lives in [`AGENT_CONTRACT.md`](AGENT_CONTRACT.md).

### Agent-Editable Data (`src/data/`)

| File | Purpose | Agent may edit |
| --- | --- | --- |
| `campaigns.ts` | Promotional campaign definitions, banner targets, discount percentages | `campaigns` array only |
| `catalog.ts` | Game items, SKU configs, popular search recommendations | `agentPopularSearchRecommendations`, `analyticsPopularSearchRecommendations`, `cachedPopularSearchRecommendations` |
| `newsArticles.ts` | Game articles, top-up guides, campaign details | `newsArticles` array only |
| `discounts.ts` | Derived pricing & badge helpers | **Read-only** — human-owned |

### Contract Rules

- **Edit data, not code.** Agents must not touch `app/**`, `components/**`, helper/selector functions, `discounts.ts`, or config files (`next.config.js`, `tailwind.config.js`, `package.json`).
- **Single source of truth for price.** Base SKU price is `catalog.ts → TopupSku.amount` and must never be overwritten. Discounts are declared as `discountPercent` in `campaigns.ts`; final sale prices are **computed** by `getEffectiveSku()`, never stored.
- **Referential integrity.** `targetPublisherId`, `targetGameIds`, and an article's `relatedCampaignId` must reference IDs that already exist in `catalog.ts` / `campaigns.ts`.
- **Validation bounds.** `discountPercent` must be a positive number `< 100`; when `discountText` is present it must contain the same percent value.
- **Fallback chain.** Rendering falls back through valid active campaigns → `lastKnownValidCampaigns` → `fallbackCampaigns`, so a bad agent edit degrades gracefully instead of breaking the UI.

### Content-Editing Agent (GreenNode AgentBase)

Content updates are driven by a companion agent (`portal-webapp-editor`) deployed on **GreenNode AgentBase**: it receives a change request, pulls this repo, uses an LLM to edit the data files above within the contract, then commits and opens a merge request. Local edits via Claude Code follow the same contract — `CLAUDE.md` is auto-loaded and requires the Superpowers skills in `.skills/` to be applied before any change.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)
