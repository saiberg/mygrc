# ---- Build Stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy root workspace config
COPY package.json ./

# Copy portal package files
COPY apps/portal/package.json apps/portal/
COPY apps/portal/tsconfig.json apps/portal/
COPY apps/portal/tsconfig.app.json apps/portal/
COPY apps/portal/tsconfig.node.json apps/portal/
COPY apps/portal/vite.config.ts apps/portal/
COPY apps/portal/index.html apps/portal/

# Install dependencies
RUN npm install --include=dev

# Copy source code
COPY apps/portal/src apps/portal/src
COPY apps/portal/public apps/portal/public

# Build the Vite app
RUN npm run build --prefix apps/portal

# ---- Production Stage (nginx) ----
FROM nginx:alpine AS production

# Copy built files
COPY --from=build /app/apps/portal/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/portal/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
