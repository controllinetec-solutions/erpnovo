import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Building2 className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">ERP Lite</h1>
              <p className="text-emerald-200 text-sm">Gestão para Varejo Alimentar</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Gerencie seu negócio com inteligência
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed mb-8">
            Sistema completo para mercados, padarias, hortifrútis e mercearias.
            Integração com PDV, controle de estoque, financeiro e muito mais.
          </p>
          <div className="space-y-4">
            <Feature icon="📊" text="Dashboard gerencial em tempo real" />
            <Feature icon="🔄" text="Sincronização com PDV Python" />
            <Feature icon="📦" text="Controle de estoque por loja" />
            <Feature icon="💰" text="Financeiro com contas a pagar/receber" />
            <Feature icon="🔒" text="Segurança multi-tenant" />
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ERP Lite</h1>
              <p className="text-xs text-gray-500">Gestão para Varejo Alimentar</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h2>
              <p className="text-sm text-gray-500 mt-1">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700 font-medium">Erro ao entrar</p>
                  <p className="text-xs text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3 font-medium uppercase tracking-wide">
                Credenciais de Demonstração
              </p>
              <div className="space-y-2">
                <DemoCredential
                  role="Administrador"
                  email="admin@erplite.com.br"
                  password="admin123"
                  onClick={() => { setEmail('admin@erplite.com.br'); setPassword('admin123'); }}
                />
                <DemoCredential
                  role="Gerente"
                  email="gerente@erplite.com.br"
                  password="gerente123"
                  onClick={() => { setEmail('gerente@erplite.com.br'); setPassword('gerente123'); }}
                />
                <DemoCredential
                  role="Operador"
                  email="operador@erplite.com.br"
                  password="operador123"
                  onClick={() => { setEmail('operador@erplite.com.br'); setPassword('operador123'); }}
                />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            ERP Lite v1.0.0 • © 2026 • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <span className="text-emerald-50">{text}</span>
    </div>
  );
}

function DemoCredential({
  role,
  email,
  password,
  onClick,
}: {
  role: string;
  email: string;
  password: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-gray-900">{role}</div>
          <div className="text-xs text-gray-500 font-mono">{email}</div>
        </div>
        <div className="text-xs text-gray-400 group-hover:text-emerald-600">
          <code>{password}</code>
        </div>
      </div>
    </button>
  );
}
