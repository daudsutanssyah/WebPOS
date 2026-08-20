# Mengunci basis image sesuai versi presisi PHP lokal Anda (8.3) berbasis Linux Debian/Apache
FROM php:8.3.21-apache

# Instal dependensi Linux OS yang dibutuhkan oleh Laravel & ekstensi PHP bawaan Laragon
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip

# Aktifkan modul mod_rewrite Apache agar routing /api/v1 Laravel bekerja
RUN a2enmod rewrite

# Perbaikan konflik MPM Apache agar kontainer tidak crash saat startup
RUN a2dismod mpm_event mpm_worker && a2enmod mpm_prefork

# Konfigurasi Apache Document Root agar langsung mengarah ke folder public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Atur direktori kerja di dalam kontainer Docker
WORKDIR /var/www/html

# Salin seluruh berkas proyek dari folder backend lokal ke dalam kontainer
COPY . .

RUN ls -la

# Unduh Composer versi terbaru langsung ke dalam kontainer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Jalankan instalasi dependensi vendor Laravel tanpa paket development (lebih ringan untuk production)
RUN composer install --no-dev --optimize-autoloader

# Berikan izin akses penuh (permission) pada folder storage dan cache agar server bisa menulis log
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Buka gerbang port 80 untuk lalu lintas web publik Render
EXPOSE 80
