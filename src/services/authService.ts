/**
 * Auth Service - Serviço de autenticação
 * 
 * Implementa autenticação com dados mock para desenvolvimento.
 * Quando o backend estiver pronto, basta alterar USE_MOCK_DATA para false.
 * 
 * Backend esperado:
 * POST /api/v1/auth/login
 * POST /api/v1/auth/refresh
 * POST /api/v1/auth/logout
 * GET  /api/v1/auth/me
 */

import { apiClient, USE_MOCK_DATA } from './apiClient';
import type { User, LoginCredentials, LoginResponse, AuthTokens } from '../types';

// Usuários mock para desenvolvimento
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@erplite.com.br': {
    password: 'admin123',
    user: {
      id: 'usr-001',
      name: 'Admin Master',
      email: 'admin@erplite.com.br',
      role: 'admin',
      storeId: 'store-001',
      storeName: 'Loja 01 - Centro',
      companyId: 'comp-001',
      companyName: 'Mercado Silva Ltda',
      permissions: [
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'stock.view', 'stock.adjust',
        'sales.view', 'sales.cancel',
        'finance.view', 'finance.manage',
        'customers.view', 'customers.create', 'customers.edit',
        'suppliers.view', 'suppliers.create',
        'reports.view',
        'settings.manage',
        'users.manage',
        'pdv.monitor',
      ],
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
  'gerente@erplite.com.br': {
    password: 'gerente123',
    user: {
      id: 'usr-002',
      name: 'Maria Silva',
      email: 'gerente@erplite.com.br',
      role: 'manager',
      storeId: 'store-001',
      storeName: 'Loja 01 - Centro',
      companyId: 'comp-001',
      companyName: 'Mercado Silva Ltda',
      permissions: [
        'products.view', 'products.create', 'products.edit',
        'stock.view', 'stock.adjust',
        'sales.view', 'sales.cancel',
        'finance.view',
        'customers.view', 'customers.create', 'customers.edit',
        'suppliers.view',
        'reports.view',
        'pdv.monitor',
      ],
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
  'operador@erplite.com.br': {
    password: 'operador123',
    user: {
      id: 'usr-003',
      name: 'Carlos Oliveira',
      email: 'operador@erplite.com.br',
      role: 'operator',
      storeId: 'store-001',
      storeName: 'Loja 01 - Centro',
      companyId: 'comp-001',
      companyName: 'Mercado Silva Ltda',
      permissions: [
        'products.view',
        'stock.view',
        'sales.view',
        'customers.view',
      ],
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
};

function generateMockToken(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

export const authService = {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (USE_MOCK_DATA) {
      return this.loginMock(credentials);
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao realizar login');
    }

    this.saveTokens(response.data.tokens);
    return response.data;
  },

  /**
   * Login com dados mock
   */
  async loginMock(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[credentials.email.toLowerCase()];

    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('E-mail ou senha inválidos');
    }

    if (!mockUser.user.active) {
      throw new Error('Usuário desativado. Contate o administrador.');
    }

    const tokens: AuthTokens = {
      accessToken: generateMockToken(),
      refreshToken: generateMockToken(),
      expiresIn: 3600, // 1 hora
    };

    const response: LoginResponse = {
      user: {
        ...mockUser.user,
        lastLogin: new Date().toISOString(),
      },
      tokens,
    };

    this.saveTokens(tokens);
    localStorage.setItem('erp_user', JSON.stringify(response.user));

    return response;
  },

  /**
   * Renova os tokens de acesso
   */
  async refreshToken(): Promise<AuthTokens> {
    const stored = localStorage.getItem('erp_tokens');
    if (!stored) {
      throw new Error('Sessão expirada');
    }

    const current = JSON.parse(stored);

    if (USE_MOCK_DATA) {
      const newTokens: AuthTokens = {
        accessToken: generateMockToken(),
        refreshToken: generateMockToken(),
        expiresIn: 3600,
      };
      this.saveTokens(newTokens);
      return newTokens;
    }

    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refreshToken: current.refreshToken,
    });

    if (!response.success || !response.data) {
      throw new Error('Erro ao renovar sessão');
    }

    this.saveTokens(response.data);
    return response.data;
  },

  /**
   * Realiza logout
   */
  async logout(): Promise<void> {
    if (!USE_MOCK_DATA) {
      await apiClient.post('/auth/logout').catch(() => {});
    }

    localStorage.removeItem('erp_tokens');
    localStorage.removeItem('erp_user');
    apiClient.setAccessToken(null);
  },

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem('erp_user');
    if (!stored) return null;

    if (USE_MOCK_DATA) {
      return JSON.parse(stored);
    }

    const response = await apiClient.get<User>('/auth/me');
    if (!response.success || !response.data) return null;

    localStorage.setItem('erp_user', JSON.stringify(response.data));
    return response.data;
  },

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const tokens = localStorage.getItem('erp_tokens');
    return !!tokens;
  },

  /**
   * Salva os tokens no localStorage
   */
  saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('erp_tokens', JSON.stringify(tokens));
    apiClient.setAccessToken(tokens.accessToken);
  },

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUserSync();
    if (!user) return false;
    return user.permissions.includes(permission as never);
  },

  /**
   * Obtém o usuário atual de forma síncrona
   */
  getCurrentUserSync(): User | null {
    const stored = localStorage.getItem('erp_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
};
