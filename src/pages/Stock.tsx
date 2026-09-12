import { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, RefreshCw, ArrowRightLeft, AlertTriangle, TrendingDown } from 'lucide-react';
import { products, stockMovements } from '../data/mockData';

export default function Stock() {
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'adjustments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);
  const outOfStockProducts = products.filter(p => p.currentStock === 0);

  const filteredMovements = stockMovements.filter(m =>
    m.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockValue = products.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de estoque por loja</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            <ArrowDownLeft className="h-4 w-4" />
            Entrada
          </button>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            <ArrowUpRight className="h-4 w-4" />
            Saída
          </button>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            <ArrowRightLeft className="h-4 w-4" />
            Transferência
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-emerald-50 text-emerald-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">R$ {(totalStockValue / 1000).toFixed(1)}k</div>
              <div className="text-sm text-gray-500">Valor Total em Estoque</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-blue-50 text-blue-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-sm text-gray-500">Produtos Cadastrados</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{lowStockProducts.length}</div>
              <div className="text-sm text-gray-500">Estoque Baixo</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
              <div className="text-sm text-gray-500">Sem Estoque</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Posição de Estoque
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'movements'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Movimentações
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'adjustments'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Inventário
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Produto</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Loja</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Estoque Atual</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Estoque Mín.</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Estoque Máx.</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor Estoque</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const stockValue = product.costPrice * product.currentStock;
                  const isLow = product.currentStock <= product.minStock;
                  const isOut = product.currentStock === 0;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product.description}</div>
                        <div className="text-xs text-gray-500">{product.barcode}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">Loja 01</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                          {product.currentStock} {product.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">{product.minStock}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{product.minStock * 3}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        R$ {stockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isOut ? (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Sem Estoque</span>
                        ) : isLow ? (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Baixo</span>
                        ) : (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar movimentação..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Data/Hora</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Produto</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Tipo</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Quantidade</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Loja</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Origem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(movement.date).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{movement.productName}</td>
                      <td className="px-4 py-3 text-center">
                        <MovementTypeBadge type={movement.type} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${movement.type === 'entry' ? 'text-emerald-600' : movement.type === 'exit' ? 'text-red-600' : 'text-blue-600'}`}>
                          {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : ''}{movement.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{movement.store}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{movement.origin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'adjustments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 text-amber-600 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventário</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Realize a contagem física do estoque e ajuste as quantidades no sistema.
            O inventário registra todas as diferenças encontradas.
          </p>
          <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700">
            <RefreshCw className="h-4 w-4" />
            Iniciar Novo Inventário
          </button>
        </div>
      )}
    </div>
  );
}

function MovementTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    entry: { label: 'Entrada', className: 'bg-emerald-50 text-emerald-700' },
    exit: { label: 'Saída', className: 'bg-red-50 text-red-700' },
    adjustment: { label: 'Ajuste', className: 'bg-blue-50 text-blue-700' },
    transfer: { label: 'Transferência', className: 'bg-purple-50 text-purple-700' },
  };
  const { label, className } = config[type] || { label: type, className: 'bg-gray-50 text-gray-700' };
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
