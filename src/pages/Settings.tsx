import { useState } from 'react';
import { Building2, Users, Key, Globe, Bell, Database, Shield, Server, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', name: 'Empresa', icon: Building2 },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'api', name: 'API / PDV', icon: Globe },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'backup', name: 'Backup', icon: Database },
    { id: 'security', name: 'Segurança', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie as configurações do sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Dados da Empresa</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                    <input type="text" defaultValue="Mercado Silva Ltda" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                    <input type="text" defaultValue="Mercado Silva" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <input type="text" defaultValue="12.345.678/0001-90" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
                    <input type="text" defaultValue="001.234.567.890" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input type="text" defaultValue="Rua das Flores, 123 - Centro - Belo Horizonte/MG" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input type="text" defaultValue="(31) 3333-1234" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input type="email" defaultValue="contato@mercadosilva.com.br" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Mercado / Supermercado</option>
                      <option>Padaria</option>
                      <option>Hortifrúti</option>
                      <option>Mercearia</option>
                      <option>Minimercado</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Usuários e Permissões</h3>
                <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                  Novo Usuário
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Admin Master', email: 'admin@mercadosilva.com.br', role: 'Administrador', status: 'active' },
                  { name: 'Maria Silva', email: 'maria@mercadosilva.com.br', role: 'Gerente', status: 'active' },
                  { name: 'Carlos Oliveira', email: 'carlos@mercadosilva.com.br', role: 'Operador PDV', status: 'active' },
                  { name: 'Ana Costa', email: 'ana@mercadosilva.com.br', role: 'Operador PDV', status: 'active' },
                  { name: 'Roberto Santos', email: 'roberto@mercadosilva.com.br', role: 'Operador PDV', status: 'inactive' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{user.role}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração da API PDV</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Base da API</label>
                    <input type="text" defaultValue="https://api.erplite.com.br/v1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo de Sincronização</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>A cada 30 segundos</option>
                      <option>A cada 1 minuto</option>
                      <option>A cada 5 minutos</option>
                      <option>Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (ms)</label>
                    <input type="number" defaultValue="5000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tentativas de Retry</label>
                    <input type="number" defaultValue="3" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tokens de Autenticação</h3>
                <div className="space-y-3">
                  {[
                    { terminal: 'PDV 01', token: 'eyJhbGciOiJIUzI1NiIs...', created: '2026-01-10', status: 'active' },
                    { terminal: 'PDV 02', token: 'eyJhbGciOiJIUzI1NiIs...', created: '2026-01-10', status: 'active' },
                    { terminal: 'PDV 03', token: 'eyJhbGciOiJIUzI1NiIs...', created: '2026-01-12', status: 'active' },
                    { terminal: 'PDV 04', token: 'eyJhbGciOiJIUzI1NiIs...', created: '2026-01-12', status: 'active' },
                    { terminal: 'PDV 05', token: 'eyJhbGciOiJIUzI1NiIs...', created: '2026-01-05', status: 'expired' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.terminal}</div>
                        <code className="text-xs text-gray-500">{item.token}...</code>
                        <div className="text-xs text-gray-400 mt-1">Criado em: {item.created}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {item.status === 'active' ? 'Válido' : 'Expirado'}
                        </span>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Renovar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notificações</h3>
              <div className="space-y-4">
                {[
                  { label: 'Estoque baixo', description: 'Alertar quando produto atingir estoque mínimo', enabled: true },
                  { label: 'Vendas pendentes de sync', description: 'Alertar quando houver vendas não sincronizadas', enabled: true },
                  { label: 'PDV offline', description: 'Alertar quando terminal ficar offline', enabled: true },
                  { label: 'Contas a vencer', description: 'Alertar 3 dias antes do vencimento', enabled: false },
                  { label: 'Faturamento diário', description: 'Resumo diário por e-mail', enabled: true },
                  { label: 'Erros de sincronização', description: 'Alertar imediatamente em caso de erro', enabled: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Backup e Recuperação</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                    <Database className="h-4 w-4" />
                    Backup Automático Ativo
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">Último backup: 15/01/2026 às 03:00 • Próximo: 16/01/2026 às 03:00</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Diário (03:00)</option>
                      <option>A cada 12 horas</option>
                      <option>Semanal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retenção</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>30 dias</option>
                      <option>60 dias</option>
                      <option>90 dias</option>
                    </select>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Database className="h-4 w-4" />
                  Backup Manual Agora
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Segurança</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Autenticação em 2 Fatores (2FA)</div>
                      <div className="text-xs text-gray-500">Adiciona uma camada extra de segurança</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">HTTPS Obrigatório</div>
                      <div className="text-xs text-gray-500">Todas as comunicações via HTTPS</div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Ativo</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Rate Limiting</div>
                      <div className="text-xs text-gray-500">Limite de requisições por IP/token</div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded-full">1000 req/min</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Logs de Auditoria</div>
                      <div className="text-xs text-gray-500">Registro de todas as ações no sistema</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Isolamento Multi-Tenant</div>
                      <div className="text-xs text-gray-500">Dados separados por empresa (tenant)</div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Ativo</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
