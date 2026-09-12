import { Router } from 'express';
import { authenticateToken } from '../auth/auth.routes.js';
import { prisma } from '../../shared/database/prisma.js';

export const syncRouter = Router();
syncRouter.use(authenticateToken);

// GET /sync/queue - Ver fila de sincronização
syncRouter.get('/queue', async (req, res, next) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = String(status).toUpperCase();

    const queue = await prisma.syncQueue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, data: queue });
  } catch (error) {
    next(error);
  }
});

// GET /sync/conflicts - Ver conflitos
syncRouter.get('/conflicts', async (req, res, next) => {
  try {
    const conflicts = await prisma.syncConflict.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: conflicts });
  } catch (error) {
    next(error);
  }
});

// POST /sync/conflicts/:id/resolve - Resolver conflito
syncRouter.post('/conflicts/:id/resolve', async (req, res, next) => {
  try {
    const { resolution } = req.body; // 'server' ou 'client'

    const conflict = await prisma.syncConflict.update({
      where: { id: req.params.id },
      data: {
        resolved: true,
        resolvedBy: resolution,
        resolvedAt: new Date(),
      },
    });

    res.json({ success: true, data: conflict });
  } catch (error) {
    next(error);
  }
});

// POST /sync/force - Forçar sincronização
syncRouter.post('/force', async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;

    // Resetar status de pendentes para reprocessamento
    await prisma.syncQueue.updateMany({
      where: { status: 'ERROR', attempts: { lt: 5 } },
      data: { status: 'PENDING', attempts: { increment: 0 } },
    });

    res.json({
      success: true,
      data: { message: 'Sincronização forçada. Itens pendentes serão reprocessados.' },
    });
  } catch (error) {
    next(error);
  }
});

// GET /sync/stats - Estatísticas de sincronização
syncRouter.get('/stats', async (req, res, next) => {
  try {
    const [pending, processing, success, error] = await Promise.all([
      prisma.syncQueue.count({ where: { status: 'PENDING' } }),
      prisma.syncQueue.count({ where: { status: 'PROCESSING' } }),
      prisma.syncQueue.count({ where: { status: 'SUCCESS' } }),
      prisma.syncQueue.count({ where: { status: 'ERROR' } }),
    ]);

    const unresolvedConflicts = await prisma.syncConflict.count({ where: { resolved: false } });

    res.json({
      success: true,
      data: {
        pending,
        processing,
        success,
        error,
        unresolvedConflicts,
        total: pending + processing + success + error,
      },
    });
  } catch (error) {
    next(error);
  }
});
