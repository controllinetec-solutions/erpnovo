import { Router } from 'express';
import { authenticateToken, requirePermission } from '../auth/auth.routes.js';
import { prisma } from '../../shared/database/prisma.js';

// ============================================
// SALES ROUTER
// ============================================
export const salesRouter = Router();
salesRouter.use(authenticateToken);

salesRouter.get('/', requirePermission('sales.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const { page = '1', limit = '20', status } = req.query;

    const where: any = { store: { company: { id: companyId } } };
    if (status) where.status = String(status).toUpperCase();

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: { items: true, payments: true },
        orderBy: { date: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.sale.count({ where }),
    ]);

    res.json({ success: true, data: sales, meta: { page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// STOCK ROUTER
// ============================================
export const stockRouter = Router();
stockRouter.use(authenticateToken);

stockRouter.get('/movements', requirePermission('stock.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const movements = await prisma.stockMovement.findMany({
      where: { stockItem: { store: { company: { id: companyId } } } },
      include: { stockItem: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
});

stockRouter.get('/', requirePermission('stock.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const items = await prisma.stockItem.findMany({
      where: { store: { company: { id: companyId } } },
      include: { product: true },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CUSTOMERS ROUTER
// ============================================
export const customersRouter = Router();
customersRouter.use(authenticateToken);

customersRouter.get('/', requirePermission('customers.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const { search } = req.query;
    const where: any = { companyId, active: true };
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { document: { contains: String(search) } },
      ];
    }
    const customers = await prisma.customer.findMany({ where, orderBy: { name: 'asc' } });
    res.json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
});

customersRouter.post('/', requirePermission('customers.create'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const customer = await prisma.customer.create({ data: { ...req.body, companyId } });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

// ============================================
// SUPPLIERS ROUTER
// ============================================
export const suppliersRouter = Router();
suppliersRouter.use(authenticateToken);

suppliersRouter.get('/', requirePermission('suppliers.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const suppliers = await prisma.supplier.findMany({ where: { companyId, active: true } });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
});

suppliersRouter.post('/', requirePermission('suppliers.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const supplier = await prisma.supplier.create({ data: { ...req.body, companyId } });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

// ============================================
// FINANCE ROUTER
// ============================================
export const financeRouter = Router();
financeRouter.use(authenticateToken);

financeRouter.get('/entries', requirePermission('finance.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const { type, status } = req.query;
    const where: any = { companyId };
    if (type) where.type = String(type).toUpperCase();
    if (status) where.status = String(status).toUpperCase();
    const entries = await prisma.financialEntry.findMany({ where, orderBy: { dueDate: 'asc' } });
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PURCHASES ROUTER
// ============================================
export const purchasesRouter = Router();
purchasesRouter.use(authenticateToken);

purchasesRouter.get('/', requirePermission('products.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const orders = await prisma.purchaseOrder.findMany({
      where: { companyId },
      include: { supplier: true, items: true },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CASH ROUTER
// ============================================
export const cashRouter = Router();
cashRouter.use(authenticateToken);

cashRouter.get('/registers', requirePermission('sales.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const registers = await prisma.cashRegister.findMany({
      where: { terminal: { store: { company: { id: companyId } } } },
      orderBy: { openingDate: 'desc' },
    });
    res.json({ success: true, data: registers });
  } catch (error) {
    next(error);
  }
});

// ============================================
// TERMINALS ROUTER
// ============================================
export const terminalsRouter = Router();
terminalsRouter.use(authenticateToken);

terminalsRouter.get('/', requirePermission('pdv.monitor'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const terminals = await prisma.terminal.findMany({
      where: { store: { company: { id: companyId } } },
      include: { store: true },
    });
    res.json({ success: true, data: terminals });
  } catch (error) {
    next(error);
  }
});

// ============================================
// DASHBOARD ROUTER
// ============================================
export const dashboardRouter = Router();
dashboardRouter.use(authenticateToken);

dashboardRouter.get('/', async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaySales, totalSales, lowStock, terminals] = await Promise.all([
      prisma.sale.findMany({
        where: { store: { company: { id: companyId } }, date: { gte: today }, status: 'COMPLETED' },
      }),
      prisma.sale.aggregate({
        where: { store: { company: { id: companyId } }, date: { gte: new Date(today.getFullYear(), today.getMonth(), 1) } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.stockItem.count({
        where: {
          store: { company: { id: companyId } },
          product: { status: 'ACTIVE' },
        },
      }),
      prisma.terminal.findMany({
        where: { store: { company: { id: companyId } } },
      }),
    ]);

    const todayTotal = todaySales.reduce((acc, s) => acc + Number(s.total), 0);

    res.json({
      success: true,
      data: {
        todaySales: todayTotal,
        todaySalesCount: todaySales.length,
        averageTicket: todaySales.length > 0 ? todayTotal / todaySales.length : 0,
        monthRevenue: Number(totalSales._sum.total || 0),
        monthSalesCount: totalSales._count,
        lowStockProducts: lowStock,
        onlineTerminals: terminals.filter(t => t.status === 'ONLINE').length,
        totalTerminals: terminals.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// FISCAL ROUTER
// ============================================
export const fiscalRouter = Router();
fiscalRouter.use(authenticateToken);

fiscalRouter.get('/documents', requirePermission('sales.view'), async (req, res, next) => {
  try {
    const companyId = (req as any).companyId;
    const documents = await prisma.fiscalDocument.findMany({
      where: { companyId },
      orderBy: { issuedAt: 'desc' },
      take: 100,
    });
    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
});
