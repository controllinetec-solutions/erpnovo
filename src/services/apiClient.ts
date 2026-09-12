/**
 * API Client - Camada de abstração para comunicação com o backend
 * 
 * Esta camada permite que o frontend funcione com dados mock durante o desenvolvimento
 * e seja facilmente conectado a um backend Node.js + PostgreSQL real.
 * 
 * Para conectar ao backend real:
 * 1. Altere USE_MOCK_DATA para false
 * 2. Configure API_BASE_URL com a URL do backend
 * 3. Implemente os métodos em apiClient.ts
 */

import type { ApiConfig, ApiResponse } from '../types';

// Configuração da API
export const API_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Flag para usar dados mock (altere para false quando backend estiver pronto)
export const USE_MOCK_DATA = true;

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private accessToken: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
    this.loadToken();
  }

  private loadToken() {
    const tokens = localStorage.getItem('erp_tokens');
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens);
        this.accessToken = parsed.accessToken;
      } catch {
        this.accessToken = null;
      }
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: error.message || 'Erro na requisição',
            details: error,
          },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: {
              code: 'TIMEOUT',
              message: 'Tempo de requisição excedido',
            },
          };
        }
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error.message,
          },
        };
      }
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Erro desconhecido',
        },
      };
    }
  }

  // Métodos públicos para cada endpoint
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
