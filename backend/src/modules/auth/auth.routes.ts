import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../shared/database/prisma.js';
import { UnauthorizedError, ValidationError } from '../../shared/errors/errorHandler.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'erp-lite-secret-key-change-in-production';
const JWT_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// ============================================
// POST /auth/login
// ============================================

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(validation.error.flatten().fieldErrors);
    }

    const { email, password } = validation.data;

    // Buscar usuário
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      include: {
        company: true,
        store: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    if (!user.active) {
      throw new UnauthorizedError('Usuário desativado. Contate o administrador.');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    // Gerar tokens
    const tokenPayload = {
      userId: user.id,
      companyId: user.companyId,
      storeId: user.storeId,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        companyId: user.companyId,
        userId: user.id,
        action: 'LOGIN',
        entity: 'user',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          storeId: user.storeId,
          storeName: user.store.name,
          companyId: user.companyId,
          companyName: user.company.name,
          permissions: user.permissions,
          active: user.active,
          lastLogin: user.lastLogin,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /auth/refresh
// ============================================

authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token não fornecido');
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { company: true, store: true },
    });

    if (!user || !user.active) {
      throw new UnauthorizedError('Usuário inválido ou desativado');
    }

    const tokenPayload = {
      userId: user.id,
      companyId: user.companyId,
      storeId: user.storeId,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const newRefreshToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }
    next(error);
  }
});

// ============================================
// POST /auth/logout
// ============================================

authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const companyId = (req as any).companyId;

    if (userId) {
      await prisma.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'LOGOUT',
          entity: 'user',
          entityId: userId,
          ipAddress: req.ip,
        },
      });
    }

    res.json({ success: true, data: { message: 'Logout realizado com sucesso' } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /auth/me
// ============================================

authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true, store: true },
    });

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        storeId: user.storeId,
        storeName: user.store.name,
        companyId: user.companyId,
        companyName: user.company.name,
        permissions: user.permissions,
        active: user.active,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// MIDDLEWARE: Autenticação JWT
// ============================================

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Token de acesso não fornecido'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    (req as any).companyId = decoded.companyId;
    (req as any).storeId = decoded.storeId;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    next(new UnauthorizedError('Token inválido ou expirado'));
  }
}

// ============================================
// MIDDLEWARE: Verificar permissão
// ============================================

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      // Admin tem todas as permissões
      if (user.role === 'ADMIN') {
        return next();
      }

      if (!user.permissions.includes(permission)) {
        return next(new UnauthorizedError(`Permissão negada: ${permission}`));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
