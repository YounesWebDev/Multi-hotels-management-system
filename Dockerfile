# ---------- Stage 1: PHP deps ----------
FROM composer:2 AS php_deps
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress
COPY . .


# ---------- Stage 2: Build assets using PHP + Node (for wayfinder) ----------
FROM php:8.2-cli AS assets_build
WORKDIR /app

# Install system deps + Node (Debian)
RUN apt-get update && apt-get install -y curl git unzip \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

# Copy app + vendor
COPY . .
COPY --from=php_deps /app/vendor ./vendor

# Build frontend
RUN npm ci
RUN npm run build


# ---------- Stage 3: Runtime (Apache + PHP) ----------
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev \
 && docker-php-ext-install pdo_mysql zip \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Apache serve /public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' \
    /etc/apache2/sites-available/000-default.conf

# Copy app source
COPY . .

# Copy vendor and built assets
COPY --from=php_deps /app/vendor ./vendor
COPY --from=assets_build /app/public/build ./public/build

RUN chown -R www-data:www-data storage bootstrap/cache

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 10000
CMD ["/start.sh"]
