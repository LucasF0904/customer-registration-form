FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/shared/package.json ./packages/shared/
ENV HUSKY=0
RUN pnpm install --frozen-lockfile --filter web... --filter @customer-reg/shared...

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY packages ./packages
COPY apps/web ./apps/web
COPY turbo.json ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build
# Fix standalone symlinks: they were created relative to apps/web/node_modules/ (3 levels from /app)
# but will be placed at /app/node_modules/ (1 level from /app). Rewrite to use .pnpm/ directly.
RUN cd /app/apps/web/.next/standalone/node_modules && \
    for link in $(ls); do \
      if [ -L "$link" ]; then \
        target=$(readlink "$link"); \
        fixed=$(echo "$target" | sed 's|^\.\./\.\./\.\./node_modules/||'); \
        ln -sfn "$fixed" "$link"; \
      fi; \
    done

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone output first (server.js + .next/ server files)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# Root node_modules overwrites standalone's broken pnpm symlinks with the full .pnpm store
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
# Static assets and public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
