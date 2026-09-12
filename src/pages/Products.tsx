import { useState } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Package, Scale, Eye } from 'lucide-react';
import { products } from '../data/mockData';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) || p.code.includes(searchTerm);
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, código de barras ou código interno..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Mais Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Produto</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoria</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Custo</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Venda</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Margem</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Estoque</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {product.isWeighable ? (
                          <Scale className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Package className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.description}</div>
                        <div className="text-xs text-gray-500">
                          {product.barcode} • {product.unit}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    R$ {product.costPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    R$ {product.salePrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-emerald-600 font-medium">{product.margin.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`font-medium ${product.currentStock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.currentStock}
                      </span>
                      {product.currentStock <= product.minStock && (
                        <span className="text-xs text-red-500">⚠️</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">mín: {product.minStock}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.isWeighable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <Scale className="h-3 w-3" /> Pesável
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Unidade</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {product.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white">Anterior</button>
            <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white">2</button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white">Próximo</button>
          </div>
        </div>
      </div>

      {/* New Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900">Novo Produto</h2>
              <p className="text-sm text-gray-500">Preencha os dados do produto</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Interno</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras / GTIN</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="7890000000000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ex: Arroz Tipo 1 Camil 5kg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Reduzida</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ex: Arroz Camil 5kg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Mercearia</option>
                    <option>Hortifrúti</option>
                    <option>Padaria</option>
                    <option>Bebidas</option>
                    <option>Laticínios</option>
                    <option>Higiene</option>
                    <option>Limpeza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Marca" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>UN - Unidade</option>
                    <option>KG - Quilograma</option>
                    <option>G - Grama</option>
                    <option>L - Litro</option>
                    <option>ML - Mililitro</option>
                    <option>CX - Caixa</option>
                    <option>PCT - Pacote</option>
                    <option>FD - Fardo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NCM</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="00000000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEST</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0000000" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
                  <input type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                  <input type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-gray-700">Produto Pesável</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-gray-700">Ativo</span>
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
