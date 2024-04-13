build-up: build up
debug-build-up: debug-build debug-up
	
debug-build:
	docker-compose -f docker-compose.debug.yml build
debug-up:				
	docker-compose -f docker-compose.debug.yml up -d
debug-down:
	docker-compose -f docker-compose.debug.yml down
build:
	docker-compose -f docker-compose.yml build
up:				
	docker-compose -f docker-compose.yml up -d
down:
	docker-compose -f docker-compose.yml down

