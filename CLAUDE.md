# Portal Webapp — Claude Code Guide

ZaloPay utilities portal (telco / bill / game). **Next.js 14 App Router**, React 18, Tailwind, Zustand, SWR + Axios. Dev server runs on **port 8080**.

## Quick start

```bash
./setup.sh        # auto: dùng @dgs/looknlearn thật nếu có VPN, ngược lại dùng stub
npm run dev       # → http://localhost:8080
```

- Trang `/` **cố tình để trống**. Vào `/telco/topup`, `/telco/phone-card`, `/telco/post-paid`, `/game`...
- Có alias tiếng Việt qua `rewrites` trong `next.config.js`: `/nap-dien-thoai`, `/the-dien-thoai`, `/dien`, `/nuoc`, `/hoc-phi`, `/mua-the-game`...

## Hai điều chỉnh để chạy NGOÀI mạng VNG (quan trọng)

1. **`@dgs/looknlearn`** (Header/Footer) nằm trên registry nội bộ `repo.zalopay.vn` (chỉ VPN).
   - Không VPN → dùng stub tại `stubs/looknlearn/` (`package.json` trỏ `file:./stubs/looknlearn`).
   - Có VPN → đặt `VERDACCIO_ZTOOL_TOKEN` rồi chạy `./setup.sh` để lấy bản thật.
   - Stub chỉ ảnh hưởng header/footer; mọi thứ khác giống production.

2. **CORS API** — `next.config.js` ở `APP_ENV=local`:
   - `getPaymentAggregatorBaseUrl()` trả `''` (same-origin).
   - Rewrite `/api/v1/:path*` → proxy server-side tới `https://payment-aggregator.zalopay.vn/api/v1/:path*`.
   - Nhờ vậy browser gọi `localhost:8080/api/v1/...` → không dính CORS, **data telco/bill là LIVE**.
   - Đổi `payment-aggregator` → `stg-payment-aggregator` nếu muốn test môi trường staging.

## Kiến trúc

```
app/            # App Router: (static)/  bill/  telco/  game/  transactions/
api-client/     # Axios modules theo domain (bill/ telco/ common/ client/)
components/     # UI dùng chung (layout/ common/)
constants/      # telco.ts: AppID, ProductID, API_PATH, EVENT
models/         # format dữ liệu API
store/          # Zustand
hooks/  utils/  types/
```

- `api-client/client/index.ts` — axios instance, baseURL = `NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL`.
- `constants/telco.ts` — `ProductID` (TOPUP=61, PHONE_CARD=12, DATA_TOPUP=441, POST_PAID=451, COMBO=455, GAME=2391, GOOGLEPLAY=3628), `API_PATH` map theo AppID.
- Convention App Router: `_folder/` = private (không route), `(folder)/` = group, `[folder]/` = dynamic.

## Data Layer (Agent-Editable)

We added a structured static data layer inside `src/data/` for AI agent vibe-coding and content updates:
- `src/data/catalog.ts` — Game items, SKU configurations, and popular search recommendations.
- `src/data/campaigns.ts` — Active promotional campaign definitions, banner targets, and discount percentages.
- `src/data/newsArticles.ts` — Game articles, top-up guides, and campaign details.
- `src/data/discounts.ts` — Derived pricing & badge helpers (agents must not edit).
- `AGENT_CONTRACT.md` — Rules for agents editing data configurations.

## Quy ước code

- Theo `.cursor/rules/` (next-js, react, tailwind, typescript, zustand) — đọc trước khi sửa.
- **Tích hợp Superpowers**: Dự án được tích hợp với thư viện Superpowers (nằm tại thư mục cục bộ `.skills/`). AI agent bắt buộc phải kiểm tra và áp dụng các skill tương ứng (như `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging` nằm tại `.skills/[tên-skill]/SKILL.md`) TRƯỚC KHI thực hiện bất kỳ task hoặc chỉnh sửa mã nguồn nào.
- TypeScript strict; props có type rõ ràng; tránh `any`.
- Đặt tên: component PascalCase, hook `useXxx`, CSS kebab-case.
- Format: Prettier + ESLint (`.prettierrc`, `.eslintrc.json`). Husky pre-commit + lint-staged.
- File < 800 dòng, hàm < 50 dòng.

## Lệnh hay dùng

```bash
npm run dev         # dev (APP_ENV=local, port 8080)
npm run build       # build production
npm run lint        # eslint
npm test            # jest + coverage
npm run analyze     # bundle analyzer
```

## Shipping to Production (Quy trình Ship Code)

Khi hoàn thành chỉnh sửa hoặc phát triển tính năng mới và muốn đưa lên production:
1. **Kiểm tra Code (Build & Typecheck)**: Luôn chạy `npm run build` để đảm bảo code biên dịch thành công và không lỗi TypeScript/Next.js. Không được push code lỗi build.
2. **Kiểm tra Linter**: Chạy `npm run lint` để kiểm tra quy chuẩn viết code.
3. **Commit & Push**:
   - Chỉ stage các file code thay đổi thực tế, tránh các file cấu hình local hoặc file cache.
   - Commit theo chuẩn: `git commit -m "feat/fix/chore: <mô tả chi tiết bằng tiếng Anh hoặc tiếng Việt>"`
   - Đẩy lên remote branch: `git push origin <tên-branch>`
4. **Tạo Pull Request (PR)**: Tạo PR trên GitHub hướng mục tiêu (target) vào branch **`dev`** (không target trực tiếp vào `main`). Sau khi được review và merge vào `dev`, code sẽ đi qua luồng CI/CD Staging trước khi lên Production.

## Gotchas

- Không VPN: nội dung game blog (`cms.zalopay.vn`) và header/footer thật sẽ KHÔNG có; telco/bill vẫn chạy.
- Console báo `SDK Tracking - Receive event not from *.zalopay.vn` là **vô hại** (GTM SDK chặn origin localhost).
- `next.config.js` đổi env/rewrites → phải **restart** dev server (không hot-reload).
- File build chính thức dùng `Dockerfile` (hạ tầng nội bộ). Build ngoài mạng dùng `Dockerfile.local`.
