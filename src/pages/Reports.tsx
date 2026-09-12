import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

const reportCategories = [
  {
    title: 'Vendas',
    icon: ShoppingCart,
    color: 'emerald',
    reports: [
      { name: 'Vendas por Período', description: 'Faturamento detalhado por dia, semana ou mês' },
      { name: 'Vendas por Produto', description: 'Ranking de produtos mais vendidos' },
      { name: 'Vendas por Categoria', description: 'Faturamento agrupado por categoria' },
      { name: 'Vendas por Loja', description: 'Comparativo entre filiais' },
      { name: 'Vendas por Operador', description: 'Performance dos operadores de caixa' },
      { name: 'Vendas por Forma de Pagamento', description: 'Distribuição por tipo de pagamento' },
    ]
  },
  {
    title: 'Estoque',
    icon: Package,
    color: 'blue',
    reports: [
      { name: 'Posição de Estoque', description: 'Saldo atual de todos os produtos' },
      { name: 'Movimentação de Estoque', description: 'Entradas, saídas e ajustes' },
      { name: 'Inventário', description: 'Relatório de contagem física' },
      { name: 'Perdas e Quebras', description: 'Produtos com perda registrados' },
      { name: 'Produtos sem Estoque', description: 'Lista de produtos zerados' },
      { name: 'Curva ABC', description: 'Classificação por importância' },
    ]
  },
  {
    title: 'Compras',
    icon: BarChart3,
    color: 'purple',
    reports: [
      { name: 'Compras por Fornecedor', description: 'Total gasto por fornecedor' },
      { name: 'Compras por Produto', description: 'Histórico de compras por item' },
      { name: 'Evolução de Custos', description: 'Variação de preço de compra' },
      { name: 'Pedidos Pendentes', description: 'Pedidos de compra em aberto' },
    ]
  },
  {
    title: 'Financeiro',
    icon: DollarSign,
    color: 'amber',
    reports: [
      { name: 'Contas a Pagar', description: 'Obrigações financeiras por vencimento' },
      { name: 'Contas a Receber', description: 'Direitos financeiros por vencimento' },
      { name: 'Fluxo de Caixa', description: 'Entradas e saídas por período' },
      { name: 'DRE Simplificado', description: 'Demonstrativo de resultado' },
    ]
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-sm text-gray-500 mt-1">Gere relatórios gerenciais e operacionais</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Este mês</option>
            <option>Mês anterior</option>
            <option>Personalizado</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Faturamento Mensal</span>
          </div>
          <div className="text-3xl font-bold">R$ 127.450,00</div>
          <div className="text-sm opacity-75 mt-1">+7.8% vs mês anterior</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Margem Média</span>
          </div>
          <div className="text-3xl font-bold">34.2%</div>
          <div className="text-sm opacity-75 mt-1">Meta: 30%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Total de Vendas</span>
          </div>
          <div className="text-3xl font-bold">1.847</div>
          <div className="text-sm opacity-75 mt-1">Ticket médio: R$ 68,97</div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category) => (
          <div key={category.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className={`rounded-lg p-2 ${
                category.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                category.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                category.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <category.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              <span className="text-sm text-gray-500">({category.reports.length} relatórios)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {category.reports.map((report) => (
                <div key={report.name} className="p-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {report.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{report.description}</div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
