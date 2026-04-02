const ResultsInfo = ({ total, filters, updateFilter }) => {
  const hasFilters =
    filters.search !== "" ||
    filters.category !== "Todos" ||
    filters.sortBy !== "default" ||
    filters.onlyFeatured;

  const resetFilter = () => {
    updateFilter("search", "");
    updateFilter("category", "Todos");
    updateFilter("sortBy", "default");
    updateFilter("onStock", true);
    updateFilter("onlyFeatured", false);
  };

  return (
    <div className="px-8 py-4 bg-gray-50 flex justify-between items-center border-b border-gray-100">
      <p className="text-sm text-gray-500">
        Encontramos <span className="font-bold text-gray-800">{total}</span>{" "}
        produtos
        {filters.search !== "" && (
          <span>
            {" "}
            para "
            <span className="text-teal-600 font-medium">{filters.search}</span>"
          </span>
        )}
        {filters.category !== "Todos" && (
          <span>
            {" "}
            em{" "}
            <span className="text-teal-600 font-medium">
              {filters.category}
            </span>
          </span>
        )}
        {}
      </p>

      {hasFilters && (
        <button
          onClick={resetFilter}
          className="flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
};

export default ResultsInfo;
