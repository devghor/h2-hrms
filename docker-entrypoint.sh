#!/bin/sh
# Fix Laravel permissions on container start
echo "Fixing Laravel permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Run the main container command
exec "$@"
