# --- Build Stage ---
FROM node:20-alpine AS builder

# Install build tools required for native module compilation
RUN apk add --no-cache python3 make gcc g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code (output in ./dist)
RUN npm run build && \
  # Remove build tools to reduce image size (optional, if not needed further)
  apk del python3 make gcc g++

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy package files (if needed for runtime scripts)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
  # Remove npm cache to reduce image size
  npm cache clean --force

# Copy only the built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Set production environment
ENV NODE_ENV=production

# Optionally, use the --squash flag during build to flatten layers (requires Docker BuildKit enabled)
# e.g., DOCKER_BUILDKIT=1 docker build --squash -t <image> .

# Run the chatbot application
CMD ["node", "dist/chatbot.js"]
