# BraveVest API — production image (AWS-friendly)
FROM node:20-alpine AS base
RUN apk add --no-cache openssl curl
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS prisma
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma
COPY package*.json ./
COPY prisma ./prisma
COPY src ./src
RUN mkdir -p uploads logs && chown -R node:node /app
USER node
EXPOSE 3001
HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=5 CMD curl -fsS http://localhost:3001/health || exit 1
CMD ["node", "src/server.js"]
