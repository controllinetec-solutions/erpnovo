// Tipos centrais do sistema ERP Lite

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  storeId: string;
  storeName: string;
  companyId: string;
  companyName: string;
  permissions: Permission[];
  active: boolean;
  lastLogin?: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

export type Permission =
  | 'products.view' | 'products.create' | 'products.edit' | 'products.delete'
  | 'stock.view' | 'stock.adjust'
  | 'sales.view' | 'sales.cancel'
  | 'finance.view' | 'finance.manage'
  | 'customers.view' | 'customers.create' | 'customers.edit'
  | 'suppliers.view' | 'suppliers.create'
  | 'reports.view'
  | 'settings.manage'
  | 'users.manage'
  | 'pdv.monitor';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Sync types
export interface SyncRequest {
  entity: SyncEntity;
  lastSyncAt?: string;
  cursor?: string;
  storeId?: string;
}

export type SyncEntity =
  | 'products'
  | 'customers'
  | 'prices'
  | 'stock'
  | 'sales'
  | 'payments'
  | 'settings';

export interface SyncResponse<T> {
  items: T[];
  cursor?: string;
  hasMore: boolean;
  serverTime: string;
}

// PDV Integration types
export interface PDVTerminal {
  id: string;
  name: string;
  storeId: string;
  token: string;
  status: 'online' | 'offline' | 'syncing' | 'error';
  lastSync: string;
  version: string;
}

export interface PDVSale {
  saleId: string;
  companyId: string;
  storeId: string;
  terminalId: string;
  operatorId: string;
  date: string;
  customerId?: string;
  items: PDVSaleItem[];
  payments: PDVPayment[];
  total: number;
  discount: number;
  idempotencyKey: string;
}

export interface PDVSaleItem {
  productId: string;
  barcode?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  isWeighable: boolean;
  weight?: number;
}

export interface PDVPayment {
  type: 'PIX' | 'DINHEIRO' | 'DEBITO' | 'CREDITO' | 'VALE';
  amount: number;
  reference?: string;
}

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}
