# 1) Composer deps
FROM composer:2 AS php_deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --no-scripts

# 2) Node deps
FROM node:20 AS node_deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

# 3) Build assets (Wayfinder + Vite)
FROM php:8.2-cli AS assets
WORKDIR /app
RUN apt-get update && apt-get install -y curl unzip git \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*
COPY . .
COPY --from=php_deps /app/vendor ./vendor
COPY --from=node_deps /app/node_modules ./node_modules
RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs
RUN php artisan wayfinder:generate --with-form || true
RUN npm run build

# 4) Final runtime image (Apache)
FROM php:8.2-apache AS final
WORKDIR /var/www/html

# PHP extensions + system libs
RUN apt-get update && apt-get install -y \
    git unzip zip libzip-dev \
    libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) \
    pdo_mysql zip mbstring bcmath intl gd \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# App files
COPY . .
COPY --from=php_deps /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

# Permissions + clear caches
RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs \
  && chown -R www-data:www-data bootstrap/cache storage \
  && chmod -R ug+rwx bootstrap/cache storage \
  && php artisan config:clear \
  && php artisan route:clear \
  && php artisan view:clear

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/000-default.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf
