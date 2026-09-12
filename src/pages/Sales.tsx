import { useState } from 'react';
import { Search, Filter, Eye, XCircle, CheckCircle2, Clock, CreditCard, Banknote, QrCode } from 'lucide-react';
import { sales } from '../data/mockData';

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<string | null>(null);

  const filteredSales = sales.filter(s => {
    const matchSearch = s.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.saleId.includes(searchTerm) || s.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalToday = sales.filter(s => s.status === 'completed').reduce((acc, s) => acc + s.total, 0);
  const cancelledToday = sales.filter(s => s.status === 'cancelled').reduce((acc, s) => acc + s.total, 0);
  const pendingSync = sales.filter(s => !s.synced).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de vendas do PDV</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Total Vendas Hoje</div>
          <div className="text-2xl font-bold text-emerald-600">R$ {totalToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400 mt-1">{sales.filter(s => s.status === 'completed').length} vendas</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Ticket Médio</div>
          <div className="text-2xl font-bold text-gray-900">R$ {(totalToday / sales.filter(s => s.status === 'completed').length).toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Últimas 24 horas</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Cancelamentos</div>
          <div className="text-2xl font-bold text-red-600">R$ {cancelledToday.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">{sales.filter(s => s.status === 'cancelled').length} vendas canceladas</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Pendentes Sync</div>
          <div className="text-2xl font-bold text-amber-600">{pendingSync}</div>
          <div className="text-xs text-gray-400 mt-1">Aguardando sincronização</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por operador, cliente ou ID da venda..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos Status</option>
              <option value="completed">Concluídas</option>
              <option value="cancelled">Canceladas</option>
              <option value="pending">Pendentes</option>
            </select>
            <button className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ID Venda</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Data/Hora</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Operador</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">PDV / Loja</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Cliente</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Itens</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Pagamento</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Sync</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {sale.saleId.substring(0, 8)}...
                    </code>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(sale.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{sale.operator}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{sale.terminalId}</div>
                    <div className="text-xs text-gray-500">{sale.storeId}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{sale.customer}</td>
                  <td className="px-4 py-3 text-center text-gray-900">{sale.items}</td>
                  <td className="px-4 py-3">
                    <PaymentBadge type={sale.paymentType} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    R$ {sale.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={sale.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {sale.synced ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedSale(selectedSale === sale.id ? null : sale.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {sale.status === 'completed' && (
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Mostrando {filteredSales.length} de {sales.length} vendas
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white">Anterior</button>
            <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white">Próximo</button>
          </div>
        </div>
      </div>

      {/* Sale Detail Panel */}
      {selectedSale && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Venda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID da Venda:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                  {sales.find(s => s.id === selectedSale)?.saleId}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Data:</span>
                <span className="text-sm text-gray-900">{new Date(sales.find(s => s.id === selectedSale)?.date || '').toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Operador:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">PDV:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.terminalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Loja:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.storeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cliente:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.customer}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Itens:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.items} itens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pagamento:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <StatusBadge status={sales.find(s => s.id === selectedSale)?.status || 'completed'} />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Sincronizado:</span>
                <span className="text-sm text-gray-900">{sales.find(s => s.id === selectedSale)?.synced ? '✅ Sim' : '⏳ Pendente'}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-700">Total:</span>
                  <span className="text-xl font-bold text-emerald-600">
                    R$ {sales.find(s => s.id === selectedSale)?.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; className: string }> = {
    'PIX': { icon: <QrCode className="h-3 w-3" />, className: 'bg-emerald-50 text-emerald-700' },
    'Débito': { icon: <CreditCard className="h-3 w-3" />, className: 'bg-blue-50 text-blue-700' },
    'Crédito': { icon: <CreditCard className="h-3 w-3" />, className: 'bg-purple-50 text-purple-700' },
    'Dinheiro': { icon: <Banknote className="h-3 w-3" />, className: 'bg-amber-50 text-amber-700' },
  };
  const { icon, className } = config[type] || { icon: null, className: 'bg-gray-50 text-gray-700' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {icon} {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    completed: { label: 'Concluída', className: 'bg-emerald-50 text-emerald-700' },
    cancelled: { label: 'Cancelada', className: 'bg-red-50 text-red-700' },
    pending: { label: 'Pendente', className: 'bg-amber-50 text-amber-700' },
  };
  const { label, className } = config[status] || { label: status, className: 'bg-gray-50 text-gray-700' };
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
