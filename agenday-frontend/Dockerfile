# ============================================================
# Agenday Frontend – Dockerfile de Produção
# Build com Vite e serve via Nginx estático
# ============================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .

# Vite lê .env.production automaticamente com NODE_ENV=production
RUN npm run build

# Stage 2: Serve
FROM nginx:1.27-alpine AS runner

# Copia o build gerado pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Config Nginx para SPA (React Router)
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
