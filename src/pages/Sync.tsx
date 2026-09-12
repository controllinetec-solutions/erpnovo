import { RefreshCw, CheckCircle2, Clock, AlertTriangle, ArrowRight, ArrowLeft, Server, Shield, Zap } from 'lucide-react';

const syncLog = [
  { id: '1', direction: 'erp_to_pdv', entity: 'Produtos', records: 12, status: 'success', timestamp: '2026-01-15T14:32:00', duration: '234ms' },
  { id: '2', direction: 'pdv_to_erp', entity: 'Vendas', records: 3, status: 'success', timestamp: '2026-01-15T14:30:00', duration: '156ms' },
  { id: '3', direction: 'erp_to_pdv', entity: 'Preços', records: 5, status: 'success', timestamp: '2026-01-15T14:28:00', duration: '89ms' },
  { id: '4', direction: 'pdv_to_erp', entity: 'Vendas', records: 2, status: 'error', timestamp: '2026-01-15T14:25:00', duration: '5023ms', error: 'Timeout - conexão instável' },
  { id: '5', direction: 'erp_to_pdv', entity: 'Clientes', records: 1, status: 'success', timestamp: '2026-01-15T14:20:00', duration: '67ms' },
  { id: '6', direction: 'erp_to_pdv', entity: 'Estoque', records: 8, status: 'success', timestamp: '2026-01-15T14:15:00', duration: '312ms' },
  { id: '7', direction: 'pdv_to_erp', entity: 'Pagamentos', records: 3, status: 'success', timestamp: '2026-01-15T14:10:00', duration: '145ms' },
  { id: '8', direction: 'erp_to_pdv', entity: 'Configurações', records: 2, status: 'success', timestamp: '2026-01-15T14:00:00', duration: '78ms' },
];

export default function Sync() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sincronização</h1>
          <p className="text-sm text-gray-500 mt-1">Controle e monitoramento da sincronização ERP ↔ PDV</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700">
          <RefreshCw className="h-4 w-4" />
          Forçar Sincronização
        </button>
      </div>

      {/* Sync Strategy Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-emerald-50 text-emerald-600">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">ERP → PDV</div>
              <div className="text-xs text-gray-500">Dados administrativos</div>
            </div>
          </div>
          <ul className="text-xs text-gray-600 space-y-1 ml-10">
            <li>• Produtos e alterações</li>
            <li>• Preços atualizados</li>
            <li>• Estoque consolidado</li>
            <li>• Clientes</li>
            <li>• Configurações</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-blue-50 text-blue-600">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">PDV → ERP</div>
              <div className="text-xs text-gray-500">Dados operacionais</div>
            </div>
          </div>
          <ul className="text-xs text-gray-600 space-y-1 ml-10">
            <li>• Vendas realizadas</li>
            <li>• Itens da venda</li>
            <li>• Pagamentos</li>
            <li>• Cancelamentos/Devoluções</li>
            <li>• Movimentações de caixa</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg p-2.5 bg-purple-50 text-purple-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Garantias</div>
              <div className="text-xs text-gray-500">Integridade dos dados</div>
            </div>
          </div>
          <ul className="text-xs text-gray-600 space-y-1 ml-10">
            <li>• ✅ Idempotência (UUID)</li>
            <li>• ✅ Sincronização incremental</li>
            <li>• ✅ Fila com retry automático</li>
            <li>• ✅ Operação offline</li>
            <li>• ✅ Auditoria de conflitos</li>
          </ul>
        </div>
      </div>

      {/* Sync Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">98.5%</div>
          <div className="text-xs text-gray-500 mt-1">Taxa de Sucesso</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">156ms</div>
          <div className="text-xs text-gray-500 mt-1">Tempo Médio</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">1,247</div>
          <div className="text-xs text-gray-500 mt-1">Syncs Hoje</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">3</div>
          <div className="text-xs text-gray-500 mt-1">Pendentes</div>
        </div>
      </div>

      {/* Sync Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Log de Sincronização</h3>
          <p className="text-sm text-gray-500">Últimas operações de sincronização</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Horário</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Direção</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Entidade</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Registros</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Duração</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {syncLog.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {log.direction === 'erp_to_pdv' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        <ArrowRight className="h-3 w-3" /> ERP → PDV
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                        <ArrowLeft className="h-3 w-3" /> PDV → ERP
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{log.entity}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{log.records}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-gray-500">{log.duration}</td>
                  <td className="px-4 py-3 text-center">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Sucesso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700" title={log.error}>
                        <AlertTriangle className="h-4 w-4" /> Erro
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Sincronização Offline</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col items-center gap-3 text-sm">
            <div className="flex items-center gap-3 bg-blue-100 px-4 py-2 rounded-lg">
              <Server className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">PDV Python (Local)</span>
            </div>
            <div className="text-gray-400">↓</div>
            <div className="flex items-center gap-3 bg-amber-100 px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-800">Fila de Sincronização</span>
            </div>
            <div className="text-gray-400">↓</div>
            <div className="flex items-center gap-3 bg-purple-100 px-4 py-2 rounded-lg">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">Internet Disponível?</span>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="text-emerald-600 font-medium">SIM ✓</div>
                <div className="text-gray-400">↓</div>
                <div className="bg-emerald-100 px-4 py-2 rounded-lg">
                  <span className="font-medium text-emerald-800">API ERP → Confirmação</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-red-600 font-medium">NÃO ✗</div>
                <div className="text-gray-400">↓</div>
                <div className="bg-red-100 px-4 py-2 rounded-lg">
                  <span className="font-medium text-red-800">Aguarda na fila</span>
                </div>
                <div className="text-gray-400">↓</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="font-medium text-gray-800">Retry automático</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
