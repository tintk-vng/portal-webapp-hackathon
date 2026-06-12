# Onboarding — Portal Webapp (ZaloPay utilities)

Hướng dẫn để một thành viên mới bắt đầu **edit/replace/add** trên website này bằng Claude Code.

## 1. Lấy code & chạy

```bash
git clone <repo-url> portal-webapp
cd portal-webapp
./setup.sh          # dựng môi trường (tự nhận VPN; không VPN → stub offline)
npm run dev         # → http://localhost:8080/telco/topup
```

Trang `/` để trống. Các route chính: `/telco/topup`, `/telco/phone-card`, `/telco/post-paid`, `/telco/combo`, `/telco/data-topup`, `/game`. Alias tiếng Việt: `/nap-dien-thoai`, `/the-dien-thoai`, `/dien`, `/nuoc`, `/hoc-phi`...

## 2. Mở bằng Claude Code

```bash
cd portal-webapp
claude
```

`CLAUDE.md` ở repo tự load — Claude Code sẽ nắm được kiến trúc, quy ước, và 2 fix offline (stub + API proxy). Cứ mô tả thay đổi bạn muốn (ví dụ: "đổi màu nút Nạp ngay", "thêm mệnh giá 30.000đ vào topup", "tạo trang mới /telco/khuyen-mai") và Claude Code sẽ sửa code trực tiếp.

## 3. Quy trình sửa code chuẩn

1. Tạo branch: `git checkout -b feat/<tên>`
2. Nhờ Claude Code thực hiện thay đổi (edit/replace/add).
3. Kiểm tra trên `localhost:8080`, chạy `npm run lint`.
4. Commit theo convention: `feat:`, `fix:`, `refactor:`...
5. Push & tạo MR/PR.

## 4. Lưu ý

- Không VPN: header/footer là stub, game blog (CMS) không có data — telco/bill vẫn chạy LIVE.
- Sửa `next.config.js` (env/rewrites) → restart `npm run dev`.
- Tuân theo `.cursor/rules/` và `CLAUDE.md`. File < 800 dòng, hàm < 50 dòng.
- Deploy ngoài mạng nội bộ: `docker build -f Dockerfile.local -t portal-webapp:local .`
