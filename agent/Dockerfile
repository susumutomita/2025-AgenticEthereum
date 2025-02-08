# --- Build Stage ---
FROM node:20-alpine AS builder

# Install build tools required for native module compilation
RUN apk add --no-cache python3 make gcc g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

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
RUN npm install --production && \
  npm cache clean --force

# Copy only the built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy entrypoint script and set execution permissions
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set production environment variables
ENV NODE_ENV=production
ENV DAEMON_PROCESS=true
ENV SERVER_PORT=3000

# Set entrypoint and command:
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/chatbot.js"]
