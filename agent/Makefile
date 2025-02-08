# Load .env file if available (.env should contain KEY=VALUE pairs)
-include .env

# Retrieve DOCKER_USERNAME from the environment (error out if not set)
ifndef DOCKER_USERNAME
$(error DOCKER_USERNAME is not set. Please set it in your environment or in a .env file)
endif

# Docker related variables
IMAGE_NAME = crypto-daily-brief-cdp-chatbot
TAG ?= latest

# Full image name with tag
DOCKER_IMAGE = $(DOCKER_USERNAME)/$(IMAGE_NAME):$(TAG)

.PHONY: build
build:
	docker build -t $(DOCKER_IMAGE) .

.PHONY: run
run:
	docker run -it --rm \
		-e OPENAI_API_KEY \
		-e CDP_API_KEY_NAME \
		-e CDP_API_KEY_PRIVATE_KEY \
		-e NETWORK_ID \
		-e API_TARGET \
		-e GROQ_API_KEY \
		-e GROQ_MODEL \
		$(DOCKER_IMAGE)

.PHONY: push
push:
	@if ! docker images | grep -q $(DOCKER_IMAGE); then \
		$(MAKE) build; \
	fi
	docker push $(DOCKER_IMAGE)

.PHONY: all
all: build push

# New target: shell - to run an interactive shell in the container
.PHONY: shell
shell:
	docker run -it --rm $(DOCKER_IMAGE) sh

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build    - Build the Docker image"
	@echo "  make run      - Run the container"
	@echo "  make push     - Push the image to DockerHub (build automatically if image is not found)"
	@echo "  make all      - Build and push the image"
	@echo "  make shell    - Run an interactive shell in the container"
	@echo ""
	@echo "Environment variable settings:"
	@echo "  DOCKER_USERNAME    - Your DockerHub username (do not hardcode sensitive information)"
	@echo "  TAG                - Image tag (default: latest)"
