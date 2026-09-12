import { useState } from 'react';
import { Search, Plus, ArrowDownLeft, ArrowUpRight, DollarSign, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { financialEntries } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'all' | 'payable' | 'receivable'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const payables = financialEntries.filter(e => e.type === 'payable');
  const receivables = financialEntries.filter(e => e.type === 'receivable');
  
  const totalPayable = payables.filter(e => e.status !== 'paid').reduce((acc, e) => acc + e.value, 0);
  const totalReceivable = receivables.filter(e => e.status !== 'paid').reduce((acc, e) => acc + e.value, 0);
  const overduePayable = payables.filter(e => e.status === 'overdue').reduce((acc, e) => acc + e.value, 0);
  const overdueReceivable = receivables.filter(e => e.status === 'overdue').reduce((acc, e) => acc + e.value, 0);

  const filteredEntries = financialEntries.filter(e => {
    const matchType = activeTab === 'all' || e.type === activeTab;
    const matchSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.entity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const cashFlowData = [
    { month: 'Out', entradas: 98000, saidas: 82000 },
    { month: 'Nov', entradas: 105000, saidas: 88000 },
    { month: 'Dez', entradas: 142000, saidas: 110000 },
    { month: 'Jan', entradas: 127000, saidas: 95000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500 mt-1">Contas a pagar, receber e fluxo de caixa</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Nova Entrada
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <span className="text-sm text-gray-500">Contas a Receber</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-400 mt-1">{receivables.filter(e => e.status !== 'paid').length} títulos pendentes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-red-50 text-red-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-sm text-gray-500">Contas a Pagar</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-400 mt-1">{payables.filter(e => e.status !== 'paid').length} títulos pendentes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-sm text-gray-500">Vencidas</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            R$ {(overduePayable + overdueReceivable).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-400 mt-1">Atenção: títulos em atraso</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-sm text-gray-500">Saldo Previsto</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            R$ {(totalReceivable - totalPayable).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-400 mt-1">Receitas - Despesas</div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fluxo de Caixa</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-gray-600">Entradas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <span className="text-gray-600">Saídas</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`]} />
            <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} name="Entradas" />
            <Bar dataKey="saidas" fill="#f87171" radius={[4, 4, 0, 0]} name="Saídas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Todos ({financialEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('receivable')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'receivable' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            A Receber ({receivables.length})
          </button>
          <button
            onClick={() => setActiveTab('payable')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'payable' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            A Pagar ({payables.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar lançamento..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Entries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Descrição</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Entidade</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Vencimento</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{entry.description}</td>
                  <td className="px-4 py-3 text-gray-600">{entry.entity}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      entry.type === 'receivable' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {entry.type === 'receivable' ? 'Receber' : 'Pagar'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(entry.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${entry.type === 'receivable' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {entry.type === 'receivable' ? '+' : '-'} R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'paid' ? 'bg-gray-100 text-gray-700' :
                      entry.status === 'overdue' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {entry.status === 'paid' ? 'Pago' : entry.status === 'overdue' ? 'Vencido' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.status !== 'paid' && (
                      <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                        Baixar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
