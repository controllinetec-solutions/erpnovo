import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Stock from './pages/Stock';
import Sales from './pages/Sales';
import Cash from './pages/Cash';
import Purchases from './pages/Purchases';
import Finance from './pages/Finance';
import Fiscal from './pages/Fiscal';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Transfers from './pages/Transfers';
import PDVMonitor from './pages/PDVMonitor';
import Sync from './pages/Sync';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública - Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="products"
              element={
                <ProtectedRoute requiredPermission="products.view">
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="stock"
              element={
                <ProtectedRoute requiredPermission="stock.view">
                  <Stock />
                </ProtectedRoute>
              }
            />
            <Route
              path="sales"
              element={
                <ProtectedRoute requiredPermission="sales.view">
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="cash"
              element={
                <ProtectedRoute requiredPermission="sales.view">
                  <Cash />
                </ProtectedRoute>
              }
            />
            <Route
              path="purchases"
              element={
                <ProtectedRoute requiredPermission="products.view">
                  <Purchases />
                </ProtectedRoute>
              }
            />
            <Route
              path="transfers"
              element={
                <ProtectedRoute requiredPermission="stock.view">
                  <Transfers />
                </ProtectedRoute>
              }
            />
            <Route
              path="finance"
              element={
                <ProtectedRoute requiredPermission="finance.view">
                  <Finance />
                </ProtectedRoute>
              }
            />
            <Route
              path="fiscal"
              element={
                <ProtectedRoute requiredPermission="sales.view">
                  <Fiscal />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedRoute requiredPermission="customers.view">
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="suppliers"
              element={
                <ProtectedRoute requiredPermission="suppliers.view">
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            <Route
              path="pdv-monitor"
              element={
                <ProtectedRoute requiredPermission="pdv.monitor">
                  <PDVMonitor />
                </ProtectedRoute>
              }
            />
            <Route path="sync" element={<Sync />} />
            <Route
              path="reports"
              element={
                <ProtectedRoute requiredPermission="reports.view">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute requiredPermission="settings.manage">
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all - redireciona para login ou dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
