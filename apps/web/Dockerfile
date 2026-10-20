# ==========================================
# Stage 1: Build the Web Client with Node & PNPM
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace configurations
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy web client source code & public assets
COPY apps/web/ ./apps/web/

# Build production bundle with TypeScript check & Vite
RUN pnpm --filter @placement/web run build

# ==========================================
# Stage 2: Serve with Nginx Alpine
# ==========================================
FROM nginx:alpine AS runner

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets from builder stage
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
