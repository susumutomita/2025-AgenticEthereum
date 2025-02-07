.PHONY: install setup_husky devclean lint gas format format_check format_contract test test_contract before_commit build_frontend start build_backend build_contract export_pdf help

# -------------------------------
# Help
# -------------------------------
help:              # Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install         Install npm packages"
	@echo "  setup_husky     Setup Husky for git hooks"
	@echo "  dev             Start the frontend in development mode"
	@echo "  clean           Clean the project"
	@echo "  lint            Run linter"
	@echo "  format          Format code"
	@echo "  format_check    Check code formatting"
	@echo "  format_contract Format smart contracts"
	@echo "  test            Run tests"
	@echo "  test_contract   Test smart contracts"
	@echo "  gas             Run gas reporter"
	@echo "  build_frontend  Build the frontend"
	@echo "  build_backend   Build the backend"
	@echo "  build_contract  Build contracts with Forge"
	@echo "  start           Start the frontend and backend"
	@echo "  export_pdf      Export pitch deck to PDF using Marp"
	@echo "  before_commit   Run pre-commit checks"
	@echo "  pr_diff         Show diff of a pull request"
	@echo "  help            Show this help message"

# -------------------------------
# Installation and Setup
# -------------------------------
install:           # Install npm packages
	npm install

setup_husky:       # Setup Husky for git hooks
	npm run husky

# -------------------------------
# Development
# -------------------------------
dev:
	npm run dev

# -------------------------------
# Code Quality and Formatting
# -------------------------------
clean:             # Clean the project
	npm run clean

lint:              # Run linter
	npm run lint

format:            # Format code
	npm run format

format_check:      # Check code formatting
	npm run format:check

format_contract:   # Format smart contracts
	npm run format:contract

# -------------------------------
# Testing
# -------------------------------
test_contract:     # Test smart contracts
	npm run test:contract

test:
	npm run test

# -------------------------------
# Gas Report
# -------------------------------
gas:               # Run gas reporter
	npm run gas

# -------------------------------
# Build and Deployment
# -------------------------------
build_frontend:    # Build the frontend
	cd frontend && npm run build

build_backend:     # Build the backend
	cd backend && npm run build

build_contract:    # Build contracts with Forge
	cd contract && forge build

start:             # Start the frontend and backend via concurrently
	npx concurrently "make start_frontend" "make start_backend"

start_frontend:    # Start the frontend in development mode
	cd frontend && npm run dev

start_backend:     # Start the backend in development mode
	cd backend && npm run dev

# -------------------------------
# Export Documentation
# -------------------------------
export_pdf:        # Export pitch deck to PDF using Marp
	npx marp pitch_deck.md --pdf --allow-local-files --html

# -------------------------------
# Pre-commit Checks
# -------------------------------
before_commit: lint gas format format_contract format_check test test_contract build_frontend build_backend

# -------------------------------
# Pull Request Diff
# -------------------------------
pr_diff:           # Show the diff of a pull request using GitHub CLI
	@if [ -z "$(PR)" ]; then \
		echo "Usage: make pr_diff PR=<プルリクエスト番号>"; \
		exit 1; \
	fi
	gh pr diff $(PR)
