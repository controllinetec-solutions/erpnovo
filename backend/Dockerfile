# ============================================
# Dockerfile - Backend Node.js
# ============================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar Prisma Client gerado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/

# Copiar build
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expor porta
EXPOSE 3001

# Executar migrações e iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
