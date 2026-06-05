#!/bin/sh
# docker-entrypoint.sh
#
# Runs as root at container start. Does envsubst to inject runtime env vars
# into the nginx config template, then drops to the nginx user for execution.
#
# Handles: NVIDIA_API_KEY, ANTHROPIC_API_KEY

set -e

# ── Inject runtime env vars into nginx config ──
if [ -f /etc/nginx/conf.d/default.conf.template ]; then
    echo "[entrypoint] Injecting runtime env vars into nginx config..."
    envsubst '${NVIDIA_API_KEY} ${ANTHROPIC_API_KEY}' \
        < /etc/nginx/conf.d/default.conf.template \
        > /etc/nginx/conf.d/default.conf
    
    # Validate the config
    nginx -t 2>&1 || {
        echo "[entrypoint] ERROR: nginx config validation failed"
        nginx -t 2>&1
        exit 1
    }
    echo "[entrypoint] nginx config validated OK"
else
    echo "[entrypoint] WARNING: No nginx template found at /etc/nginx/conf.d/default.conf.template"
    echo "[entrypoint] Using existing config if present"
fi

# ── Drop privileges and execute CMD ──
echo "[entrypoint] Switching to nginx user and starting..."
exec su-exec nginx "$@"
