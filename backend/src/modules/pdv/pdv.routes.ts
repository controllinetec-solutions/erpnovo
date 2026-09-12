/**
 * PDV Integration Routes
 * API específica para comunicação com PDV Python
 * 
 * Endpoints:
 * POST /pdv/auth - Autenticar PDV
 * GET  /pdv/products - Obter produtos
 * GET  /pdv/products/changes - Alterações incrementais
 * GET  /pdv/customers - Obter clientes
 * POST /pdv/sales - Enviar venda (idempotente)
 * PUT  /pdv/sales/cancel - Cancelar venda
 * POST /pdv/sync - Sincronização completa
 */

import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../shared/database/prisma.js';
import { UnauthorizedError, ValidationError, ConflictError } from '../../shared/errors/errorHandler.js';

export const pdvRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'erp-lite-secret-key-change-in-production';

// ============================================
// MIDDLEWARE: Autenticação PDV (token específico)
// ============================================

async function authenticatePDV(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Token PDV não fornecido'));
  }

  try {
    const terminal = await prisma.terminal.findUnique({
      where: { token },
      include: { store: { include: { company: true } } },
    });

    if (!terminal) {
      return next(new UnauthorizedError('Token PDV inválido'));
    }

    // Atualizar último acesso
    await prisma.terminal.update({
      where: { id: terminal.id },
      data: { lastAccess: new Date(), status: 'ONLINE' },
    });

    (req as any).terminal = terminal;
    (req as any).companyId = terminal.store.companyId;
    (req as any).storeId = terminal.storeId;
    (req as any).terminalId = terminal.id;
    next();
  } catch (error) {
    next(error);
  }
}

// ============================================
// POST /pdv/auth - Autenticar PDV
// ============================================

pdvRouter.post('/auth', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      terminalToken: z.string(),
      pdvVersion: z.string(),
    });

    const { terminalToken, pdvVersion } = schema.parse(req.body);

    const terminal = await prisma.terminal.findUnique({
      where: { token: terminalToken },
      include: { store: { include: { company: true } } },
    });

    if (!terminal) {
      throw new UnauthorizedError('Terminal não encontrado');
    }

    // Atualizar versão e status
    await prisma.terminal.update({
      where: { id: terminal.id },
      data: { pdvVersion, status: 'ONLINE', lastAccess: new Date() },
    });

    // Gerar token JWT para o PDV
    const pdvToken = jwt.sign({
      terminalId: terminal.id,
      storeId: terminal.storeId,
      companyId: terminal.store.companyId,
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      data: {
        token: pdvToken,
        terminal: {
          id: terminal.id,
          name: terminal.name,
          storeId: terminal.storeId,
          storeName: terminal.store.name,
          companyId: terminal.store.companyId,
          companyName: terminal.store.company.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /pdv/products - Obter produtos (com paginação)
// ============================================

pdvRouter.get('/products', authenticatePDV, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = (req as any).storeId;
    const { cursor, limit = '100' } = req.query;

    const products = await prisma.product.findMany({
      where: { storeId, status: 'ACTIVE', deletedAt: null },
      include: { category: true, brand: true },
      take: Number(limit),
      ...(cursor && { cursor: { id: String(cursor) }, skip: 1 }),
      orderBy: { id: 'asc' },
    });

    const nextCursor = products.length === Number(limit) ? products[products.length - 1].id : null;

    res.json({
      success: true,
      data: {
        items: products,
        cursor: nextCursor,
        hasMore: !!nextCursor,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /pdv/products/changes - Alterações incrementais
// ============================================

pdvRouter.get('/products/changes', authenticatePDV, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = (req as any).storeId;
    const { since } = req.query;

    if (!since) {
      throw new ValidationError({ since: 'Parâmetro "since" é obrigatório' });
    }

    const sinceDate = new Date(String(since));

    // Produtos alterados
    const updated = await prisma.product.findMany({
      where: {
        storeId,
        updatedAt: { gt: sinceDate },
        deletedAt: null,
      },
      include: { category: true, brand: true },
    });

    // Produtos deletados (soft delete)
    const deleted = await prisma.product.findMany({
      where: {
        storeId,
        deletedAt: { gt: sinceDate },
      },
      select: { id: true, deletedAt: true },
    });

    res.json({
      success: true,
      data: {
        updated,
        deleted: deleted.map(d => d.id),
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /pdv/customers - Obter clientes
// ============================================

pdvRouter.get('/customers', authenticatePDV, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = (req as any).companyId;

    const customers = await prisma.customer.findMany({
      where: { companyId, active: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: {
        items: customers,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /pdv/sales - Enviar venda (IDEMPOTENTE)
// ============================================

const saleSchema = z.object({
  saleId: z.string().uuid(),
  terminalId: z.string(),
  operatorId: z.string(),
  date: z.string().datetime(),
  customerId: z.string().uuid().nullable().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    barcode: z.string().optional(),
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().min(0),
    discount: z.number().min(0).default(0),
    total: z.number().min(0),
    isWeighable: z.boolean().default(false),
    weight: z.number().optional(),
  })),
  payments: z.array(z.object({
    type: z.enum(['DINHEIRO', 'PIX', 'DEBITO', 'CREDITO', 'VALE', 'OUTROS']),
    amount: z.number().min(0),
    reference: z.string().optional(),
  })),
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0),
  idempotencyKey: z.string().uuid(),
});

pdvRouter.post('/sales', authenticatePDV, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = (req as any).storeId;
    const terminalId = (req as any).terminalId;

    const data = saleSchema.parse(req.body);

    // IDEMPOTÊNCIA: Verificar se a venda já foi registrada
    const existingSale = await prisma.sale.findUnique({
      where: { saleId: data.saleId },
    });

    if (existingSale) {
      // Venda já existe - retornar a existente (idempotente)
      return res.json({
        success: true,
        data: {
          sale: existingSale,
          message: 'Venda já registrada (idempotente)',
          duplicated: true,
        },
      });
    }

    // Criar venda com todos os itens e pagamentos
    const sale = await prisma.sale.create({
      data: {
        saleId: data.saleId,
        storeId,
        terminalId,
        operatorId: data.operatorId,
        customerId: data.customerId || null,
        date: new Date(data.date),
        subtotal: data.subtotal,
        discount: data.discount,
        total: data.total,
        status: 'COMPLETED',
        synced: true,
        syncDate: new Date(),
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            description: item.description,
            barcode: item.barcode,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.total,
            isWeighable: item.isWeighable,
            weight: item.weight,
          })),
        },
        payments: {
          create: data.payments.map(payment => ({
            type: payment.type,
            amount: payment.amount,
            reference: payment.reference,
          })),
        },
      },
      include: { items: true, payments: true },
    });

    // Atualizar estoque
    for (const item of data.items) {
      const stockItem = await prisma.stockItem.findUnique({
        where: { storeId_productId: { storeId, productId: item.productId } },
      });

      if (stockItem) {
        const newQty = Number(stockItem.quantity) - item.quantity;

        await prisma.stockItem.update({
          where: { id: stockItem.id },
          data: { quantity: newQty },
        });

        // Registrar movimentação
        await prisma.stockMovement.create({
          data: {
            stockItemId: stockItem.id,
            type: 'EXIT_SALE',
            quantity: item.quantity,
            previousQty: stockItem.quantity,
            newQty,
            origin: `Venda ${data.saleId}`,
            referenceId: sale.id,
          },
        });
      }
    }

    // Atualizar terminal
    await prisma.terminal.update({
      where: { id: terminalId },
      data: { lastSync: new Date(), status: 'ONLINE' },
    });

    res.status(201).json({
      success: true,
      data: {
        sale,
        duplicated: false,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.flatten().fieldErrors);
    }
    next(error);
  }
});

// ============================================
// PUT /pdv/sales/cancel - Cancelar venda
// ============================================

pdvRouter.put('/sales/cancel', authenticatePDV, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { saleId, reason } = req.body;

    const sale = await prisma.sale.findUnique({
      where: { saleId },
      include: { items: true },
    });

    if (!sale) {
      throw new ConflictError('Venda não encontrada');
    }

    if (sale.status === 'CANCELLED') {
      return res.json({
        success: true,
        data: { sale, message: 'Venda já cancelada (idempotente)' },
      });
    }

    // Cancelar venda
    await prisma.sale.update({
      where: { id: sale.id },
      data: { status: 'CANCELLED' },
    });

    // Estornar estoque
    for (const item of sale.items) {
      const stockItem = await prisma.stockItem.findUnique({
        where: { storeId_productId: { storeId: sale.storeId, productId: item.productId } },
      });

      if (stockItem) {
        const newQty = Number(stockItem.quantity) + Number(item.quantity);

        await prisma.stockItem.update({
          where: { id: stockItem.id },
          data: { quantity: newQty },
        });

        await prisma.stockMovement.create({
          data: {
            stockItemId: stockItem.id,
            type: 'ENTRY_RETURN',
            quantity: item.quantity,
            previousQty: stockItem.quantity,
            newQty,
            origin: `Cancelamento venda ${saleId} - ${reason || 'Sem motivo'}`,
            referenceId: sale.id,
          },
        });
      }
    }

    res.json({ success: true, data: { message: 'Venda cancelada com sucesso' } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /pdv/sync - Sincronização completa
// ============================================

pdvRouter.post('/sync', authenticatePDV, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const terminalId = (req as any).terminalId;
    const { lastSyncAt } = req.body;

    const since = lastSyncAt ? new Date(lastSyncAt) : new Date(0);

    const [products, customers, prices] = await Promise.all([
      prisma.product.findMany({
        where: { storeId: (req as any).storeId, updatedAt: { gt: since }, deletedAt: null },
        include: { category: true },
      }),
      prisma.customer.findMany({
        where: { companyId: (req as any).companyId, active: true, updatedAt: { gt: since } },
      }),
      prisma.product.findMany({
        where: { storeId: (req as any).storeId, updatedAt: { gt: since }, deletedAt: null },
        select: { id: true, salePrice: true, updatedAt: true },
      }),
    ]);

    // Atualizar terminal
    await prisma.terminal.update({
      where: { id: terminalId },
      data: { lastSync: new Date(), status: 'ONLINE', syncCursor: new Date().toISOString() },
    });

    res.json({
      success: true,
      data: {
        products,
        customers,
        priceChanges: prices,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});
