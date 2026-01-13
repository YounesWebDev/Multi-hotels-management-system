# =========================================================
# 1) Composer deps stage (Laravel PHP dependencies)
# =========================================================
FROM composer:2 AS php_deps

WORKDIR /app

# Copy full project first so "artisan" exists when Composer runs scripts
COPY . .

# Install PHP dependencies (production)
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader


# =========================================================
# 2) Assets build stage (Vite / React)
# =========================================================
FROM node:20-alpine AS assets_build

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install deps depending on your lockfile
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  else npm install; fi

# Copy the full project for building assets
COPY . .

# Build Vite assets
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
RUN apt-get update && apt-get install -y \
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

EXPOSE 80

# Laravel optimizations (won't fail build if env isn't ready)
RUN php artisan config:cache || true \
 && php artisan route:cache || true \
 && php artisan view:cache || true
