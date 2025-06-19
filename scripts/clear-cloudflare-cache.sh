#!/usr/bin/env bash
set -euo pipefail

# Cloudflareキャッシュクリアスクリプト
# 使用方法: ./scripts/clear-cloudflare-cache.sh

# 環境変数の確認
if [[ -z "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    echo "❌ CLOUDFLARE_ZONE_ID環境変数が設定されていません"
    echo "Cloudflareダッシュボードから Zone ID を取得して設定してください"
    exit 1
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    echo "❌ CLOUDFLARE_API_TOKEN環境変数が設定されていません"
    echo "CloudflareでAPIトークンを作成して設定してください"
    exit 1
fi

echo "🚀 Cloudflareキャッシュクリア開始..."

# 全キャッシュクリア
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
     -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}' \
     --silent --show-error | jq '.'

echo "✅ Cloudflareキャッシュクリア完了"
echo "📝 変更が反映されるまで5-10分お待ちください"