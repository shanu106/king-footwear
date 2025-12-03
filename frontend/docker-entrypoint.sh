#!/bin/sh
# Default to 8080 if PORT env var is not set
PORT=${PORT:-8080}

# Replace PORT placeholder in nginx config
sed -i "s/listen 8080/listen $PORT/" /etc/nginx/conf.d/default.conf

# Replace environment variables in config.js
sed -i "s|\${VITE_BACKEND_URL}|${VITE_BACKEND_URL}|g" /usr/share/nginx/html/config.js
sed -i "s|\${DELHIVERY_API_KEY}|${VITE_DELHIVERY_API_KEY}|g" /usr/share/nginx/html/config.js
sed -i "s|\${VITE_RAZORPAY_KEY_ID}|${VITE_RAZORPAY_KEY_ID}|g" /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g "daemon off;"
