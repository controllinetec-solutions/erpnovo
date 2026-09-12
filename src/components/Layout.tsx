import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart,
  DollarSign, Users, Truck, Monitor, RefreshCw,
  FileText, Settings, Menu, X, ChevronDown, Bell,
  Building2, LogOut, FileOutput, ClipboardList
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Estoque', href: '/stock', icon: Warehouse },
  { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  { name: 'Caixa', href: '/cash', icon: ClipboardList },
  { name: 'Compras', href: '/purchases', icon: Truck },
  { name: 'Financeiro', href: '/finance', icon: DollarSign },
  { name: 'Fiscal', href: '/fiscal', icon: FileOutput },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Fornecedores', href: '/suppliers', icon: Truck },
  { name: 'Monitor PDV', href: '/pdv-monitor', icon: Monitor },
  { name: 'Sincronização', href: '/sync', icon: RefreshCw },
  { name: 'Relatórios', href: '/reports', icon: FileText },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const userInitials = user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col bg-slate-900">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 justify-between px-4">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800">ERP Lite</h1>
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                v1.0
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="relative">
                <button
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                  onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {userInitials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">{user?.name || 'Usuário'}</div>
                    <div className="text-xs text-gray-500">{user?.storeName || 'Loja 01'}</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {companyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                        <div className="text-xs text-emerald-600 font-medium mt-1 capitalize">{user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : user?.role === 'operator' ? 'Operador' : 'Visualizador'}</div>
                      </div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Trocar Loja</div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Loja 01 - Centro</button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Loja 02 - Bairro Norte</button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Loja 03 - Bairro Sul</button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Sair do Sistema
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center px-4 bg-slate-800">
        <Building2 className="h-8 w-8 text-emerald-400" />
        <span className="ml-3 text-xl font-bold text-white">ERP Lite</span>
        {onClose && (
          <button className="ml-auto text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Company info */}
      <div className="px-4 py-3 border-b border-slate-700">
        <div className="text-sm font-medium text-white">Mercado Silva Ltda</div>
        <div className="text-xs text-slate-400">CNPJ: 12.345.678/0001-90</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
            onClick={onClose}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700">
        <div className="text-xs text-slate-500">ERP Lite v1.0.0</div>
        <div className="text-xs text-slate-500">© 2026 - Todos os direitos reservados</div>
      </div>
    </div>
  );
}
