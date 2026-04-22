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
    <section className="flex flex-wrap items-center gap-6 px-8 py-6 bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
      {/* 1. CAMPO DE BUSCA TEXTUAL */}
      <div className="relative flex-grow max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          id="search-input"
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg 
                     focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none 
                     transition-all placeholder:text-gray-400"
          placeholder="O que seu pet precisa hoje?"
        />
      </div>

      {/* 2. FILTRAGEM POR CATEGORIA */}
      <div id="category-filters" className="flex items-center gap-2">
        <label
          htmlFor="category-select"
          className="text-xs font-bold text-gray-400 uppercase tracking-tighter"
        >
          Categoria
        </label>
        <select
          id="category-select"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="bg-white border border-gray-200 text-gray-600 text-xs rounded-lg 
                     focus:ring-teal-500 focus:border-teal-500 block p-2 transition-all 
                     outline-none hover:border-teal-500 cursor-pointer"
        >
          <option value="Todos">Todas as Categorias</option>
          {/* Mapeamento dinâmico das categorias vindas do Backend (Django) */}
          {categories
            .filter((cat) => cat.name)
            .map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* 3. ORDENAÇÃO E TOGGLES (LADO DIREITO) */}
      <div className="flex flex-wrap items-center gap-6 ml-auto">
        {/* Ordenação por preço */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase">
            Ordenar
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg p-2 outline-none focus:border-teal-500"
          >
            <option value="default">Destaques</option>
            <option value="lowPrice">Menor Preço</option>
            <option value="highPrice">Maior Preço</option>
          </select>
        </div>

        {/* Toggle: Em Estoque */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onStock}
              onChange={(e) => updateFilter("onStock", e.target.checked)}
              className="sr-only peer"
            />
            {/* O design do toggle é feito puramente com Tailwind usando pseudo-elementos */}
            <div
              className="w-10 h-5 bg-gray-200 rounded-full peer 
                            peer-checked:bg-teal-500 transition-colors 
                            after:content-[''] after:absolute after:top-[2px] 
                            after:left-[2px] after:bg-white after:rounded-full 
                            after:h-4 after:w-4 after:transition-all 
                            peer-checked:after:translate-x-5"
            ></div>
          </label>
          <span className="text-xs font-semibold text-gray-600">
            Em Estoque
          </span>
        </div>

        {/* Toggle: Destaques */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyFeatured}
              onChange={(e) => updateFilter("onlyFeatured", e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-10 h-5 bg-gray-200 rounded-full peer 
                            peer-checked:bg-teal-500 transition-colors 
                            after:content-[''] after:absolute after:top-[2px] 
                            after:left-[2px] after:bg-white after:rounded-full 
                            after:h-4 after:w-4 after:transition-all 
                            peer-checked:after:translate-x-5"
            ></div>
          </label>
          <span className="text-xs font-semibold text-gray-600">Destaques</span>
        </div>
      </div>
    </section>
  );
};

export default FiltersWrapper;
