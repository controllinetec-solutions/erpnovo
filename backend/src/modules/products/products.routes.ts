import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../shared/database/prisma.js';
import { authenticateToken, requirePermission } from '../auth/auth.routes.js';
import { NotFoundError, ValidationError } from '../../shared/errors/errorHandler.js';

export const productsRouter = Router();
productsRouter.use(authenticateToken);

// GET /products
productsRouter.get('/', requirePermission('products.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = (req as any).companyId;
    const { search, category, status, page = '1', limit = '20' } = req.query;

    const where: any = {
      store: { company: { id: companyId } },
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { description: { contains: String(search), mode: 'insensitive' } },
        { barcode: { contains: String(search) } },
        { code: { contains: String(search) } },
      ];
    }

    if (category && category !== 'all') {
      where.category = { name: String(category) };
    }

    if (status && status !== 'all') {
      where.status = String(status).toUpperCase();
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, store: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /products/:id
productsRouter.get('/:id', requirePermission('products.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = (req as any).companyId;
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, store: { company: { id: companyId } } },
      include: { category: true, brand: true, store: true },
    });

    if (!product) throw new NotFoundError('Produto');

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /products
productsRouter.post('/', requirePermission('products.create'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = (req as any).storeId;

    const schema = z.object({
      code: z.string(),
      barcode: z.string().optional(),
      description: z.string().min(3),
      shortDescription: z.string(),
      categoryId: z.string().uuid(),
      brandId: z.string().uuid().optional(),
      unit: z.string(),
      ncm: z.string(),
      costPrice: z.number().min(0),
      salePrice: z.number().min(0),
      minStock: z.number().int().min(0),
      isWeighable: z.boolean().default(false),
    });

    const data = schema.parse(req.body);
    const margin = ((data.salePrice - data.costPrice) / data.salePrice) * 100;

    const product = await prisma.product.create({
      data: {
        ...data,
        storeId,
        margin,
      },
      include: { category: true, brand: true },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.flatten().fieldErrors);
    }
    next(error);
  }
});

// PUT /products/:id
productsRouter.put('/:id', requirePermission('products.edit'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = (req as any).companyId;

    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, store: { company: { id: companyId } } },
    });

    if (!existing) throw new NotFoundError('Produto');

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE /products/:id (soft delete)
productsRouter.delete('/:id', requirePermission('products.delete'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = (req as any).companyId;

    await prisma.product.updateMany({
      where: { id: req.params.id, store: { company: { id: companyId } } },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });

    res.json({ success: true, data: { message: 'Produto desativado com sucesso' } });
  } catch (error) {
    next(error);
  }
});
