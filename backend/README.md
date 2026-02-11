# Setup
cp .env.example .env
docker compose up -d --build
docker compose exec app composer install
