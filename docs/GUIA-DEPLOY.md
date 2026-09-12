# 🚀 Guia de Deploy - ERP Lite

## 📋 Opções de Deploy

### 1. Docker Compose (Recomendado para Produção)

A forma mais simples e completa de deploy.

#### Pré-requisitos

- Docker 20+
- Docker Compose 2+
- Domínio configurado (opcional)
- Certificado SSL (recomendado)

#### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd erp-lite

# 2. Configure as variáveis de ambiente
cp .env.example .env
nano .env

# 3. Build e start
docker-compose up -d --build

# 4. Verifique os logs
docker-compose logs -f

# 5. Execute as migrações do banco (primeira vez)
docker-compose exec backend npx prisma migrate deploy

# 6. Crie o usuário admin (seed)
docker-compose exec backend npx tsx prisma/seed.ts
```

#### Acessando

- **Frontend**: http://localhost (ou seu domínio)
- **Backend API**: http://localhost:3001/api/v1
- **pgAdmin**: http://localhost:5050 (perfil tools)

---

### 2. Vercel (Frontend) + Railway (Backend)

Deploy separado, ideal para escalabilidade.

#### Frontend na Vercel

```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Faça login
vercel login

# 3. Deploy
vercel --prod

# 4. Configure as variáveis de ambiente no dashboard da Vercel
# VITE_API_URL = https://seu-backend.railway.app/api/v1
```

#### Backend no Railway

1. Crie conta em https://railway.app
2. Conecte seu repositório GitHub
3. Railway detectará automaticamente o Node.js
4. Adicione PostgreSQL como serviço
5. Configure as variáveis de ambiente:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave-secreta-forte
FRONTEND_URL=https://seu-app.vercel.app
PORT=3001
```

6. Deploy automático a cada push

---

### 3. AWS (EC2 + RDS)

Para controle total da infraestrutura.

#### Arquitetura

```
┌─────────────────┐
│   Route 53      │ ← DNS
└────────┬────────┘
         │
┌────────▼────────┐
│   CloudFront    │ ← CDN + SSL
└────────┬────────┘
         │
┌────────▼────────┐     ┌─────────────┐
│   S3 + React    │     │   RDS       │ ← PostgreSQL
└─────────────────┘     └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │   EC2       │ ← Backend Node.js
                        └─────────────┘
```

#### Passos

```bash
# 1. Crie uma instância EC2 (Ubuntu 22.04)
# 2. Configure security groups (porta 80, 443, 3001)
# 3. SSH na instância
ssh -i sua-chave.pem ubuntu@seu-ip

# 4. Instale Docker
sudo apt update
sudo apt install docker.io docker-compose -y

# 5. Clone o repositório
git clone <url> && cd erp-lite

# 6. Configure .env e suba os containers
docker-compose up -d

# 7. Configure Nginx como reverse proxy (opcional)
```

#### RDS PostgreSQL

1. Crie instância RDS PostgreSQL 16
2. Configure security group para permitir EC2
3. Copie a string de conexão
4. Atualize DATABASE_URL no backend

---

### 4. DigitalOcean (App Platform)

Solução PaaS simplificada.

#### Frontend

1. Crie um Static Site no App Platform
2. Conecte ao repositório GitHub
3. Build command: `npm run build`
4. Output directory: `dist`

#### Backend

1. Crie um Service no App Platform
2. Conecte ao repositório GitHub
3. Run command: `npm start`
4. Adicione PostgreSQL como componente

---

## 🔒 SSL/HTTPS

### Com Docker Compose + Let's Encrypt

```yaml
# Adicione ao docker-compose.yml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html

  acme-companion:
    image: nginxproxy/acme-companion
    volumes_from:
      - nginx-proxy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - acme:/etc/acme.sh
    environment:
      - DEFAULT_EMAIL=seu@email.com
```

### Com Vercel/Railway

SSL é configurado automaticamente.

---

## 📊 Monitoramento

### Health Checks

```bash
# Frontend
curl http://localhost/health

# Backend
curl http://localhost:3001/health
```

### Logs

```bash
# Todos os serviços
docker-compose logs -f

# Backend apenas
docker-compose logs -f backend

# PostgreSQL
docker-compose logs -f postgres
```

### Backup Automático

```bash
# Script de backup diário
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

docker-compose exec -T postgres pg_dump -U erp_user erp_lite | gzip > $BACKUP_DIR/erp_lite_$DATE.sql.gz

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

Adicione ao crontab:
```bash
0 3 * * * /path/to/backup.sh
```

---

## 🔧 Manutenção

### Atualizações

```bash
# 1. Pull das últimas alterações
git pull origin main

# 2. Rebuild e restart
docker-compose up -d --build

# 3. Execute migrações (se houver)
docker-compose exec backend npx prisma migrate deploy
```

### Reset do Banco (Desenvolvimento)

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recria tudo do zero
```

### Escalabilidade

Para aumentar a capacidade:

1. **Backend**: Aumente réplicas no Docker Compose
2. **Banco**: Vertical scaling (mais CPU/RAM) ou read replicas
3. **Frontend**: CDN (CloudFront/Cloudflare)

---

## 🚨 Troubleshooting

### Backend não inicia

```bash
# Verifique os logs
docker-compose logs backend

# Verifique a conexão com o banco
docker-compose exec backend npx prisma db push

# Verifique as variáveis de ambiente
docker-compose exec backend env | grep DATABASE
```

### Frontend não acessa API

```bash
# Verifique se o backend está rodando
curl http://localhost:3001/health

# Verifique CORS no backend
# Verifique VITE_API_URL no frontend
```

### Banco de dados lento

```bash
# Analise queries lentas
docker-compose exec postgres psql -U erp_user -d erp_lite -c "SELECT * FROM pg_stat_activity;"

# Crie índices (se necessário)
# Verifique EXPLAIN ANALYZE das queries
```

---

## 📝 Checklist de Deploy

### Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET forte (mínimo 32 caracteres)
- [ ] DATABASE_URL configurada
- [ ] FRONTEND_URL correta
- [ ] Certificado SSL (produção)
- [ ] Backup automático configurado
- [ ] Monitoramento ativo

### Pós-Deploy

- [ ] Testar login
- [ ] Testar CRUD de produtos
- [ ] Testar vendas
- [ ] Testar sincronização PDV
- [ ] Verificar logs de erro
- [ ] Configurar alertas
- [ ] Documentar credenciais

---

## 🆘 Suporte

Para problemas no deploy:

1. Verifique os logs
2. Consulte a documentação
3. Abra uma issue no GitHub
4. Entre em contato com o suporte

---

**ERP Lite** - Deploy simplificado! 🚀
