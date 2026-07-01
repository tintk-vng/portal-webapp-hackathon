# RUNBOOK — Deploy NapTheVui lên GreenNode (để demo/thuyết trình)

> Mục tiêu: build bản mới nhất của webapp (kèm hệ thống campaign) và đưa lên GreenNode để present.
> **Chạy trên máy có VPN VNG + Docker + quyền GreenNode.** (Không chạy được trong sandbox của Claude — Next build cần fork worker + cần VPN/креds nội bộ.)

---

## 0. Điều kiện tiên quyết
- VPN VNG (để truy cập `registry-gitlab.zalopay.vn`, `repo.zalopay.vn`, và GreenNode).
- Docker đang chạy.
- `VERDACCIO_ZTOOL_TOKEN` (token registry nội bộ, để cài `@dgs/looknlearn` thật cho Header/Footer).
- GreenNode credentials: `portal-webapp-agent-editor/.greennode.json` (`client_id`, `client_secret`, `agent_identity`) — dùng cho agent; với deploy runtime dùng service account GreenNode/IAM.
- **Checkout branch có campaign code**: `master` (KHÔNG phải `main`).

```bash
git clone https://github.com/tintk-vng/portal-webapp-hackathon.git
cd portal-webapp-hackathon
git checkout master
# (khuyến nghị) áp fix campaign-sync theo PATCH-campaign-sync.md trước khi build
```

---

## 1. Cách nhanh nhất để DEMO — chạy local, share qua tunnel
Nếu chỉ cần present mà không cần host chính thức trên GreenNode:
```bash
export VERDACCIO_ZTOOL_TOKEN=<token>   # có VPN → Header/Footer thật; bỏ qua → dùng stub
./setup.sh
npm run build && npm run start          # production build, chạy port 8080
# hoặc dev: npm run dev
```
Mở `http://localhost:8080/game`. Muốn share cho người khác xem khi thuyết trình: dùng tunnel (vd `cloudflared tunnel --url http://localhost:8080` hoặc ngrok).

---

## 2. Build Docker image

### 2a. Build cho hạ tầng nội bộ VNG (bản gốc)
```bash
docker build \
  --build-arg VERDACCIO_ZTOOL_TOKEN=$VERDACCIO_ZTOOL_TOKEN \
  -f Dockerfile -t portal-webapp:latest .
```
> `Dockerfile` dùng base `registry-gitlab.zalopay.vn/...` → cần VPN.

### 2b. Build chạy ngoài mạng nội bộ (dễ demo hơn)
```bash
docker build -f Dockerfile.local -t portal-webapp:local .
docker run -p 8080:8080 portal-webapp:local     # test local trước khi push
```

---

## 3. Push lên GreenNode Container Registry + tạo Runtime

> Webapp là container HTTP (Next.js `next start`, cổng 8080) → deploy dưới dạng **Custom Agent runtime** trên AgentBase (image Docker bất kỳ có endpoint HTTP).

Dùng skill **`/agentbase-deploy`** (Claude Code, session interactive có VPN) — nó hướng dẫn:
1. Lấy thông tin repo registry được cấp (`get repo info`) + `docker login` GreenNode registry.
2. `docker tag portal-webapp:local <greennode-registry>/<repo>/portal-webapp:demo`
3. `docker push <greennode-registry>/<repo>/portal-webapp:demo`
4. Tạo/ cập nhật runtime:
   - `network mode`: **PUBLIC** (để present công khai) hoặc **VPC** (nội bộ).
   - `port`: 8080.
   - env cần thiết: `APP_ENV` (production/staging), `NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL`, v.v. (xem `.env.production` / `next.config.js`).
5. Lấy endpoint URL của runtime để mở khi thuyết trình.

> Các giá trị `<greennode-registry>` / `<repo>` / tên runtime lấy từ AgentBase console hoặc qua `/agentbase-deploy` (mục "Container Registry" và "runtime management"). Xem log/health khi chạy: skill **`/agentbase-monitor`**.

---

## 4. Lưu ý dữ liệu campaign khi demo
- State campaign đọc từ `src/agent/campaignState.json` (+ `appliedContent.json` nếu đã áp fix). Đảm bảo các file này có mặt trong image / volume để campaign hiển thị đúng lúc demo.
- Nếu demo luồng "apply → hiện lên /game" trực tiếp: cần fix campaign-sync (PATCH) để không phải rebuild/restart giữa buổi.
- `agentPopularSearchRecommendations` / blog CMS (`cms.zalopay.vn`) chỉ đầy đủ khi có VPN.

---

## 5. Checklist trước khi present
- [ ] Checkout `master`, đã áp `PATCH-campaign-sync.md` (nếu muốn demo luồng apply live).
- [ ] `npm run build` sạch, `npm run lint` OK.
- [ ] `docker run` local mở được `/game`, thấy banner + Tin Tức.
- [ ] Push image + runtime GreenNode healthy (kiểm tra `/agentbase-monitor`).
- [ ] Có sẵn 1 vài proposal đã `scan`/`approve` để demo bấm `apply` → thấy đổi ngay trên `/game`.

---

*Runbook này dựa trên `Dockerfile`/`Dockerfile.local` trong repo + skill AgentBase. Các bước GreenNode-specific (registry URL, tên runtime) cần điền theo project AgentBase của bạn; chưa verify end-to-end trong sandbox vì không có VPN/креds.*
