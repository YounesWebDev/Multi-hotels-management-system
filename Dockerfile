# 1) Composer deps
FROM composer:2 AS php_deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist
COPY . .
RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs

# 2) Build frontend assets using Node (npm is guaranteed here)
FROM node:20 AS assets
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

COPY . .
# IMPORTANT: disable Wayfinder during build unless you have PHP inside this stage
ENV VITE_WAYFINDER=false
RUN npm run build

# 3) Final runtime image (Apache + PHP)
FROM php:8.2-apache AS final
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y libzip-dev unzip \
  && docker-php-ext-install pdo_mysql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Set Apache document root to /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/000-default.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# Copy app + vendor + built assets
COPY . .
COPY --from=php_deps /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs \
  && chown -R www-data:www-data bootstrap/cache storage \
  && chmod -R ug+rwx bootstrap/cache storage
