// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import { RotateCcw } from "lucide-react";

/**
 * COMPONENTE: ResultsInfo
 * Objetivo: Informar ao usuário o resultado da busca atual e gerenciar a limpeza de filtros.
 * Impacto no Portfólio: Mostra preocupação com a experiência do usuário (UX) e
 * gerenciamento de estados globais de filtragem.
 */
const ResultsInfo = ({ total, filters, updateFilter }) => {
  // Verificação booleana para saber se algum filtro ativo difere do estado inicial
  const hasFilters =
    filters.search !== "" ||
    filters.category !== "Todos" ||
    filters.sortBy !== "default" ||
    filters.onlyFeatured;

  // Função centralizada para resetar todos os parâmetros de busca
  const resetFilter = () => {
    updateFilter("search", "");
    updateFilter("category", "Todos");
    updateFilter("sortBy", "default");
    updateFilter("onStock", true);
    updateFilter("onlyFeatured", false);
  };

  return (
    <div className="px-8 py-5 bg-white flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 gap-4">
      {/* TEXTO DE STATUS DOS RESULTADOS */}
      <div className="text-sm text-gray-500 leading-relaxed">
        Encontramos{" "}
        <span className="font-extrabold text-gray-900">{total}</span>{" "}
        {total === 1 ? "produto" : "produtos"}
        {/* Termo de Busca */}
        {filters.search !== "" && (
          <span className="ml-1">
            para "
            <span className="text-teal-600 font-bold">{filters.search}</span>"
          </span>
        )}
        {/* Categoria Selecionada */}
        {filters.category !== "Todos" && (
          <span className="ml-1">
            em{" "}
            <span className="text-teal-600 font-bold">{filters.category}</span>
          </span>
        )}
      </div>

      {/* BOTÃO DE RESET: Só renderiza se houver o que limpar */}
      {hasFilters && (
        <button
          onClick={resetFilter}
          className="group flex items-center gap-2 text-[11px] uppercase tracking-widest font-black 
                     text-red-500 hover:text-white hover:bg-red-500 border border-red-100 
                     hover:border-red-500 px-4 py-2 rounded-xl transition-all duration-300"
        >
          <RotateCcw
            size={14}
            className="group-hover:-rotate-180 transition-transform duration-500"
          />
          Limpar Filtros
        </button>
      )}
    </div>
  );
};

export default ResultsInfo;
