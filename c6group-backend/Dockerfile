FROM node:20-alpine AS builder
WORKDIR /app
COPY c6group-backend/package*.json./
COPY c6group-backend/prisma./prisma/
COPY shared./shared
COPY c6group-backend/tsconfig.json./
COPY c6group-backend/src./src/
RUN npm ci
RUN npx tsc --skipLibCheck
RUN npx prisma generate

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder /app/node_modules./node_modules
COPY --from=builder /app/dist./dist
COPY --from=builder /app/prisma./prisma
COPY --from=builder /app/package*.json./
USER nodejs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200? process.exit(0) : process.exit(1))"
CMD ["node", "dist/server.js"]
