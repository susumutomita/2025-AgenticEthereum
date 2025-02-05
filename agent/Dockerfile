# Build stage
FROM node:20-slim as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY autonome.config.json ./

RUN npm install --production

ENV NODE_ENV=production

CMD ["node", "dist/agent.js"]
