#!/bin/sh
set -e

# 1) Ensure Laravel writable dirs exist (Render containers start clean)
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

# 2) Permissions (Apache runs as www-data)
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R ug+rwx storage bootstrap/cache || true

# 3) Clear caches safely
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# 4) OPTIONAL: run migrations automatically (only if you enable it in Render env)
# Set RUN_MIGRATIONS=true in Render if you want this.
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  php artisan migrate --force || true
fi

exec apache2-foreground
