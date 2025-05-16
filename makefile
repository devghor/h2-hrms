APP_CONTAINER=app
NGINX_CONTAINER=nginx
POSTGRES_CONTAINER=postgres
REDIS_CONTAINER=redis

up:
	docker compose up

stop:
	docker compose stop

down:
	docker compose down -v

restart:
	docker compose restart

php:
	docker compose exec $(APP_CONTAINER) php $(filter-out $@,$(MAKECMDGOALS))

artisan:
	docker compose exec $(APP_CONTAINER) php artisan $(filter-out $@,$(MAKECMDGOALS))

composer:
	docker-compose exec $(APP_CONTAINER) composer $(filter-out $@,$(MAKECMDGOALS))