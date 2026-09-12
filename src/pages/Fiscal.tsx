import { useState } from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Printer, Download, Eye, Search } from 'lucide-react';

const fiscalDocuments = [
  { id: '1', number: '000123', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T14:30:00', customer: 'Consumidor Final', value: 87.50, status: 'authorized', accessKey: '31260112345678000190650010000001231000000123', authorization: '131260000123456', environment: 'production' },
  { id: '2', number: '000124', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T14:15:00', customer: 'João Santos - 123.456.789-00', value: 45.80, status: 'authorized', accessKey: '31260112345678000190650010000001241000000124', authorization: '131260000123457', environment: 'production' },
  { id: '3', number: '000125', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T13:45:00', customer: 'Consumidor Final', value: 156.30, status: 'authorized', accessKey: '31260112345678000190650010000001251000000125', authorization: '131260000123458', environment: 'production' },
  { id: '4', number: '000126', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T13:20:00', customer: 'Consumidor Final', value: 23.90, status: 'cancelled', accessKey: '31260112345678000190650010000001261000000126', authorization: '131260000123459', environment: 'production', cancellationReason: 'Erro de digitação' },
  { id: '5', number: '000127', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T12:50:00', customer: 'Maria Ferreira - 987.654.321-00', value: 234.60, status: 'authorized', accessKey: '31260112345678000190650010000001271000000127', authorization: '131260000123460', environment: 'production' },
  { id: '6', number: '000128', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T12:30:00', customer: 'Consumidor Final', value: 67.80, status: 'pending', accessKey: '31260112345678000190650010000001281000000128', environment: 'production' },
  { id: '7', number: '000045', series: '1', model: '55', type: 'NF-e', date: '2026-01-14T16:00:00', customer: 'Cliente Especial LTDA - 12.345.678/0001-90', value: 1250.00, status: 'authorized', accessKey: '31260112345678000190550010000000451000000045', authorization: '131260000123400', environment: 'production' },
  { id: '8', number: '000129', series: '1', model: '65', type: 'NFC-e', date: '2026-01-15T11:45:00', customer: 'Consumidor Final', value: 98.40, status: 'contingency', accessKey: '31260112345678000190650010000001291000000129', environment: 'production' },
];

export default function Fiscal() {
  const [activeTab, setActiveTab] = useState<'documents' | 'config' | 'contingency'>('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const authorized = fiscalDocuments.filter(d => d.status === 'authorized').length;
  const cancelled = fiscalDocuments.filter(d => d.status === 'cancelled').length;
  const pending = fiscalDocuments.filter(d => d.status === 'pending').length;
  const contingency = fiscalDocuments.filter(d => d.status === 'contingency').length;

  const filteredDocs = fiscalDocuments.filter(d =>
    d.number.includes(searchTerm) || d.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Fiscal</h1>
          <p className="text-sm text-gray-500 mt-1">NFC-e, NF-e e gestão de documentos fiscais</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Printer className="h-4 w-4" />
            Inutilizar Numeração
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600">{authorized}</div>
          <div className="text-sm text-emerald-600 mt-1">✅ Autorizados</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-amber-600">{pending}</div>
          <div className="text-sm text-amber-600 mt-1">⏳ Pendentes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{cancelled}</div>
          <div className="text-sm text-red-600 mt-1">❌ Cancelados</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{contingency}</div>
          <div className="text-sm text-purple-600 mt-1">⚠️ Contingência</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'documents' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Documentos Fiscais
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'config' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Configurações
          </button>
          <button
            onClick={() => setActiveTab('contingency')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'contingency' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Contingência
          </button>
        </nav>
      </div>

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número ou cliente..."
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
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Número</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Destinatário</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          doc.model === '65' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-900">
                        {doc.number} / Série {doc.series}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(doc.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-xs">{doc.customer}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        R$ {doc.value.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            <Download className="h-4 w-4" />
                          </button>
                          {doc.status === 'authorized' && (
                            <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                              <Printer className="h-4 w-4" />
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

          {selectedDoc && (() => {
            const doc = fiscalDocuments.find(d => d.id === selectedDoc);
            if (!doc) return null;
            return (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Documento Fiscal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Tipo:</span><span className="font-medium">{doc.type} - Modelo {doc.model}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Número:</span><span className="font-medium">{doc.number} / Série {doc.series}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Data Emissão:</span><span className="font-medium">{new Date(doc.date).toLocaleString('pt-BR')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Destinatário:</span><span className="font-medium">{doc.customer}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Ambiente:</span><span className="font-medium">{doc.environment === 'production' ? '🟢 Produção' : '🟡 Homologação'}</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Valor Total:</span><span className="font-bold text-lg">R$ {doc.value.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status:</span><StatusBadge status={doc.status} /></div>
                    {doc.authorization && (
                      <div className="flex justify-between"><span className="text-gray-500">Protocolo:</span><span className="font-mono text-xs">{doc.authorization}</span></div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Chave de Acesso:</div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">{doc.accessKey}</code>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Configurações Fiscais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Certificado Digital</h4>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Certificado Válido
                </div>
                <div className="text-xs text-emerald-600 mt-2 space-y-1">
                  <div>Titular: MERCADO SILVA LTDA</div>
                  <div>CNPJ: 12.345.678/0001-90</div>
                  <div>Validade: 15/08/2027</div>
                  <div>Tipo: A1</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ambiente</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Ambiente Atual</div>
                    <div className="text-xs text-gray-500">Produção ou Homologação</div>
                  </div>
                  <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Produção</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">UF do Emitente</div>
                    <div className="text-xs text-gray-500">Estado de emissão</div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">MG</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Séries e Numeração</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Modelo</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Série</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Último Número</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-2">NFC-e (65)</td>
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2 text-right font-mono">000129</td>
                    <td className="px-3 py-2 text-center"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Ativo</span></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">NF-e (55)</td>
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2 text-right font-mono">000045</td>
                    <td className="px-3 py-2 text-center"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Ativo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contingency' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-amber-800">Modo de Contingência</div>
              <div className="text-xs text-amber-600 mt-1">
                Quando a SEFAZ estiver indisponível, o sistema opera em contingência.
                Os documentos emitidos em contingência devem ser transmitidos em até 24 horas.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos em Contingência</h3>
            <div className="space-y-3">
              {fiscalDocuments.filter(d => d.status === 'contingency' || d.status === 'pending').map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{doc.type} {doc.number}</div>
                    <div className="text-xs text-gray-500">{new Date(doc.date).toLocaleString('pt-BR')} • R$ {doc.value.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={doc.status} />
                    <button className="text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg">
                      Transmitir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    authorized: { label: 'Autorizado', className: 'bg-emerald-50 text-emerald-700' },
    cancelled: { label: 'Cancelado', className: 'bg-red-50 text-red-700' },
    pending: { label: 'Pendente', className: 'bg-amber-50 text-amber-700' },
    contingency: { label: 'Contingência', className: 'bg-purple-50 text-purple-700' },
    denied: { label: 'Denegado', className: 'bg-red-50 text-red-700' },
  };
  const { label, className } = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
