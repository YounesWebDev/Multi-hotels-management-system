# =========================================================
# 1) Composer deps stage
# =========================================================
FROM composer:2 AS php_deps

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader

COPY . .

# Don't fail the build if artisan needs env values
RUN php artisan package:discover --ansi || true


# =========================================================
# 2) Assets build stage (Node + PHP CLI for Wayfinder)
# =========================================================
FROM node:20-bookworm AS assets_build

WORKDIR /app

# Install PHP CLI + common extensions needed for artisan
RUN apt-get update && apt-get install -y --no-install-recommends \
    php8.2-cli php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip \
    unzip git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy package files first for caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install JS deps depending on lockfile
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  else npm install; fi

# Copy full project
COPY . .

# IMPORTANT: copy PHP vendor deps so artisan works in this stage
COPY --from=php_deps /app/vendor ./vendor

# Provide minimal env so artisan commands don't crash
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=

# Build Vite assets (Wayfinder will now find `php`)
RUN \
  if [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then yarn build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else npm run build; fi


# =========================================================
# 3) Final runtime stage (Apache + PHP)
# =========================================================
FROM php:8.2-apache

# System deps + PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev \
  && docker-php-ext-install pdo_mysql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Set Apache DocumentRoot to /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Copy project code
COPY . .

# Copy vendor from composer stage
COPY --from=php_deps /app/vendor ./vendor

# Copy built assets from node stage (Vite outputs to public/build)
COPY --from=assets_build /app/public/build ./public/build

# Permissions
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache

# Optional but useful (won’t fail the build if it can’t run)
RUN php artisan storage:link || true

EXPOSE 80
