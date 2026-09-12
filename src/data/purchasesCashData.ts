// Dados adicionais para Compras e Caixa

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  store: string;
  date: string;
  expectedDelivery: string;
  items: PurchaseItem[];
  total: number;
  status: 'draft' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  paymentTerms: string;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
  received: number;
}

export interface CashMovement {
  id: string;
  terminalId: string;
  operator: string;
  type: 'opening' | 'closing' | 'withdrawal' | 'supply' | 'sale';
  value: number;
  description: string;
  date: string;
  paymentType?: string;
}

export interface CashRegister {
  id: string;
  terminalId: string;
  terminalName: string;
  operator: string;
  openingDate: string;
  closingDate?: string;
  openingValue: number;
  closingValue?: number;
  totalSales: number;
  totalWithdrawals: number;
  totalSupplies: number;
  expectedValue: number;
  status: 'open' | 'closed';
}

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    number: 'PC-2026-001',
    supplierId: '1',
    supplierName: 'Distribuidora ABC Ltda',
    store: 'Loja 01',
    date: '2026-01-14',
    expectedDelivery: '2026-01-16',
    items: [
      { productId: '1', productName: 'Arroz Tipo 1 Camil 5kg', quantity: 100, unitCost: 18.50, total: 1850.00, received: 100 },
      { productId: '2', productName: 'Feijão Carioca Kicaldo 1kg', quantity: 80, unitCost: 6.80, total: 544.00, received: 80 },
      { productId: '3', productName: 'Açúcar Refinado União 1kg', quantity: 60, unitCost: 3.50, total: 210.00, received: 60 },
    ],
    total: 2604.00,
    status: 'received',
    paymentTerms: '28/56 dias',
  },
  {
    id: '2',
    number: 'PC-2026-002',
    supplierId: '2',
    supplierName: 'Atacadista XYZ S.A.',
    store: 'Loja 01',
    date: '2026-01-15',
    expectedDelivery: '2026-01-17',
    items: [
      { productId: '7', productName: 'Leite Integral Parmalat 1L', quantity: 120, unitCost: 4.20, total: 504.00, received: 0 },
      { productId: '10', productName: 'Refrigerante Coca-Cola 2L', quantity: 80, unitCost: 5.50, total: 440.00, received: 0 },
    ],
    total: 944.00,
    status: 'confirmed',
    paymentTerms: 'À vista',
  },
  {
    id: '3',
    number: 'PC-2026-003',
    supplierId: '4',
    supplierName: 'Hortifrúti GHI - Produtor Rural',
    store: 'Loja 01',
    date: '2026-01-15',
    expectedDelivery: '2026-01-15',
    items: [
      { productId: '4', productName: 'Banana Prata kg', quantity: 50, unitCost: 3.20, total: 160.00, received: 30 },
      { productId: '5', productName: 'Tomate Italiano kg', quantity: 30, unitCost: 4.50, total: 135.00, received: 15 },
      { productId: '11', productName: 'Maçã Fuji kg', quantity: 40, unitCost: 5.80, total: 232.00, received: 40 },
    ],
    total: 527.00,
    status: 'partial',
    paymentTerms: 'À vista',
  },
  {
    id: '4',
    number: 'PC-2026-004',
    supplierId: '3',
    supplierName: 'Padaria e Confeitaria DEF',
    store: 'Loja 01',
    date: '2026-01-15',
    expectedDelivery: '2026-01-16',
    items: [
      { productId: '6', productName: 'Pão Francês unidade', quantity: 500, unitCost: 0.25, total: 125.00, received: 0 },
    ],
    total: 125.00,
    status: 'draft',
    paymentTerms: 'Semanal',
  },
  {
    id: '5',
    number: 'PC-2026-005',
    supplierId: '5',
    supplierName: 'Bebidas JKL Distribuição',
    store: 'Loja 02',
    date: '2026-01-13',
    expectedDelivery: '2026-01-15',
    items: [
      { productId: '10', productName: 'Refrigerante Coca-Cola 2L', quantity: 100, unitCost: 5.50, total: 550.00, received: 100 },
    ],
    total: 550.00,
    status: 'received',
    paymentTerms: '14 dias',
  },
];

export const cashRegisters: CashRegister[] = [
  {
    id: '1',
    terminalId: 'PDV 01',
    terminalName: 'PDV 01',
    operator: 'Maria Silva',
    openingDate: '2026-01-15T08:00:00',
    openingValue: 200.00,
    totalSales: 1847.60,
    totalWithdrawals: 150.00,
    totalSupplies: 50.00,
    expectedValue: 1947.60,
    status: 'open',
  },
  {
    id: '2',
    terminalId: 'PDV 02',
    terminalName: 'PDV 02',
    operator: 'Carlos Oliveira',
    openingDate: '2026-01-15T08:00:00',
    openingValue: 200.00,
    totalSales: 1245.30,
    totalWithdrawals: 100.00,
    totalSupplies: 30.00,
    expectedValue: 1375.30,
    status: 'open',
  },
  {
    id: '3',
    terminalId: 'PDV 03',
    terminalName: 'PDV 03',
    operator: 'Ana Costa',
    openingDate: '2026-01-15T08:00:00',
    closingDate: '2026-01-15T14:00:00',
    openingValue: 150.00,
    closingValue: 1128.40,
    totalSales: 985.20,
    totalWithdrawals: 50.00,
    totalSupplies: 43.20,
    expectedValue: 1128.40,
    status: 'closed',
  },
];

export const cashMovements: CashMovement[] = [
  { id: '1', terminalId: 'PDV 01', operator: 'Maria Silva', type: 'opening', value: 200.00, description: 'Abertura de caixa', date: '2026-01-15T08:00:00' },
  { id: '2', terminalId: 'PDV 01', operator: 'Maria Silva', type: 'supply', value: 50.00, description: 'Suprimento - Troco', date: '2026-01-15T09:30:00' },
  { id: '3', terminalId: 'PDV 01', operator: 'Maria Silva', type: 'sale', value: 87.50, description: 'Venda #001', date: '2026-01-15T10:15:00', paymentType: 'PIX' },
  { id: '4', terminalId: 'PDV 01', operator: 'Maria Silva', type: 'sale', value: 45.80, description: 'Venda #002', date: '2026-01-15T10:45:00', paymentType: 'Débito' },
  { id: '5', terminalId: 'PDV 01', operator: 'Maria Silva', type: 'withdrawal', value: 150.00, description: 'Sangria - Excesso de dinheiro', date: '2026-01-15T12:00:00' },
  { id: '6', terminalId: 'PDV 01', operator: 'Maria Silva', type: 'sale', value: 156.30, description: 'Venda #003', date: '2026-01-15T13:20:00', paymentType: 'Crédito' },
  { id: '7', terminalId: 'PDV 02', operator: 'Carlos Oliveira', type: 'opening', value: 200.00, description: 'Abertura de caixa', date: '2026-01-15T08:00:00' },
  { id: '8', terminalId: 'PDV 02', operator: 'Carlos Oliveira', type: 'supply', value: 30.00, description: 'Suprimento - Troco', date: '2026-01-15T09:00:00' },
  { id: '9', terminalId: 'PDV 02', operator: 'Carlos Oliveira', type: 'sale', value: 234.60, description: 'Venda #004', date: '2026-01-15T11:30:00', paymentType: 'PIX' },
  { id: '10', terminalId: 'PDV 02', operator: 'Carlos Oliveira', type: 'withdrawal', value: 100.00, description: 'Sangria', date: '2026-01-15T13:00:00' },
];
