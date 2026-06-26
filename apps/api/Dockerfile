# ---- Build Stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy root workspace config (npm workspaces)
COPY package.json ./

# Copy api package files
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/tsconfig.build.json apps/api/
COPY apps/api/nest-cli.json apps/api/
COPY apps/api/prisma.config.ts apps/api/

# Install all dependencies (including devDependencies for build)
# In a monorepo, npm install at root hoists everything to root node_modules
RUN npm install --include=dev

# Copy source code
COPY apps/api/prisma apps/api/prisma
COPY apps/api/src apps/api/src

# Generate Prisma client (output goes to root node_modules/.prisma in monorepo)
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

# Install production dependencies only (hoisted to root node_modules)
RUN npm install --omit=dev

# Copy Prisma schema and migrations
COPY --from=build /app/apps/api/prisma apps/api/prisma

# Copy Prisma generated client (in root node_modules due to monorepo hoisting)
COPY --from=build /app/node_modules/.prisma node_modules/.prisma

# Copy built app
COPY --from=build /app/apps/api/dist apps/api/dist

# Copy prisma config
COPY --from=build /app/apps/api/prisma.config.ts apps/api/

# Expose port (Railway uses PORT env var, default to 3000)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api || exit 1

# Start the server (NestJS outputs to dist/src/ due to sourceRoot config)
CMD ["node", "apps/api/dist/src/main.js"]
