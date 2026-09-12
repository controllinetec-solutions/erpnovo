import { useState } from 'react';
import { Search, Plus, ArrowRightLeft, CheckCircle2, Clock, Truck, Package } from 'lucide-react';

const transfers = [
  {
    id: '1',
    number: 'TR-2026-001',
    originStore: 'Loja 01 - Centro',
    destinationStore: 'Loja 02 - Bairro Norte',
    date: '2026-01-15',
    items: [
      { productId: '1', productName: 'Arroz Tipo 1 Camil 5kg', quantity: 20 },
      { productId: '2', productName: 'Feijão Carioca Kicaldo 1kg', quantity: 15 },
    ],
    status: 'completed',
    operator: 'Maria Silva',
  },
  {
    id: '2',
    number: 'TR-2026-002',
    originStore: 'Loja 01 - Centro',
    destinationStore: 'Loja 03 - Bairro Sul',
    date: '2026-01-14',
    items: [
      { productId: '7', productName: 'Leite Integral Parmalat 1L', quantity: 30 },
    ],
    status: 'in_transit',
    operator: 'Carlos Oliveira',
  },
  {
    id: '3',
    number: 'TR-2026-003',
    originStore: 'Loja 02 - Bairro Norte',
    destinationStore: 'Loja 01 - Centro',
    date: '2026-01-13',
    items: [
      { productId: '10', productName: 'Refrigerante Coca-Cola 2L', quantity: 25 },
      { productId: '3', productName: 'Açúcar Refinado União 1kg', quantity: 10 },
    ],
    status: 'pending',
    operator: 'Ana Costa',
  },
];

export default function Transfers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredTransfers = transfers.filter(t =>
    t.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.originStore.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.destinationStore.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pending = transfers.filter(t => t.status === 'pending').length;
  const inTransit = transfers.filter(t => t.status === 'in_transit').length;
  const completed = transfers.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transferências entre Lojas</h1>
          <p className="text-sm text-gray-500 mt-1">Movimentação de estoque entre filiais</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nova Transferência
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{pending}</div>
              <div className="text-sm text-gray-500">Pendentes</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-blue-50 text-blue-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{inTransit}</div>
              <div className="text-sm text-gray-500">Em Trânsito</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{completed}</div>
              <div className="text-sm text-gray-500">Concluídas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por número ou loja..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Número</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Origem</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">→</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Destino</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Data</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Itens</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Operador</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{transfer.number}</td>
                  <td className="px-4 py-3 text-gray-600">{transfer.originStore}</td>
                  <td className="px-4 py-3 text-center">
                    <ArrowRightLeft className="h-4 w-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{transfer.destinationStore}</td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {new Date(transfer.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900">{transfer.items.length}</td>
                  <td className="px-4 py-3 text-gray-600">{transfer.operator}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={transfer.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900">Nova Transferência</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loja de Origem</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Loja 01 - Centro</option>
                    <option>Loja 02 - Bairro Norte</option>
                    <option>Loja 03 - Bairro Sul</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loja de Destino</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Loja 02 - Bairro Norte</option>
                    <option>Loja 01 - Centro</option>
                    <option>Loja 03 - Bairro Sul</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Itens da Transferência</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-7">
                      <input type="text" placeholder="Produto" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-3">
                      <input type="number" placeholder="Quantidade" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                      <button className="w-full bg-red-50 text-red-600 rounded-lg py-2 text-sm hover:bg-red-100">Remover</button>
                    </div>
                  </div>
                </div>
                <button className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Adicionar Item</button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Criar Transferência</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pendente', className: 'bg-amber-50 text-amber-700' },
    in_transit: { label: 'Em Trânsito', className: 'bg-blue-50 text-blue-700' },
    completed: { label: 'Concluída', className: 'bg-emerald-50 text-emerald-700' },
    cancelled: { label: 'Cancelada', className: 'bg-red-50 text-red-700' },
  };
  const { label, className } = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
