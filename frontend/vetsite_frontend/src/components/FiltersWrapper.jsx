// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import { Search } from "lucide-react"; // Importação direta para melhor performance

/**
 * COMPONENTE: FiltersWrapper
 * * Este componente atua como uma "ponte de estado". Ele não filtra os dados diretamente,
 * mas captura as intenções do usuário e as envia para a página pai (Products.jsx)
 * através da função 'updateFilter'.
 */
const FiltersWrapper = ({ filters, updateFilter, categories }) => {
  return (
    <section className="md:sticky z-20 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
        {/* Container Principal: No mobile vira Grid, no Desktop volta a ser Flex */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-4 md:gap-6">
          {/* 1. CAMPO DE BUSCA: Ocupa a linha toda no mobile (col-span-2) */}
          <div className="relative col-span-2 md:flex-grow md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              placeholder="Buscar..."
            />
          </div>

          {/* 2. CATEGORIA: 1 Coluna no mobile */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
              Categoria
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2 outline-none focus:border-teal-500 w-full"
            >
              <option value="Todos">Todas</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* 3. ORDENAR: 1 Coluna no mobile */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
              Ordenar
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2 outline-none focus:border-teal-500 w-full"
            >
              <option value="default">Destaques</option>
              <option value="lowPrice">Menor Preço</option>
              <option value="highPrice">Maior Preço</option>
            </select>
          </div>

          {/* 4. TOGGLES: Ocupam a linha toda no mobile para não esmagar */}
          <div className="col-span-2 flex items-center justify-between md:justify-start gap-4 pt-2 md:pt-0 md:ml-auto md:border-l md:pl-6 border-gray-100 border-t md:border-t-0">
            {/* Toggle Em Estoque */}
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onStock}
                  onChange={(e) => updateFilter("onStock", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
              <span className="text-[11px] font-semibold text-gray-500 uppercase">
                Estoque
              </span>
            </div>

            {/* Toggle Destaques */}
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyFeatured}
                  onChange={(e) =>
                    updateFilter("onlyFeatured", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
              <span className="text-[11px] font-semibold text-gray-500 uppercase">
                Destaques
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersWrapper;
