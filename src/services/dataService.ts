/**
 * Data Service - Simula chamadas ao backend
 * 
 * Este serviço simula chamadas HTTP ao backend Node.js + PostgreSQL.
 * Quando o backend estiver pronto, basta alterar USE_MOCK_DATA para false
 * e implementar as chamadas reais em cada método.
 */

import { USE_MOCK_DATA } from './apiClient';
import { apiClient } from './apiClient';
import {
  products,
  sales,
  stockMovements,
  terminals,
  financialEntries,
  customers,
  suppliers,
  dashboardData,
} from '../data/mockData';
import type { ApiResponse } from '../types';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  // Dashboard
  async getDashboard(): Promise<ApiResponse<typeof dashboardData>> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: dashboardData };
    }
    return apiClient.get('/dashboard');
  },

  // Products
  async getProducts(params?: { search?: string; category?: string }): Promise<ApiResponse<typeof products>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      let filtered = [...products];
      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.description.toLowerCase().includes(search) ||
          p.barcode.includes(search) ||
          p.code.includes(search)
        );
      }
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      return { success: true, data: filtered };
    }
    return apiClient.get(`/products?${new URLSearchParams(params as any)}`);
  },

  async getProduct(id: string): Promise<ApiResponse<typeof products[0]>> {
    if (USE_MOCK_DATA) {
      await delay(100);
      const product = products.find(p => p.id === id);
      if (!product) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Produto não encontrado' } };
      }
      return { success: true, data: product };
    }
    return apiClient.get(`/products/${id}`);
  },

  async createProduct(data: any): Promise<ApiResponse<typeof products[0]>> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: { ...data, id: `prod-${Date.now()}` } };
    }
    return apiClient.post('/products', data);
  },

  async updateProduct(id: string, data: any): Promise<ApiResponse<typeof products[0]>> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: { ...data, id } };
    }
    return apiClient.put(`/products/${id}`, data);
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { success: true };
    }
    return apiClient.delete(`/products/${id}`);
  },

  // Sales
  async getSales(params?: { search?: string; status?: string }): Promise<ApiResponse<typeof sales>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      let filtered = [...sales];
      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.operator.toLowerCase().includes(search) ||
          s.customer.toLowerCase().includes(search) ||
          s.saleId.includes(search)
        );
      }
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter(s => s.status === params.status);
      }
      return { success: true, data: filtered };
    }
    return apiClient.get(`/sales?${new URLSearchParams(params as any)}`);
  },

  // Stock
  async getStockMovements(): Promise<ApiResponse<typeof stockMovements>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { success: true, data: stockMovements };
    }
    return apiClient.get('/stock/movements');
  },

  // Terminals
  async getTerminals(): Promise<ApiResponse<typeof terminals>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { success: true, data: terminals };
    }
    return apiClient.get('/terminals');
  },

  // Finance
  async getFinancialEntries(params?: { type?: string }): Promise<ApiResponse<typeof financialEntries>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      let filtered = [...financialEntries];
      if (params?.type && params.type !== 'all') {
        filtered = filtered.filter(e => e.type === params.type);
      }
      return { success: true, data: filtered };
    }
    return apiClient.get(`/finance/entries?${new URLSearchParams(params as any)}`);
  },

  // Customers
  async getCustomers(params?: { search?: string }): Promise<ApiResponse<typeof customers>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      let filtered = [...customers];
      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(search) ||
          c.document.includes(search) ||
          c.phone.includes(search)
        );
      }
      return { success: true, data: filtered };
    }
    return apiClient.get(`/customers?${new URLSearchParams(params as any)}`);
  },

  async createCustomer(data: any): Promise<ApiResponse<typeof customers[0]>> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: { ...data, id: `cust-${Date.now()}` } };
    }
    return apiClient.post('/customers', data);
  },

  // Suppliers
  async getSuppliers(params?: { search?: string }): Promise<ApiResponse<typeof suppliers>> {
    if (USE_MOCK_DATA) {
      await delay(200);
      let filtered = [...suppliers];
      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(search) ||
          s.document.includes(search)
        );
      }
      return { success: true, data: filtered };
    }
    return apiClient.get(`/suppliers?${new URLSearchParams(params as any)}`);
  },

  async createSupplier(data: any): Promise<ApiResponse<typeof suppliers[0]>> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { success: true, data: { ...data, id: `supp-${Date.now()}` } };
    }
    return apiClient.post('/suppliers', data);
  },
};
