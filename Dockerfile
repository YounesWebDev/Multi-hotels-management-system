# 1) Composer deps
# ✅ CHANGE ONLY: use php:8.2-cli (Debian) instead of composer:2 (Alpine)
# ✅ KEEP stage name php_deps SAME so other stages still work
FROM php:8.2-cli AS php_deps
WORKDIR /app

# ✅ ADDED: install composer (because we no longer use composer:2)
RUN apt-get update && apt-get install -y git unzip curl libzip-dev \
  && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
  && rm -rf /var/lib/apt/lists/*

# ✅ ADDED: libs + PHP extensions commonly required by composer packages
RUN apt-get update && apt-get install -y \
    git unzip zip \
    libzip-dev \
    libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libxml2-dev \
    libonig-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) \
    pdo_mysql zip mbstring exif pcntl bcmath intl gd \
  && rm -rf /var/lib/apt/lists/*


COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --no-scripts
COPY . .
RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs

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
RUN apt-get update && apt-get install -y libzip-dev unzip \
  && docker-php-ext-install pdo_mysql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*
COPY . .
COPY --from=php_deps /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build
RUN mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs \
  && chown -R www-data:www-data bootstrap/cache storage \
  && chmod -R ug+rwx bootstrap/cache storage

RUN php artisan config:clear && php artisan route:clear && php artisan view:clear

# ✅ FIXED: ENV must not be indented / inside RUN
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# ✅ ADDED: allow Laravel to generate https asset URLs if you set ASSET_URL in Render
ENV ASSET_URL=""

RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/000-default.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# ✅ ADDED: copy and run the Render start script (migrations, etc.)
RUN mkdir -p /docker
COPY docker/start.sh /docker/start.sh
RUN chmod +x /docker/start.sh

CMD ["/docker/start.sh"]
