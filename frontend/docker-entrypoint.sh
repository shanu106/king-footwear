#!/bin/sh
# Default to 8080 if PORT env var is not set
PORT=${PORT:-8080}

# Replace PORT placeholder in nginx config
sed -i "s/listen 8080/listen $PORT/" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
