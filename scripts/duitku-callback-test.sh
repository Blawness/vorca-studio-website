#!/usr/bin/env bash
# Simulasi callback Duitku ke endpoint kita (tanpa perlu tunnel / transaksi beneran).
#
#   scripts/duitku-callback-test.sh                                  # ke localhost:3000
#   BASE_URL=http://localhost:3001 scripts/duitku-callback-test.sh
#   BASE_URL=https://xxx.trycloudflare.com scripts/duitku-callback-test.sh
#
# Env opsional: ORDER_ID, AMOUNT, RESULT_CODE (00 sukses / 01 gagal)
set -euo pipefail

cd "$(dirname "$0")/.."
set -a
[ -f .env ] && . ./.env
[ -f .env.local ] && . ./.env.local
set +a

: "${DUITKU_MERCHANT_CODE:?belum diset di .env}"
: "${DUITKU_API_KEY:?belum diset di .env}"

BASE_URL="${BASE_URL:-http://localhost:3000}"
ORDER_ID="${ORDER_ID:-test-$(date +%s)}"
AMOUNT="${AMOUNT:-40000}"
RESULT_CODE="${RESULT_CODE:-00}"

sign() {
    printf "%s" "$1" | openssl dgst -sha256 -hmac "$DUITKU_API_KEY" -hex | awk '{print $NF}'
}
SIG="$(sign "${DUITKU_MERCHANT_CODE}${AMOUNT}${ORDER_ID}")"

hit() { # label, form-data
    printf "%-22s " "$1"
    code=$(curl -s -o /tmp/duitku-cb-out -w '%{http_code}' -X POST "$BASE_URL/callback" \
        -H 'Content-Type: application/x-www-form-urlencoded' -d "$2")
    printf "HTTP %s  %s\n" "$code" "$(head -c 80 /tmp/duitku-cb-out | tr -d '\n')"
}

echo "target : $BASE_URL/callback"
echo "order  : $ORDER_ID  amount=$AMOUNT resultCode=$RESULT_CODE"
echo

VALID="merchantCode=${DUITKU_MERCHANT_CODE}&amount=${AMOUNT}&merchantOrderId=${ORDER_ID}&resultCode=${RESULT_CODE}&reference=REF-${ORDER_ID}&publisherOrderId=PUB-${ORDER_ID}&paymentCode=BC&productDetail=Test+Duitku&signature=${SIG}"

hit "valid signature" "$VALID"
hit "duplicate (idempoten)" "$VALID"
hit "tampered signature" "merchantCode=${DUITKU_MERCHANT_CODE}&amount=${AMOUNT}&merchantOrderId=${ORDER_ID}&resultCode=00&signature=deadbeef"
hit "amount diubah" "merchantCode=${DUITKU_MERCHANT_CODE}&amount=1&merchantOrderId=${ORDER_ID}&resultCode=00&signature=${SIG}"
hit "field kurang" "foo=bar"

printf "%-22s " "GET (harus 405)"
curl -s -o /tmp/duitku-cb-out -w 'HTTP %{http_code}' "$BASE_URL/callback"
echo "  $(head -c 80 /tmp/duitku-cb-out)"
