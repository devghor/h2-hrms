FROM php:8.4-fpm

# --------------------------------------------------
# System dependencies
# --------------------------------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        bcmath \
        gd \
        zip \
        exif \
        intl \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --------------------------------------------------
# Composer
# --------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --------------------------------------------------
# Workdir
# --------------------------------------------------
WORKDIR /var/www

# --------------------------------------------------
# Copy source
# --------------------------------------------------
COPY . .

# --------------------------------------------------
# Install dependencies
# --------------------------------------------------
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# --------------------------------------------------
# Permissions (Laravel)
# --------------------------------------------------
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

# --------------------------------------------------
# Expose & start
# --------------------------------------------------
EXPOSE 9000
CMD ["php-fpm"]
