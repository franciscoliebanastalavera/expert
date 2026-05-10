#!/usr/bin/env bash
set -e

echo "=== CapitalFlow setup ==="
echo ""

echo "[1/5] Building shared-ui..."
(cd shared-ui && npm install --legacy-peer-deps && npm run build)

i=2
for proj in shell mfe-payments mfe-transactions mfe-analytics-react; do
    echo "[$i/5] Installing $proj..."
    (cd "$proj" && npm install)
    i=$((i + 1))
done

echo ""
echo "[OK] Setup complete."
echo "Linux/Mac launch scripts are not provided; use docker compose up -d for local stack."
