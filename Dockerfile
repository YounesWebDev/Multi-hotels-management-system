# 1) Composer deps
FROM composer:2 AS php_deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --no-scripts
COPY . .
RUN mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs

# 2) Node deps
FROM node:20 AS node_deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

# 3) Build assets (Vite + optional Wayfinder)
FROM php:8.2-cli AS assets
WORKDIR /app
RUN apt-get update && apt-get install -y git unzip \
  && rm -rf /var/lib/apt/lists/*

COPY . .
COPY --from=php_deps /app/vendor ./vendor
COPY --from=node_deps /app/node_modules ./node_modules

RUN mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs

# Wayfinder is optional: don't break build if it fails
RUN php artisan wayfinder:generate --with-form || true

RUN npm run build

# 4) Final runtime image (Apache)
FROM php:8.2-apache AS final

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y libzip-dev unzip \
  && docker-php-ext-install pdo_mysql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Point Apache to /public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/000-default.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# Allow .htaccess in /public (Laravel needs it)
RUN printf '<Directory "%s">\n\tAllowOverride All\n\tRequire all granted\n</Directory>\n' "$APACHE_DOCUMENT_ROOT" \
  > /etc/apache2/conf-available/laravel.conf \
  && a2enconf laravel

COPY . .
COPY --from=php_deps /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

# Permissions + create needed dirs
RUN mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
  && chown -R www-data:www-data bootstrap/cache storage \
  && chmod -R ug+rwx bootstrap/cache storage

EXPOSE 80
