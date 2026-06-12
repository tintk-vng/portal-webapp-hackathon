#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Portal Webapp — local setup for team members
#
# Dựng môi trường chạy app trên máy cá nhân. Tự phát hiện có VPN VNG hay không:
#   - CÓ VPN  → dùng package @dgs/looknlearn THẬT (cần VERDACCIO_ZTOOL_TOKEN)
#   - KHÔNG   → dùng stub offline trong ./stubs/looknlearn (header/footer giả lập)
#
# Cách dùng:
#   ./setup.sh                 # tự phát hiện
#   ./setup.sh --offline       # ép dùng stub (không cần VPN)
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")"

FORCE_OFFLINE=false
[[ "${1:-}" == "--offline" ]] && FORCE_OFFLINE=true

echo "▶ Kiểm tra Node.js..."
command -v node >/dev/null 2>&1 || { echo "✗ Cần cài Node.js (khuyến nghị v20+). Xem https://nodejs.org"; exit 1; }
echo "  node $(node -v)"

REGISTRY="https://repo.zalopay.vn/verdaccio/"
HAS_VPN=false
if [[ "$FORCE_OFFLINE" == false ]]; then
  echo "▶ Kiểm tra registry nội bộ (VPN VNG)..."
  if curl -s -m 6 -o /dev/null "$REGISTRY" 2>/dev/null; then
    HAS_VPN=true
    echo "  ✓ Truy cập được registry nội bộ"
  else
    echo "  ✗ Không truy cập được → dùng stub offline"
  fi
fi

if [[ "$HAS_VPN" == true && -n "${VERDACCIO_ZTOOL_TOKEN:-}" ]]; then
  echo "▶ Cấu hình dùng @dgs/looknlearn THẬT..."
  cat > .npmrc <<EOF
registry=https://registry.npmjs.org/
strict-ssl=false
@dgs:registry=$REGISTRY
//repo.zalopay.vn/verdaccio/:_authToken=${VERDACCIO_ZTOOL_TOKEN}
EOF
  node -e "const p=require('./package.json');p.dependencies['@dgs/looknlearn']='^0.3.7';require('fs').writeFileSync('./package.json',JSON.stringify(p,null,2)+'\n')"
else
  echo "▶ Cấu hình dùng stub offline (./stubs/looknlearn)..."
  cat > .npmrc <<'EOF'
registry=https://registry.npmjs.org/
strict-ssl=false
legacy-peer-deps=true
EOF
  node -e "const p=require('./package.json');p.dependencies['@dgs/looknlearn']='file:./stubs/looknlearn';require('fs').writeFileSync('./package.json',JSON.stringify(p,null,2)+'\n')"
fi

echo "▶ npm install..."
npm install

echo ""
echo "✓ Xong. Chạy app:"
echo "    npm run dev"
echo "  → http://localhost:8080/telco/topup  (trang / cố tình để trống)"
echo ""
echo "  Dữ liệu telco/bill là LIVE (proxy qua payment-aggregator trong next.config.js)."
