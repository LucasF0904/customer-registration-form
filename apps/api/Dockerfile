FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile --filter api... --filter @customer-reg/shared...

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY packages ./packages
COPY apps/api ./apps/api
COPY turbo.json ./
RUN pnpm --filter api build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libstdc++ wget
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

EXPOSE 3001
CMD ["node", "dist/main"]
