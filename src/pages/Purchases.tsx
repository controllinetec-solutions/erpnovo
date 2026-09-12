import { useState } from 'react';
import { Search, Plus, Eye, Truck, Package, CheckCircle2, Clock, AlertCircle, FileText, Edit2 } from 'lucide-react';
import { purchaseOrders } from '../data/purchasesCashData';

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = purchaseOrders.filter(o => {
    const matchSearch = o.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPending = purchaseOrders.filter(o => o.status === 'confirmed' || o.status === 'draft').reduce((acc, o) => acc + o.total, 0);
  const totalReceived = purchaseOrders.filter(o => o.status === 'received').reduce((acc, o) => acc + o.total, 0);
  const partialOrders = purchaseOrders.filter(o => o.status === 'partial').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
          <p className="text-sm text-gray-500 mt-1">Pedidos de compra e entrada de mercadoria</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Novo Pedido
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</div>
              <div className="text-sm text-gray-500">Total de Pedidos</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm text-gray-500">Pedidos Pendentes</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm text-gray-500">Recebidos</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-purple-50 text-purple-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{partialOrders}</div>
              <div className="text-sm text-gray-500">Recebimento Parcial</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número ou fornecedor..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos Status</option>
            <option value="draft">Rascunho</option>
            <option value="confirmed">Confirmado</option>
            <option value="partial">Parcial</option>
            <option value="received">Recebido</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Pedido</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Fornecedor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Loja</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Data</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Entrega</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Itens</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{order.number}</div>
                    <div className="text-xs text-gray-500">{order.paymentTerms}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{order.supplierName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.store}</td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900">{order.items.length}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(order.status === 'draft' || order.status === 'confirmed') && (
                        <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail */}
      {selectedOrder && (() => {
        const order = purchaseOrders.find(o => o.id === selectedOrder);
        if (!order) return null;
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes do Pedido {order.number}</h3>
              <StatusBadge status={order.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Fornecedor:</span><span className="text-sm font-medium">{order.supplierName}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Loja:</span><span className="text-sm font-medium">{order.store}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Data do Pedido:</span><span className="text-sm font-medium">{new Date(order.date).toLocaleDateString('pt-BR')}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Previsão de Entrega:</span><span className="text-sm font-medium">{new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Condição de Pagamento:</span><span className="text-sm font-medium">{order.paymentTerms}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Total de Itens:</span><span className="text-sm font-medium">{order.items.length}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-base font-semibold">Total:</span>
                  <span className="text-lg font-bold text-emerald-600">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Produto</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Qtd. Pedida</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Qtd. Recebida</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Custo Unit.</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        {item.productName}
                      </td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={item.received < item.quantity ? 'text-amber-600 font-medium' : 'text-emerald-600'}>
                          {item.received}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">R$ {item.unitCost.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-medium">R$ {item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* New Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900">Novo Pedido de Compra</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Selecione...</option>
                    <option>Distribuidora ABC Ltda</option>
                    <option>Atacadista XYZ S.A.</option>
                    <option>Padaria e Confeitaria DEF</option>
                    <option>Hortifrúti GHI</option>
                    <option>Bebidas JKL Distribuição</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loja</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Loja 01 - Centro</option>
                    <option>Loja 02 - Bairro Norte</option>
                    <option>Loja 03 - Bairro Sul</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Entrega</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condição de Pagamento</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>À vista</option>
                    <option>14 dias</option>
                    <option>28 dias</option>
                    <option>28/56 dias</option>
                    <option>Semanal</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input type="text" placeholder="Produto" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" placeholder="Qtd" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-3">
                      <input type="number" step="0.01" placeholder="Custo Unit." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
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
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Salvar Rascunho</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Confirmar Pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-700' },
    confirmed: { label: 'Confirmado', className: 'bg-blue-50 text-blue-700' },
    partial: { label: 'Parcial', className: 'bg-amber-50 text-amber-700' },
    received: { label: 'Recebido', className: 'bg-emerald-50 text-emerald-700' },
    cancelled: { label: 'Cancelado', className: 'bg-red-50 text-red-700' },
  };
  const { label, className } = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
