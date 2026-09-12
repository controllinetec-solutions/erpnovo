import { useState } from 'react';
import { Search, DollarSign, ArrowDownLeft, ArrowUpRight, MinusCircle, PlusCircle, Lock, Unlock } from 'lucide-react';
import { cashRegisters, cashMovements } from '../data/purchasesCashData';

export default function Cash() {
  const [activeTab, setActiveTab] = useState<'registers' | 'movements'>('registers');
  const [searchTerm, setSearchTerm] = useState('');

  const openRegisters = cashRegisters.filter(r => r.status === 'open');
  const closedRegisters = cashRegisters.filter(r => r.status === 'closed');
  const totalSales = cashRegisters.reduce((acc, r) => acc + r.totalSales, 0);
  const totalWithdrawals = cashRegisters.reduce((acc, r) => acc + r.totalWithdrawals, 0);

  const filteredMovements = cashMovements.filter(m =>
    m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Caixa</h1>
          <p className="text-sm text-gray-500 mt-1">Abertura, fechamento e movimentações</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Unlock className="h-4 w-4" />
            Abrir Caixa
          </button>
          <button className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700">
            <Lock className="h-4 w-4" />
            Fechar Caixa
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-emerald-50 text-emerald-600">
              <Unlock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{openRegisters.length}</div>
              <div className="text-sm text-gray-500">Caixas Abertos</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-blue-50 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm text-gray-500">Total em Vendas</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-amber-50 text-amber-600">
              <MinusCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">R$ {totalWithdrawals.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm text-gray-500">Sangrias</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-purple-50 text-purple-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{closedRegisters.length}</div>
              <div className="text-sm text-gray-500">Caixas Fechados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('registers')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'registers' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Caixas ({cashRegisters.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'movements' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Movimentações ({cashMovements.length})
          </button>
        </nav>
      </div>

      {activeTab === 'registers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cashRegisters.map((register) => (
            <div key={register.id} className={`bg-white rounded-xl shadow-sm border-2 p-5 ${
              register.status === 'open' ? 'border-emerald-200' : 'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{register.terminalName}</h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      register.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {register.status === 'open' ? '🟢 Aberto' : '🔴 Fechado'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Operador: {register.operator}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Abertura:</span>
                  <span className="text-gray-900">{new Date(register.openingDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {register.closingDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fechamento:</span>
                    <span className="text-gray-900">{new Date(register.closingDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Valor Abertura:</span>
                  <span className="text-gray-900 font-medium">R$ {register.openingValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><ArrowDownLeft className="h-3 w-3 text-emerald-500" /> Vendas:</span>
                  <span className="text-emerald-600 font-medium">R$ {register.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><PlusCircle className="h-3 w-3 text-blue-500" /> Suprimentos:</span>
                  <span className="text-blue-600 font-medium">R$ {register.totalSupplies.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-amber-500" /> Sangrias:</span>
                  <span className="text-amber-600 font-medium">R$ {register.totalWithdrawals.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Valor Esperado:</span>
                  <span className="text-lg font-bold text-gray-900">R$ {register.expectedValue.toFixed(2)}</span>
                </div>
                {register.closingValue && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Valor Fechamento:</span>
                    <span className="text-lg font-bold text-gray-900">R$ {register.closingValue.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {register.status === 'open' && (
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-100">
                    Sangria
                  </button>
                  <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                    Suprimento
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar movimentação..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Data/Hora</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Terminal</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Operador</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Descrição</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(movement.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{movement.terminalId}</td>
                      <td className="px-4 py-3 text-gray-600">{movement.operator}</td>
                      <td className="px-4 py-3 text-center">
                        <MovementTypeBadge type={movement.type} />
                      </td>
                      <td className="px-4 py-3 text-gray-900">{movement.description}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${
                          movement.type === 'opening' || movement.type === 'supply' || movement.type === 'sale'
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}>
                          {movement.type === 'withdrawal' ? '-' : '+'} R$ {movement.value.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MovementTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    opening: { label: 'Abertura', className: 'bg-blue-50 text-blue-700' },
    closing: { label: 'Fechamento', className: 'bg-gray-100 text-gray-700' },
    withdrawal: { label: 'Sangria', className: 'bg-red-50 text-red-700' },
    supply: { label: 'Suprimento', className: 'bg-emerald-50 text-emerald-700' },
    sale: { label: 'Venda', className: 'bg-purple-50 text-purple-700' },
  };
  const { label, className } = config[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
