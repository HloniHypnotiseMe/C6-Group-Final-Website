# ============================================
# C6GROUP Backend Dockerfile
# Repository-root build context
# ============================================

FROM node:20-alpine AS dependencies

WORKDIR /app/c6group-backend

COPY c6group-backend/package*.json ./
COPY c6group-backend/prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force
RUN npx prisma generate


FROM node:20-alpine AS builder

WORKDIR /app/c6group-backend

COPY --from=dependencies /app/c6group-backend/node_modules ./node_modules
COPY --from=dependencies /app/c6group-backend/prisma ./prisma
COPY c6group-backend/package*.json ./
COPY c6group-backend/tsconfig.json ./
COPY c6group-backend/src ./src

RUN npm run build


FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs \
    /app/c6group-backend/dist ./dist/c6group-backend

COPY --from=builder --chown=nodejs:nodejs \
    /app/c6group-backend/node_modules ./node_modules

COPY --from=builder --chown=nodejs:nodejs \
    /app/c6group-backend/prisma ./prisma

COPY --from=builder --chown=nodejs:nodejs \
    /app/c6group-backend/package*.json ./

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "dist/c6group-backend/src/server.js"]
