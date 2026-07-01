# NapTheVui Portal Webapp — Handover cho Dev Team

> Tài liệu bàn giao dự án **NapTheVui** (ZaloPay Utilities Portal — telco / bill / game) và hệ thống **Campaign console (agent-driven)**.
> Repo: **https://github.com/tintk-vng/portal-webapp-hackathon**
>
> **Tài liệu kèm theo** (cùng thư mục, giữ local — chưa commit):
> - `PATCH-campaign-sync.md` — patch fix bug campaign không sync (áp trên branch `master`).
> - `RUNBOOK-greennode-deploy.md` — hướng dẫn build & deploy lên GreenNode để demo/thuyết trình.

---

## 0. TL;DR

- Dự án là bản hackathon của **NapTheVui** — trang nạp thẻ game/telco của ZaloPay, dựng trên **Next.js 14 (App Router)**.
- Điểm khác biệt chính so với portal gốc: một **hệ thống Campaign do AI agent điều khiển** (scan → duyệt → apply → đưa lên top banner + bài Tin Tức), với một **data layer tĩnh** trong `src/data/` mà agent được phép chỉnh sửa theo `AGENT_CONTRACT.md`.
- Hackathon đang chạy trên **GreenNode AgentBase** (agent chỉnh repo: `portal-webapp-editor`, dùng LLM của GreenNode).
- **Mục tiêu bàn giao**: đưa dự án về chuẩn ZaloPay production — RBAC admintool telco, thay LLM, deploy sandbox, testing, lên production. Chi tiết ở [Mục 5](#5-roadmap-bàn-giao-7-hạng-mục).

---

## 1. Repository & Môi trường

| | |
|---|---|
| **GitHub** | `https://github.com/tintk-vng/portal-webapp-hackathon` |
| **Branch quan trọng** | `main` = **baseline gốc, KHÔNG có hệ thống campaign** (thư mục `portal-webapp-clean-baseline` là bản này). `master`, `feature/news-article-redesign`, `fix/game-page-bugs-2026-06-16` = **có hệ thống campaign** (`src/`, `pages/api/campaign`, `scripts/`, `src/agent/`). `docs/readme-agent-section` = PR #5 (README). |
| **⚠️ Lưu ý** | Muốn xem/làm việc với code campaign phải checkout branch **`master`** (hoặc feature branch), KHÔNG phải `main`. |
| **Stack** | Next.js 14.2.35, React 18, TypeScript, Tailwind CSS, Zustand, SWR + Axios |
| **Dev port** | 8080 (`npm run dev` → `APP_ENV=local next dev -p 8080`) |
| **Agent repo (tách riêng)** | `portal-webapp-editor` — GreenNode AgentBase agent chỉnh sửa repo bằng LLM |

### Chạy local
```bash
./setup.sh        # tự nhận VPN; không VPN → dùng stub offline @dgs/looknlearn
npm run dev       # → http://localhost:8080/telco/topup  (trang / cố tình để trống)
```
- **Có VPN VNG**: `export VERDACCIO_ZTOOL_TOKEN=<token>` trước khi `setup.sh` để lấy `@dgs/looknlearn` thật (Header/Footer).
- **Không VPN**: dùng stub `stubs/looknlearn/`; telco/bill vẫn LIVE data (proxy trong `next.config.js`); riêng game blog (`cms.zalopay.vn`) & header/footer thật sẽ không có.
- Chi tiết kiến trúc/gotchas: **`CLAUDE.md`**.

### Build & Deploy hiện tại
```bash
npm run build                 # APP_ENV=production next build
docker build -f Dockerfile.local -t portal-webapp:local .   # build ngoài mạng VNG
docker run -p 8080:8080 portal-webapp:local
```
> `Dockerfile` (bản gốc) build trên hạ tầng VNG (registry nội bộ + rsync CDN). Dùng `Dockerfile.local` khi build ngoài.

---

## 2. Tổng quan sản phẩm

NapTheVui gồm 3 domain chính dưới App Router (`app/`):
- **`telco/`** — nạp điện thoại, thẻ cào, data, google-play, post-paid, combo (LIVE qua payment-aggregator API).
- **`bill/`** — thanh toán hoá đơn.
- **`game/`** — nạp game + khu **Tin Tức / blog** khuyến mãi. Đây là nơi campaign hiển thị.

Điểm nhấn hackathon: **AI agent tự đề xuất & áp dụng campaign khuyến mãi** cho khu game, thay vì hard-code. Có alias tiếng Việt qua `rewrites` (`/nap-dien-thoai`, `/mua-the-game`, …).

---

## 3. Kiến trúc quan trọng cần nắm

### 3.1 Data layer "agent-editable" (`src/data/`)
| File | Nội dung | Agent được sửa? |
|---|---|---|
| `campaigns.ts` | Định nghĩa campaign, banner target, % giảm giá | ✅ (mảng `campaigns`) |
| `catalog.ts` | Game/SKU, popular search recommendations | ✅ (các field recommendation) |
| `newsArticles.ts` | Bài Tin Tức gắn với campaign | ✅ (mảng `newsArticles`) |
| `discounts.ts` | Helper tính giá/badge | ❌ read-only |
| `campaignState.ts` + `src/agent/campaignState.json` | Trạng thái runtime: `disabledCampaigns`, `topBannerCampaignId` | state file |

Luật đầy đủ: **`AGENT_CONTRACT.md`**. Nguyên tắc cốt lõi:
- Giá gốc = `catalog.ts → TopupSku.amount` (bất biến). Campaign chỉ khai `discountPercent`; giá sale được **tính** bởi `getEffectiveSku()`, không lưu.
- Tham chiếu (targetPublisherId / targetGameIds / relatedCampaignId) phải trỏ tới id có thật.
- `discountPercent` là số dương < 100.
- Fallback chain: campaign hợp lệ → `lastKnownValidCampaigns` → `fallbackCampaigns`.

### 3.2 Campaign console (backend API)
- **`pages/api/campaign/index.ts`** (Pages Router API) — action: `scan`, `acknowledge`, `approve`, `reject`, `apply`, `set-top-banner`, `set-proposal-top-banner`, `deactivate`, `update`, `enrich-content`, `delete-proposal`.
- **`src/agent/`** — proposals (JSON), inputs (promo signals, weekly brief), proposalRepository, types.
- **`scripts/`** — `generateWeeklyCampaignProposal.js`, `applyApprovedCampaignProposal.js`, `enrichArticleContent.js`, `researchPublisherPromos.js`, `runNextBuild.js`, `start-dev-detached.js`.

Luồng: `scan` (sinh proposal) → `approve` → `apply` (ghi campaign + article vào `src/data/*.ts`) → hiển thị trên `/game` (banner + Tin Tức).

### 3.3 Cách campaign hiển thị lên `/game`
- `app/game/page.tsx` là **`force-dynamic`** → render lại mỗi request.
- Banner: `getActiveCampaign()` (campaigns.ts). Tin Tức: `getEnabledArticles()` (newsArticles.ts) — chỉ hiện bài có `relatedCampaignId` trỏ tới campaign đang `enabled`.

### 3.4 Agent chỉnh repo (`portal-webapp-editor`, GreenNode AgentBase)
- Nhận yêu cầu → pull repo → LLM sửa `src/data/*.ts` trong khuôn khổ contract → commit / mở MR.
- LLM cấu hình qua env: `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` (đang trỏ GreenNode AIP: `https://maas-llm-aiplatform-hcm.api.vngcloud.vn/v1`). **← đây là chỗ cần đổi ở [hạng mục 5](#5-roadmap-bàn-giao-7-hạng-mục).**

---

## 4. Việc đã làm trong đợt engagement này

| # | Việc | Trạng thái |
|---|---|---|
| A | Thêm section **"AI Agents & Data Layer"** vào `README.md` | ✅ Đã push — **PR #5** trên repo hackathon |
| B | Điều tra & fix bug **campaign apply/top-banner không sync lên `/game`** (banner + Tin Tức) bằng **runtime overlay** | ✅ Đã áp vào branch **`fix/campaign-sync-overlay`** (nhánh từ `master`) và mở PR. Chi tiết kỹ thuật: **`PATCH-campaign-sync.md`**. |

### Chi tiết bug B (để dev re-apply)
- **Root cause**: server đang chạy không bao giờ reload module `campaigns`/`newsArticles` đã compile; khi apply, campaign/article mới được ghi vào `src/data/*.ts` nhưng process cũ không thấy → banner + Tin Tức không cập nhật. `applyApprovedCampaignProposal.js` còn chạy full `next build` chặn request + rollback khi lỗi.
- **Hướng fix (runtime overlay)**:
  1. Thêm `src/data/runtimeOverlay.ts` đọc `src/agent/appliedContent.json` (`{campaigns, articles}`) ở server, merge theo `id`.
  2. `getCampaignsFromSource()` (campaigns.ts) & `getEnabledArticles()` (newsArticles.ts) merge overlay lúc runtime.
  3. `applyApprovedCampaignProposal.js` ghi overlay sau khi validate; **bỏ** bước `next build` chặn request.
  → Hoạt động cả dev lẫn prod, không cần rebuild/restart. `.ts` vẫn giữ làm source-of-truth.
- Đã verify bằng cách load module qua TS require-hook và assert `getActiveCampaign()` / `getEnabledArticles()` phản ánh entry chỉ-có-trong-overlay. **Dev nên chuẩn hoá lại thành fix chính thức** (cân nhắc dùng DB/state store thay vì file JSON khi lên admintool — xem hạng mục 4).

---

## 5. Roadmap bàn giao (7 hạng mục)

> Đây là phạm vi công việc dev team cần thực hiện tiếp. Mỗi mục có **bối cảnh / hướng làm / rủi ro**.

### 5.1 Rà soát toàn bộ code changes so với source gốc
- **Việc**: dựng bảng diff giữa bản hackathon và portal gốc (`portal-webapp-clean-baseline` vs source production). Xác định phần thêm mới: `src/data/`, `src/agent/`, `pages/api/campaign/`, `scripts/`, các component game (`app/game/_components/*`), `AGENT_CONTRACT.md`.
- **Hướng**: `git log`/`git diff` theo branch; lập changelog; đánh dấu phần nào là "throwaway hackathon" vs "giữ lại".
- **Rủi ro**: một số file build tạm (`next-local*`, `next-build-temp`) lẫn trong repo — cần dọn/.gitignore.

### 5.2 Review + fix bug & refactor
- **Bug đã biết cần xử lý**:
  - Re-apply **fix campaign-sync** (mục 4B) — patch đầy đủ trong **`PATCH-campaign-sync.md`**, áp trên branch `master`.
  - `applyApprovedCampaignProposal.js` chạy full `next build` trong request → chậm/timeout/rollback. Bỏ (theo overlay) hoặc chuyển sang job nền.
  - `getValidActiveCampaigns()` trả `[]` nếu **bất kỳ** campaign nào invalid → nuke toàn bộ set về fallback. Cần validate & loại từng campaign thay vì all-or-nothing.
  - Vài proposal có `discountPercent` thiếu/invalid (vd `weekly-googleplay-2026-06-16`) → apply fail. Cần validate lúc scan/tạo proposal.
  - Nhiều campaign trong `campaigns.ts` để `isTopBanner: true` cùng lúc (chỉ nên 1) — nguồn sự thật là `campaignState.topBannerCampaignId`.
- **Refactor**: tách logic file-rewrite trong `scripts/` (đang parse `.ts` bằng string) sang cơ chế state store; chuẩn hoá error handling; thêm test cho data layer (hiện gần như chưa có).

### 5.3 Redesign frontend (nếu cần)
- Khu **game / Tin Tức / banner** là phần đáng đầu tư (đây là điểm demo). Đánh giá theo chuẩn design ZaloPay 2.0.
- Kiểm tra responsive (320/375/768/1024/1440), accessibility, reduced-motion. Banner slot + NewsCards nên đồng bộ design system.
- Lưu ý `app/game/blogs/page.tsx` hiện là **static** (không `force-dynamic`) → không phản ánh runtime; cân nhắc khi redesign.

### 5.4 Migrate Campaign console → Admintool telco (RBAC chuẩn ZaloPay) ⭐
- **Hiện trạng**: console campaign chỉ là API `pages/api/campaign` + thao tác file JSON/`.ts`, **không có auth/RBAC**, ghi trực tiếp lên filesystem của server.
- **Mục tiêu**: đưa toàn bộ luồng scan/approve/apply/top-banner vào **admintool telco** với phân quyền (maker/checker, role-based), audit log, và **lưu state ở DB** thay vì file JSON (`campaignState.json`/`appliedContent.json`) — file-based không an toàn khi scale nhiều instance.
- **Rủi ro/bảo mật**: API hiện `exec`/`execFile` script với input từ body → cần siết validation & bỏ thực thi lệnh tuỳ tiện; áp CSRF/rate-limit; không để ghi file production tại runtime.

### 5.5 Thay LLM API (bỏ GreenNode)
- **Chỗ cấu hình**: agent `portal-webapp-editor` — env `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` (đang là GreenNode AIP). Provider dạng OpenAI-compatible.
- **Việc**: trỏ sang LLM mới của ZaloPay/nội bộ (base URL + key + model). Kiểm tra rate-limit, cost, và prompt/tooling còn tương thích. Bỏ phụ thuộc IAM/service-account của GreenNode nếu không dùng nữa.

> Để deploy bản demo lên GreenNode (thuyết trình): xem **`RUNBOOK-greennode-deploy.md`**.

### 5.6 Đẩy lên Sandbox ZaloPay
- Build bằng `Dockerfile` (hạ tầng VNG: registry nội bộ + rsync CDN) — cần VPN/креds nội bộ.
- Cấu hình env sandbox (`.env.development`/staging), đổi API base sang `stg-payment-aggregator` khi test staging.
- CI/CD: theo quy trình trong `CLAUDE.md` (PR target `dev` → CI/CD Staging → Production).

### 5.7 Testing để lên Production
- **Đang thiếu test** cho data layer & campaign flow. Ưu tiên:
  - Unit: `getEffectiveSku`, validate campaign, overlay merge, `getEnabledArticles`.
  - Integration: các action của `pages/api/campaign`.
  - E2E (Playwright): scan → approve → apply → `/game` hiển thị banner + Tin Tức.
  - Visual regression + accessibility cho khu game.
- Chạy `npm run lint`, `npm run build`, `npm test` (coverage) trước khi lên prod.

---

## 6. Rủi ro & lưu ý bàn giao

- **State file-based** (`campaignState.json`, và overlay `appliedContent.json` nếu áp fix): không phù hợp multi-instance/production → cần DB.
- **Ghi file runtime + exec script** trong API campaign: rủi ro bảo mật, cần bỏ khi lên admintool.
- **Phụ thuộc GreenNode** (LLM + AgentBase) cần gỡ theo mục 5.5.
- **Blog/CMS** phụ thuộc `cms.zalopay.vn` (chỉ VPN).
- Repo có lẫn thư mục build tạm (`next-local*`, `next-build-temp`) — nên dọn.

## 7. Câu hỏi cần dev team làm rõ

1. Campaign console về admintool telco: dùng framework/stack nào của admintool hiện tại? DB gì cho campaign state?
2. LLM thay thế GreenNode là endpoint nào (nội bộ ZaloPay)?
3. Vẫn giữ cơ chế "AI agent tự sửa repo" trên production, hay chuyển sang agent chỉ ghi DB (không đụng source)?
4. Giữ lại phần nào của bản hackathon vs viết lại theo chuẩn?

---

*Tài liệu tạo cho mục đích handover. Phần "đã làm" phản ánh đúng trạng thái: PR #5 đã lên repo; fix campaign-sync cần re-apply (chưa có trong repo).*
