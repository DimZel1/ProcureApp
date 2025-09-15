# Production Dockerfile (Postgres-first, App Platform friendly)

# 1) Install deps using only package*.json so COPY works on DO
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# prefer clean installs when lockfile exists, fall back to npm i
RUN npm ci --ignore-scripts || npm i --ignore-scripts

# 2) Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# 3) Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# copy runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Run DB migrations, then start Next in production
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]