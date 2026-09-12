import { Monitor, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Clock, Server, Activity } from 'lucide-react';
import { terminals, sales } from '../data/mockData';

export default function PDVMonitor() {
  const onlineCount = terminals.filter(t => t.status === 'online').length;
  const syncingCount = terminals.filter(t => t.status === 'syncing').length;
  const offlineCount = terminals.filter(t => t.status === 'offline').length;
  const errorCount = terminals.filter(t => t.status === 'error').length;
  const totalPending = terminals.reduce((acc, t) => acc + t.pendingSales, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoramento PDV</h1>
          <p className="text-sm text-gray-500 mt-1">Status dos terminais e sincronização em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Activity className="h-4 w-4" />
            Monitoramento Ativo
          </span>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{terminals.length}</div>
          <div className="text-sm text-gray-500 mt-1">Total PDVs</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600">{onlineCount}</div>
          <div className="text-sm text-emerald-600 mt-1">🟢 Online</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">{syncingCount}</div>
          <div className="text-sm text-yellow-600 mt-1">🟡 Sincronizando</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-500">{offlineCount}</div>
          <div className="text-sm text-gray-500 mt-1">⚫ Offline</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{errorCount}</div>
          <div className="text-sm text-red-600 mt-1">🔴 Erro</div>
        </div>
      </div>

      {/* Pending Sync Alert */}
      {totalPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-amber-800">
              {totalPending} vendas pendentes de sincronização
            </div>
            <div className="text-xs text-amber-600 mt-0.5">
              Verifique os terminais offline ou com erro de conexão
            </div>
          </div>
          <button className="ml-auto text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors">
            Ver Detalhes
          </button>
        </div>
      )}

      {/* Terminal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {terminals.map((terminal) => (
          <TerminalCard key={terminal.id} terminal={terminal} />
        ))}
      </div>

      {/* Sync Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fila de Sincronização</h3>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Forçar Sync
          </button>
        </div>
        <div className="space-y-3">
          <SyncQueueItem entity="Vendas" pending={23} lastSync="14:30" status="syncing" />
          <SyncQueueItem entity="Produtos" pending={0} lastSync="14:32" status="success" />
          <SyncQueueItem entity="Preços" pending={2} lastSync="13:15" status="error" />
          <SyncQueueItem entity="Clientes" pending={0} lastSync="14:28" status="success" />
          <SyncQueueItem entity="Estoque" pending={5} lastSync="14:25" status="syncing" />
        </div>
      </div>

      {/* API Integration Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API de Integração</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Endpoints Ativos</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-mono">GET</span>
                <code className="text-gray-600">/api/v1/pdv/products</code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-mono">GET</span>
                <code className="text-gray-600">/api/v1/pdv/products/changes</code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-mono">POST</span>
                <code className="text-gray-600">/api/v1/pdv/sales</code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-mono">POST</span>
                <code className="text-gray-600">/api/v1/pdv/sync</code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-mono">GET</span>
                <code className="text-gray-600">/api/v1/pdv/customers</code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-mono">PUT</span>
                <code className="text-gray-600">/api/v1/pdv/sales/cancel</code>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Status da API</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Autenticação</span>
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> OK
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Rate Limit</span>
                <span className="text-xs text-gray-600">1000 req/min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Uptime</span>
                <span className="text-xs text-emerald-600 font-medium">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Última resposta</span>
                <span className="text-xs text-gray-600">42ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Versão API</span>
                <span className="text-xs text-gray-600">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Tokens ativos</span>
                <span className="text-xs text-gray-600">{terminals.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalCard({ terminal }: { terminal: typeof terminals[0] }) {
  const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
    online: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Online', icon: <Wifi className="h-4 w-4" /> },
    syncing: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: 'Sincronizando', icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
    offline: { color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', label: 'Offline', icon: <WifiOff className="h-4 w-4" /> },
    error: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Erro', icon: <AlertTriangle className="h-4 w-4" /> },
  };

  const config = statusConfig[terminal.status] || statusConfig.offline;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${config.bg} p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${terminal.status === 'online' ? 'bg-emerald-100' : terminal.status === 'error' ? 'bg-red-100' : 'bg-gray-100'}`}>
            <Monitor className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{terminal.name}</div>
            <div className="text-xs text-gray-500">{terminal.store}</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Última sincronização</span>
          <span className="text-gray-900 font-medium">
            {new Date(terminal.lastSync).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Versão PDV</span>
          <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{terminal.pdvVersion}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Vendas pendentes</span>
          <span className={`font-semibold ${terminal.pendingSales > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {terminal.pendingSales > 0 ? `${terminal.pendingSales} pendentes` : '0 - Tudo sincronizado'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Último acesso</span>
          <span className="text-gray-900">
            {new Date(terminal.lastAccess).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {terminal.status === 'error' && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg">
          <div className="text-xs text-red-600">
            ⚠️ Erro de conexão detectado. Verifique a rede do terminal.
          </div>
        </div>
      )}

      {terminal.status === 'offline' && (
        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            ⏳ Terminal offline há {Math.floor((Date.now() - new Date(terminal.lastAccess).getTime()) / 3600000)}h. Vendas em fila local.
          </div>
        </div>
      )}
    </div>
  );
}

function SyncQueueItem({ entity, pending, lastSync, status }: { entity: string; pending: number; lastSync: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        {status === 'syncing' && <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />}
        {status === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
        <div>
          <div className="text-sm font-medium text-gray-900">{entity}</div>
          <div className="text-xs text-gray-500">Último sync: {lastSync}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {pending > 0 && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            {pending} pendentes
          </span>
        )}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          status === 'success' ? 'bg-emerald-50 text-emerald-700' :
          status === 'syncing' ? 'bg-yellow-50 text-yellow-700' :
          'bg-red-50 text-red-700'
        }`}>
          {status === 'success' ? 'Sincronizado' : status === 'syncing' ? 'Sincronizando' : 'Erro'}
        </span>
      </div>
    </div>
  );
}
