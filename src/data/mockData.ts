// Mock Data for ERP Lite

export interface Product {
  id: string;
  code: string;
  barcode: string;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  unit: string;
  ncm: string;
  costPrice: number;
  salePrice: number;
  margin: number;
  minStock: number;
  currentStock: number;
  isWeighable: boolean;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface Sale {
  id: string;
  saleId: string;
  storeId: string;
  terminalId: string;
  operator: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  paymentType: string;
  status: 'completed' | 'cancelled' | 'pending';
  synced: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit' | 'adjustment' | 'transfer';
  quantity: number;
  store: string;
  date: string;
  origin: string;
}

export interface Terminal {
  id: string;
  name: string;
  store: string;
  status: 'online' | 'syncing' | 'offline' | 'error';
  lastSync: string;
  pdvVersion: string;
  pendingSales: number;
  lastAccess: string;
}

export interface FinancialEntry {
  id: string;
  type: 'payable' | 'receivable';
  description: string;
  entity: string;
  dueDate: string;
  value: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  totalPurchases: number;
  lastPurchase: string;
}

export interface Supplier {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  totalPurchases: number;
  lastPurchase: string;
}

export const products: Product[] = [
  { id: '1', code: '001', barcode: '7891000100103', description: 'Arroz Tipo 1 Camil 5kg', shortDescription: 'Arroz Camil 5kg', category: 'Mercearia', brand: 'Camil', unit: 'UN', ncm: '10063021', costPrice: 18.50, salePrice: 24.90, margin: 25.7, minStock: 20, currentStock: 45, isWeighable: false, status: 'active', updatedAt: '2026-01-15T10:30:00' },
  { id: '2', code: '002', barcode: '7891000200209', description: 'Feijão Carioca Kicaldo 1kg', shortDescription: 'Feijão Kicaldo 1kg', category: 'Mercearia', brand: 'Kicaldo', unit: 'UN', ncm: '07133319', costPrice: 6.80, salePrice: 9.90, margin: 31.3, minStock: 30, currentStock: 12, isWeighable: false, status: 'active', updatedAt: '2026-01-15T09:00:00' },
  { id: '3', code: '003', barcode: '7891000300305', description: 'Açúcar Refinado União 1kg', shortDescription: 'Açúcar União 1kg', category: 'Mercearia', brand: 'União', unit: 'UN', ncm: '17019900', costPrice: 3.50, salePrice: 5.49, margin: 36.2, minStock: 25, currentStock: 60, isWeighable: false, status: 'active', updatedAt: '2026-01-14T16:00:00' },
  { id: '4', code: '004', barcode: '2000001000000', description: 'Banana Prata kg', shortDescription: 'Banana Prata', category: 'Hortifrúti', brand: '-', unit: 'KG', ncm: '08030000', costPrice: 3.20, salePrice: 5.99, margin: 46.6, minStock: 10, currentStock: 25, isWeighable: true, status: 'active', updatedAt: '2026-01-15T08:00:00' },
  { id: '5', code: '005', barcode: '2000002000000', description: 'Tomate Italiano kg', shortDescription: 'Tomate Italiano', category: 'Hortifrúti', brand: '-', unit: 'KG', ncm: '07020000', costPrice: 4.50, salePrice: 8.99, margin: 49.9, minStock: 8, currentStock: 5, isWeighable: true, status: 'active', updatedAt: '2026-01-15T07:30:00' },
  { id: '6', code: '006', barcode: '7891000600602', description: 'Pão Francês unidade', shortDescription: 'Pão Francês', category: 'Padaria', brand: '-', unit: 'UN', ncm: '19059090', costPrice: 0.25, salePrice: 0.60, margin: 58.3, minStock: 100, currentStock: 200, isWeighable: false, status: 'active', updatedAt: '2026-01-15T06:00:00' },
  { id: '7', code: '007', barcode: '7891000700708', description: 'Leite Integral Parmalat 1L', shortDescription: 'Leite Parmalat 1L', category: 'Laticínios', brand: 'Parmalat', unit: 'UN', ncm: '04011010', costPrice: 4.20, salePrice: 5.99, margin: 29.9, minStock: 40, currentStock: 85, isWeighable: false, status: 'active', updatedAt: '2026-01-14T14:00:00' },
  { id: '8', code: '008', barcode: '7891000800804', description: 'Óleo de Soja Liza 900ml', shortDescription: 'Óleo Liza 900ml', category: 'Mercearia', brand: 'Liza', unit: 'UN', ncm: '15079011', costPrice: 5.80, salePrice: 7.99, margin: 27.4, minStock: 15, currentStock: 3, isWeighable: false, status: 'active', updatedAt: '2026-01-15T11:00:00' },
  { id: '9', code: '009', barcode: '7891000900900', description: 'Café Pilão Torrado 500g', shortDescription: 'Café Pilão 500g', category: 'Mercearia', brand: 'Pilão', unit: 'UN', ncm: '09012100', costPrice: 11.50, salePrice: 16.90, margin: 32.0, minStock: 20, currentStock: 38, isWeighable: false, status: 'active', updatedAt: '2026-01-14T10:00:00' },
  { id: '10', code: '010', barcode: '7891001001007', description: 'Refrigerante Coca-Cola 2L', shortDescription: 'Coca-Cola 2L', category: 'Bebidas', brand: 'Coca-Cola', unit: 'UN', ncm: '22021000', costPrice: 5.50, salePrice: 8.49, margin: 35.2, minStock: 24, currentStock: 48, isWeighable: false, status: 'active', updatedAt: '2026-01-15T12:00:00' },
  { id: '11', code: '011', barcode: '2000003000000', description: 'Maçã Fuji kg', shortDescription: 'Maçã Fuji', category: 'Hortifrúti', brand: '-', unit: 'KG', ncm: '08081000', costPrice: 5.80, salePrice: 9.90, margin: 41.4, minStock: 10, currentStock: 18, isWeighable: true, status: 'active', updatedAt: '2026-01-15T07:00:00' },
  { id: '12', code: '012', barcode: '7891001201200', description: 'Sabonete Dove Original 90g', shortDescription: 'Sabonete Dove', category: 'Higiene', brand: 'Dove', unit: 'UN', ncm: '34012090', costPrice: 2.10, salePrice: 3.99, margin: 47.4, minStock: 30, currentStock: 55, isWeighable: false, status: 'active', updatedAt: '2026-01-13T15:00:00' },
];

export const sales: Sale[] = [
  { id: '1', saleId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', storeId: 'Loja 01', terminalId: 'PDV 01', operator: 'Maria Silva', date: '2026-01-15T14:30:00', customer: 'Consumidor Final', items: 5, total: 87.50, paymentType: 'PIX', status: 'completed', synced: true },
  { id: '2', saleId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', storeId: 'Loja 01', terminalId: 'PDV 01', operator: 'Maria Silva', date: '2026-01-15T14:15:00', customer: 'João Santos', items: 3, total: 45.80, paymentType: 'Débito', status: 'completed', synced: true },
  { id: '3', saleId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', storeId: 'Loja 01', terminalId: 'PDV 02', operator: 'Carlos Oliveira', date: '2026-01-15T13:45:00', customer: 'Consumidor Final', items: 8, total: 156.30, paymentType: 'Crédito', status: 'completed', synced: true },
  { id: '4', saleId: 'd4e5f6a7-b8c9-0123-defa-234567890123', storeId: 'Loja 02', terminalId: 'PDV 03', operator: 'Ana Costa', date: '2026-01-15T13:20:00', customer: 'Consumidor Final', items: 2, total: 23.90, paymentType: 'Dinheiro', status: 'completed', synced: true },
  { id: '5', saleId: 'e5f6a7b8-c9d0-1234-efab-345678901234', storeId: 'Loja 01', terminalId: 'PDV 01', operator: 'Maria Silva', date: '2026-01-15T12:50:00', customer: 'Maria Ferreira', items: 12, total: 234.60, paymentType: 'PIX', status: 'completed', synced: true },
  { id: '6', saleId: 'f6a7b8c9-d0e1-2345-fabc-456789012345', storeId: 'Loja 02', terminalId: 'PDV 03', operator: 'Ana Costa', date: '2026-01-15T12:30:00', customer: 'Consumidor Final', items: 4, total: 67.80, paymentType: 'Débito', status: 'completed', synced: false },
  { id: '7', saleId: 'a7b8c9d0-e1f2-3456-abcd-567890123456', storeId: 'Loja 01', terminalId: 'PDV 02', operator: 'Carlos Oliveira', date: '2026-01-15T11:45:00', customer: 'Pedro Lima', items: 6, total: 98.40, paymentType: 'Crédito', status: 'completed', synced: true },
  { id: '8', saleId: 'b8c9d0e1-f2a3-4567-bcde-678901234567', storeId: 'Loja 01', terminalId: 'PDV 01', operator: 'Maria Silva', date: '2026-01-15T11:20:00', customer: 'Consumidor Final', items: 3, total: 34.50, paymentType: 'Dinheiro', status: 'cancelled', synced: true },
  { id: '9', saleId: 'c9d0e1f2-a3b4-5678-cdef-789012345678', storeId: 'Loja 02', terminalId: 'PDV 04', operator: 'Roberto Santos', date: '2026-01-15T10:50:00', customer: 'Consumidor Final', items: 7, total: 142.30, paymentType: 'PIX', status: 'completed', synced: false },
  { id: '10', saleId: 'd0e1f2a3-b4c5-6789-defa-890123456789', storeId: 'Loja 01', terminalId: 'PDV 01', operator: 'Maria Silva', date: '2026-01-15T10:15:00', customer: 'Lucia Mendes', items: 4, total: 56.70, paymentType: 'Débito', status: 'completed', synced: true },
];

export const stockMovements: StockMovement[] = [
  { id: '1', productId: '1', productName: 'Arroz Tipo 1 Camil 5kg', type: 'entry', quantity: 50, store: 'Loja 01', date: '2026-01-15T08:00:00', origin: 'NF-e #12345 - Fornecedor ABC' },
  { id: '2', productId: '4', productName: 'Banana Prata kg', type: 'entry', quantity: 30, store: 'Loja 01', date: '2026-01-15T07:00:00', origin: 'Compra Direta - Produtor Rural' },
  { id: '3', productId: '2', productName: 'Feijão Carioca Kicaldo 1kg', type: 'exit', quantity: 8, store: 'Loja 01', date: '2026-01-15T14:30:00', origin: 'Venda PDV 01' },
  { id: '4', productId: '5', productName: 'Tomate Italiano kg', type: 'exit', quantity: 3, store: 'Loja 01', date: '2026-01-15T13:20:00', origin: 'Venda PDV 02' },
  { id: '5', productId: '8', productName: 'Óleo de Soja Liza 900ml', type: 'adjustment', quantity: -2, store: 'Loja 01', date: '2026-01-14T17:00:00', origin: 'Ajuste de Inventário' },
  { id: '6', productId: '6', productName: 'Pão Francês unidade', type: 'entry', quantity: 200, store: 'Loja 01', date: '2026-01-15T06:00:00', origin: 'Produção Interna - Padaria' },
  { id: '7', productId: '7', productName: 'Leite Integral Parmalat 1L', type: 'transfer', quantity: 20, store: 'Loja 02', date: '2026-01-14T16:00:00', origin: 'Transferência Loja 01 → Loja 02' },
  { id: '8', productId: '10', productName: 'Refrigerante Coca-Cola 2L', type: 'exit', quantity: 12, store: 'Loja 01', date: '2026-01-15T12:00:00', origin: 'Venda PDV 01' },
];

export const terminals: Terminal[] = [
  { id: '1', name: 'PDV 01', store: 'Loja 01 - Centro', status: 'online', lastSync: '2026-01-15T14:32:00', pdvVersion: '2.5.1', pendingSales: 0, lastAccess: '2026-01-15T14:32:00' },
  { id: '2', name: 'PDV 02', store: 'Loja 01 - Centro', status: 'online', lastSync: '2026-01-15T14:28:00', pdvVersion: '2.5.1', pendingSales: 0, lastAccess: '2026-01-15T14:28:00' },
  { id: '3', name: 'PDV 03', store: 'Loja 02 - Bairro Norte', status: 'syncing', lastSync: '2026-01-15T14:30:00', pdvVersion: '2.5.0', pendingSales: 2, lastAccess: '2026-01-15T14:30:00' },
  { id: '4', name: 'PDV 04', store: 'Loja 02 - Bairro Norte', status: 'offline', lastSync: '2026-01-15T11:48:00', pdvVersion: '2.5.0', pendingSales: 23, lastAccess: '2026-01-15T11:48:00' },
  { id: '5', name: 'PDV 05', store: 'Loja 03 - Bairro Sul', status: 'error', lastSync: '2026-01-15T13:15:00', pdvVersion: '2.4.8', pendingSales: 5, lastAccess: '2026-01-15T13:15:00' },
];

export const financialEntries: FinancialEntry[] = [
  { id: '1', type: 'payable', description: 'Fornecedor ABC - NF 12345', entity: 'Distribuidora ABC', dueDate: '2026-01-20', value: 4500.00, status: 'pending' },
  { id: '2', type: 'payable', description: 'Fornecedor XYZ - NF 67890', entity: 'Atacadista XYZ', dueDate: '2026-01-18', value: 2800.00, status: 'pending' },
  { id: '3', type: 'payable', description: 'Aluguel Loja 01', entity: 'Imobiliária Central', dueDate: '2026-01-10', value: 3500.00, status: 'overdue' },
  { id: '4', type: 'payable', description: 'Energia Elétrica - Janeiro', entity: 'CEMIG', dueDate: '2026-01-25', value: 1200.00, status: 'pending' },
  { id: '5', type: 'receivable', description: 'Vendas Cartão - Lote 001', entity: 'Cielo', dueDate: '2026-01-22', value: 12450.00, status: 'pending' },
  { id: '6', type: 'receivable', description: 'Vendas Cartão - Lote 002', entity: 'Stone', dueDate: '2026-01-20', value: 8900.00, status: 'pending' },
  { id: '7', type: 'payable', description: 'Folha de Pagamento - Janeiro', entity: 'Funcionários', dueDate: '2026-02-05', value: 18500.00, status: 'pending' },
  { id: '8', type: 'payable', description: 'Fornecedor DEF - NF 11223', entity: 'Padaria DEF', dueDate: '2026-01-12', value: 1800.00, status: 'overdue' },
  { id: '9', type: 'receivable', description: 'Vendas PIX - Janeiro 1ª quinzena', entity: 'Banco do Brasil', dueDate: '2026-01-16', value: 6780.00, status: 'paid', paidDate: '2026-01-16' },
  { id: '10', type: 'payable', description: 'Internet e Telefone', entity: 'Vivo Empresas', dueDate: '2026-01-15', value: 450.00, status: 'paid', paidDate: '2026-01-15' },
];

export const customers: Customer[] = [
  { id: '1', name: 'João Santos', document: '123.456.789-00', phone: '(31) 99999-1234', email: 'joao@email.com', address: 'Rua das Flores, 123 - Centro', totalPurchases: 2340.50, lastPurchase: '2026-01-15' },
  { id: '2', name: 'Maria Ferreira', document: '987.654.321-00', phone: '(31) 98888-5678', email: 'maria@email.com', address: 'Av. Brasil, 456 - Bairro Norte', totalPurchases: 5670.80, lastPurchase: '2026-01-15' },
  { id: '3', name: 'Pedro Lima', document: '456.789.123-00', phone: '(31) 97777-9012', email: 'pedro@email.com', address: 'Rua Minas Gerais, 789 - Bairro Sul', totalPurchases: 1230.40, lastPurchase: '2026-01-14' },
  { id: '4', name: 'Lucia Mendes', document: '321.654.987-00', phone: '(31) 96666-3456', email: 'lucia@email.com', address: 'Rua São Paulo, 321 - Centro', totalPurchases: 890.20, lastPurchase: '2026-01-15' },
  { id: '5', name: 'Carlos Eduardo', document: '654.321.987-00', phone: '(31) 95555-7890', email: 'carlos@email.com', address: 'Av. Afonso Pena, 654 - Centro', totalPurchases: 3450.00, lastPurchase: '2026-01-13' },
];

export const suppliers: Supplier[] = [
  { id: '1', name: 'Distribuidora ABC Ltda', document: '12.345.678/0001-90', phone: '(31) 3333-1234', email: 'comercial@abc.com.br', city: 'Belo Horizonte', state: 'MG', totalPurchases: 45000.00, lastPurchase: '2026-01-15' },
  { id: '2', name: 'Atacadista XYZ S.A.', document: '98.765.432/0001-10', phone: '(31) 3333-5678', email: 'vendas@xyz.com.br', city: 'Contagem', state: 'MG', totalPurchases: 32000.00, lastPurchase: '2026-01-14' },
  { id: '3', name: 'Padaria e Confeitaria DEF', document: '45.678.912/0001-30', phone: '(31) 3333-9012', email: 'contato@def.com.br', city: 'Belo Horizonte', state: 'MG', totalPurchases: 8900.00, lastPurchase: '2026-01-15' },
  { id: '4', name: 'Hortifrúti GHI - Produtor Rural', document: '123.456.789-00', phone: '(31) 99999-3456', email: 'ghi@produtor.com', city: 'Santa Bárbara', state: 'MG', totalPurchases: 12500.00, lastPurchase: '2026-01-15' },
  { id: '5', name: 'Bebidas JKL Distribuição', document: '67.891.234/0001-50', phone: '(31) 3333-7890', email: 'pedidos@jkl.com.br', city: 'Betim', state: 'MG', totalPurchases: 28000.00, lastPurchase: '2026-01-13' },
];

export const dashboardData = {
  todaySales: 3847.60,
  todaySalesCount: 48,
  averageTicket: 80.16,
  monthRevenue: 127450.00,
  lastMonthRevenue: 118200.00,
  pendingReceivables: 28130.00,
  pendingPayables: 32250.00,
  lowStockProducts: 3,
  onlineTerminals: 3,
  totalTerminals: 5,
  salesByDay: [
    { day: 'Seg', value: 4200 },
    { day: 'Ter', value: 3800 },
    { day: 'Qua', value: 5100 },
    { day: 'Qui', value: 4600 },
    { day: 'Sex', value: 6200 },
    { day: 'Sáb', value: 7800 },
    { day: 'Dom', value: 3100 },
  ],
  salesByCategory: [
    { name: 'Mercearia', value: 35 },
    { name: 'Hortifrúti', value: 22 },
    { name: 'Padaria', value: 18 },
    { name: 'Bebidas', value: 12 },
    { name: 'Laticínios', value: 8 },
    { name: 'Higiene', value: 5 },
  ],
  topProducts: [
    { name: 'Pão Francês', qty: 450, revenue: 270.00 },
    { name: 'Arroz Camil 5kg', qty: 85, revenue: 2116.50 },
    { name: 'Leite Parmalat 1L', qty: 120, revenue: 718.80 },
    { name: 'Coca-Cola 2L', qty: 95, revenue: 806.55 },
    { name: 'Banana Prata', qty: 65, revenue: 389.35 },
  ],
};
