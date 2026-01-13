#!/bin/sh
set -e

PORT="${PORT:-10000}"

sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

exec apache2-foreground
