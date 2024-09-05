AWS_REGION=us-east-1
AWS_PROFILE=default
AWS_SHARED_CREDENTIALS_FILE=../../.aws/credentials
AWS_CONFIG_FILE=../../.aws/config
AWS_SDK_LOAD_CONFIG=1
REPOSITORY_NAME=micropaywall-service
GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
ENV := dev

version=

.PHONY: ecr-uri
ecr-uri:
	$(eval ECR_REPOSITORY := $(shell AWS_SHARED_CREDENTIALS_FILE=$(AWS_SHARED_CREDENTIALS_FILE) AWS_CONFIG_FILE=$(AWS_CONFIG_FILE) aws ecr describe-repositories --repository-names $(REPOSITORY_NAME) --region $(AWS_REGION) --profile $(AWS_PROFILE) --query 'repositories[0].repositoryUri' --output text))

.PHONY: build
build: gen-frontend
	docker build --progress=plain --platform linux/amd64 -t $(REPOSITORY_NAME):latest -f ./docker/Dockerfile .

.PHONY: run-local
run-local: build
	docker run -p 8080:3000 --rm --name $(REPOSITORY_NAME)-local $(REPOSITORY_NAME):latest

.PHONY: login-ecr
login-ecr: ecr-uri
	@AWS_SHARED_CREDENTIALS_FILE=$(AWS_SHARED_CREDENTIALS_FILE) AWS_CONFIG_FILE=$(AWS_CONFIG_FILE) aws ecr get-login-password --region $(AWS_REGION) --profile $(AWS_PROFILE) | \
	docker login --username AWS --password-stdin $(ECR_REPOSITORY)

.PHONY: tag-push-image
tag-push-image: ecr-uri
	@if [ -z "$(version)" ]; then \
		echo "\n\nError: version is not set. Please provide a version number.\n"; \
		echo "Example:"; \
		echo "\tmake deploy version=v0.0.1\n\n"; \
		exit 1; \
	fi
	@echo "\nDeploying version $(version) to $(ECR_REPOSITORY)\n"
	docker tag $(REPOSITORY_NAME):latest $(ECR_REPOSITORY):$(version)
	docker push $(ECR_REPOSITORY):$(version)
	@echo "\nCompleted deploy of $(version) to $(ECR_REPOSITORY)\n"

.PHONY: run-remote
run-remote: ecr-uri
	@if [ -z "$(version)" ]; then \
		echo "Error: version is not set. Please provide a version number."; \
		exit 1; \
	fi
	docker pull $(ECR_REPOSITORY):$(version)
	docker run -p 8080:3000 --rm --name $(REPOSITORY_NAME)-local $(ECR_REPOSITORY):$(version)

.PHONY: deploy
deploy: build
	cddc deploy --service-config ./service.yaml -p code$(ENV) -t latest

.PHONY: dev
dev:
	@echo "Starting development environment"
	cd packages/backend && npm run dev

.PHONY: gen-api
gen-api:
	cd packages/api && npm run gen

.PHONY: gen-db
gen-db:
	cd packages/database && npm run db:format
	cd packages/database && npm run db:init

.PHONY: gen-frontend
gen-frontend:
	cd packages/frontend && npm run build

.PHONY: gen
gen: gen-api gen-db gen-frontend

.PHONY: migrate
migrate:
	cd packages/database && npm run db:migrate

.PHONY: install
install:
	@echo "Installing dependencies"
	cd packages/api && npm install
	cd packages/api && npm run gen
	cd packages/database && npm install
	cd packages/database && npm run db:init
	cd packages/frontend && npm install
	cd packages/frontend && npm run build
	cd packages/backend && npm install

	@echo "Initializing database"

	@if [ ! -f packages/backend/.env ]; then \
		echo "\nError: packages/backend/.env file not found. Please create one using the template provided in packages/backend/.env.example"; \
		echo "\nExample:"; \
		echo "\tcp ./packages/backend/example.env ./packages/backend/.env\n\n"; \
		exit 1; \
	fi

	cd packages/database && npm run db:migrate

.PHONY: verifier-key
verifier-key:
	@echo "Generating verifier key"
	cd packages/backend && npm run script:gen-secret