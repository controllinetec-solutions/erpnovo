import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import { authRouter } from './modules/auth/auth.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import {
  salesRouter, stockRouter, customersRouter, suppliersRouter,
  financeRouter, purchasesRouter, cashRouter, terminalsRouter,
  dashboardRouter, fiscalRouter
} from './modules/routes.js';
import { pdvRouter } from './modules/pdv/pdv.routes.js';
import { syncRouter } from './modules/sync/sync.routes.js';
import { errorHandler } from './shared/errors/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARES
// ============================================

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requisições por janela
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
});
app.use('/api/', limiter);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================
// API ROUTES
// ============================================

const API_PREFIX = '/api/v1';

// Autenticação
app.use(`${API_PREFIX}/auth`, authRouter);

// Módulos administrativos
app.use(`${API_PREFIX}/products`, productsRouter);
app.use(`${API_PREFIX}/sales`, salesRouter);
app.use(`${API_PREFIX}/stock`, stockRouter);
app.use(`${API_PREFIX}/customers`, customersRouter);
app.use(`${API_PREFIX}/suppliers`, suppliersRouter);
app.use(`${API_PREFIX}/finance`, financeRouter);
app.use(`${API_PREFIX}/purchases`, purchasesRouter);
app.use(`${API_PREFIX}/cash`, cashRouter);
app.use(`${API_PREFIX}/terminals`, terminalsRouter);
app.use(`${API_PREFIX}/dashboard`, dashboardRouter);
app.use(`${API_PREFIX}/fiscal`, fiscalRouter);

// Integração PDV
app.use(`${API_PREFIX}/pdv`, pdvRouter);

// Sincronização
app.use(`${API_PREFIX}/sync`, syncRouter);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota não encontrada: ${req.method} ${req.path}`,
    },
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 ERP Lite Backend - Servidor Iniciado!              ║
║                                                          ║
║   📍 Porta: ${PORT}                                       ║
║   🌐 Ambiente: ${(process.env.NODE_ENV || 'development').padEnd(14)}                    ║
║   🔗 URL: http://localhost:${PORT}                        ║
║   📚 API: http://localhost:${PORT}${API_PREFIX}           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

export default app;
