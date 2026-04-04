#!/usr/bin/env bash
# 构建并启动 Web 容器；Vite 读 .env.prod.local（prod.local）
set -euo pipefail
if [ -f /volume1/Environments/use-menv.sh ]; then
  # shellcheck source=/dev/null
  . /volume1/Environments/use-menv.sh >/dev/null 2>&1 || true
fi
cd "$(dirname "$0")"

set -a
# shellcheck source=/dev/null
[ -f .env.prod.local ] && . ./.env.prod.local
set +a

IMAGE_NAME="${LSR_WEB_IMAGE:-lsr-web:prod-local}"
CONTAINER_NAME="${LSR_WEB_CONTAINER:-LSR-Web-Prod-Local}"
HOST_PORT="${LSR_WEB_PORT:-10006}"
RESTART="${LSR_WEB_RESTART:-unless-stopped}"

sudo -E docker build -t "$IMAGE_NAME" "$@" .
sudo -E docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
sudo -E docker run -d --name "$CONTAINER_NAME" --restart="$RESTART" \
  --add-host=host.docker.internal:host-gateway \
  -p "${HOST_PORT}:80" "$IMAGE_NAME"

echo "LSR Web → http://localhost:${HOST_PORT}"
echo "独立 API 域名时 / standalone API: ./start.sh --build-arg VITE_API_URL=https://api... --build-arg VITE_WS_URL=wss://..."
