#!/bin/sh
set -eu

detect_host_ip() {
  route_ip="$(ip -4 route get 1.1.1.1 2>/dev/null | awk '
    {
      for (i = 1; i <= NF; i++) {
        if ($i == "src") {
          print $(i + 1)
          exit
        }
      }
    }
  ')"

  if [ -n "$route_ip" ]; then
    printf '%s\n' "$route_ip"
    return
  fi

  for ip in $(hostname -I 2>/dev/null || true); do
    case "$ip" in
      127.*|172.17.*|::1)
        ;;
      *:*)
        ;;
      *)
        printf '%s\n' "$ip"
        return
        ;;
    esac
  done

  printf '127.0.0.1\n'
}

HOST_IP="${API_HOST:-${EXPO_HOST_IP:-$(detect_host_ip)}}"

export EXPO_PORT="${EXPO_PORT:-${FRONTEND_PORT:-8082}}"
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-http://$HOST_IP:${BACKEND_PORT:-8001}/api}"
export REACT_NATIVE_PACKAGER_HOSTNAME="${EXPO_HOST_IP:-$HOST_IP}"

echo "Expo/Metro: exp://$REACT_NATIVE_PACKAGER_HOSTNAME:$EXPO_PORT"
echo "Backend API: $EXPO_PUBLIC_API_URL"

if [ "${EXPO_TUNNEL:-0}" = "1" ]; then
  unset EXPO_OFFLINE
  exec npm run tunnel:docker
fi

if [ -n "${FRONTEND_COMMAND:-}" ]; then
  exec sh -c "$FRONTEND_COMMAND"
fi

exec npm run start:docker
