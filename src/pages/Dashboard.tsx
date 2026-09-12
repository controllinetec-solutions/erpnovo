import {
  ShoppingCart, DollarSign, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Package, Monitor
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { dashboardData, terminals } from '../data/mockData';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const revenueGrowth = ((dashboardData.monthRevenue - dashboardData.lastMonthRevenue) / dashboardData.lastMonthRevenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do seu negócio • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Faturamento Hoje"
          value={`R$ ${dashboardData.todaySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle={`${dashboardData.todaySalesCount} vendas realizadas`}
          icon={<DollarSign className="h-6 w-6" />}
          color="emerald"
          trend={+8.2}
        />
        <KpiCard
          title="Ticket Médio"
          value={`R$ ${dashboardData.averageTicket.toFixed(2)}`}
          subtitle="Últimas 24 horas"
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
          trend={+3.5}
        />
        <KpiCard
          title="Faturamento Mensal"
          value={`R$ ${(dashboardData.monthRevenue / 1000).toFixed(1)}k`}
          subtitle={`${revenueGrowth}% vs mês anterior`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
          trend={+7.8}
        />
        <KpiCard
          title="Alertas"
          value={`${dashboardData.lowStockProducts + 1}`}
          subtitle={`${dashboardData.lowStockProducts} produtos estoque baixo`}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="amber"
          trend={-2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Day */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vendas da Semana</h3>
            <span className="text-sm text-gray-500">Últimos 7 dias</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboardData.salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
              <Tooltip
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dashboardData.salesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {dashboardData.salesByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, 'Participação']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {dashboardData.salesByCategory.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {dashboardData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.qty} un. vendidos</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div>
                <div className="text-sm text-emerald-700 font-medium">Contas a Receber</div>
                <div className="text-xs text-emerald-600">Próximos 30 dias</div>
              </div>
              <div className="text-lg font-bold text-emerald-700">
                R$ {(dashboardData.pendingReceivables / 1000).toFixed(1)}k
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <div className="text-sm text-red-700 font-medium">Contas a Pagar</div>
                <div className="text-xs text-red-600">Próximos 30 dias</div>
              </div>
              <div className="text-lg font-bold text-red-700">
                R$ {(dashboardData.pendingPayables / 1000).toFixed(1)}k
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-blue-700 font-medium">Saldo Previsto</div>
                <div className="text-xs text-blue-600">Receitas - Despesas</div>
              </div>
              <div className="text-lg font-bold text-blue-700">
                -R$ {((dashboardData.pendingPayables - dashboardData.pendingReceivables) / 1000).toFixed(1)}k
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos PDVs</h3>
          <div className="space-y-3">
            {terminals.map((terminal) => (
              <div key={terminal.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <StatusDot status={terminal.status} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{terminal.name}</div>
                    <div className="text-xs text-gray-500">{terminal.store}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {terminal.pendingSales > 0 ? `${terminal.pendingSales} pend.` : 'OK'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Evolução do Faturamento</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">7 dias</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-full">30 dias</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-full">90 dias</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[
            { date: '09/01', value: 14200 },
            { date: '10/01', value: 16800 },
            { date: '11/01', value: 15400 },
            { date: '12/01', value: 18900 },
            { date: '13/01', value: 17200 },
            { date: '14/01', value: 19800 },
            { date: '15/01', value: 21500 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']} />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon, color, trend }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
  trend: number;
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-2.5 ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-0.5 text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-0.5">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    online: 'bg-emerald-500',
    syncing: 'bg-yellow-500 animate-pulse',
    offline: 'bg-gray-400',
    error: 'bg-red-500',
  };

  return (
    <div className="relative">
      <div className={`h-3 w-3 rounded-full ${colors[status] || 'bg-gray-400'}`} />
    </div>
  );
}
