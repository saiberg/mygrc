# ---- Build Stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy root workspace config
COPY package.json ./

# Copy api package files
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/tsconfig.build.json apps/api/
COPY apps/api/nest-cli.json apps/api/
COPY apps/api/prisma.config.ts apps/api/

# Install all dependencies (including devDependencies for build)
RUN npm install --include=dev

# Copy source code
COPY apps/api/prisma apps/api/prisma
COPY apps/api/src apps/api/src

# Generate Prisma client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build NestJS
RUN npm run build --prefix apps/api

# ---- Production Stage ----
FROM node:22-alpine AS production
WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy api package.json
COPY apps/api/package.json apps/api/

# Install production dependencies only
RUN npm install --omit=dev

# Copy Prisma schema and migrations
COPY --from=build /app/apps/api/prisma apps/api/prisma
COPY --from=build /app/node_modules/.prisma node_modules/.prisma
COPY --from=build /app/apps/api/node_modules/.prisma apps/api/node_modules/.prisma

# Copy built app
COPY --from=build /app/apps/api/dist apps/api/dist

# Copy prisma config
COPY --from=build /app/apps/api/prisma.config.ts apps/api/

# Expose port (Railway uses PORT env var, default to 3000)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api || exit 1

# Start the server
CMD ["node", "apps/api/dist/main.js"]
