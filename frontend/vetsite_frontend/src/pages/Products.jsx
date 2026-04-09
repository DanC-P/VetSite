import React, { useState, useEffect } from "react";
import {
  Navbar,
  Footer,
  FiltersWrapper,
  ResultsInfo,
  ProductGridCatalogue,
} from "../components";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [configuration, setConfiguration] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "Todos",
    sortBy: "default",
    onlyFeatured: false,
    onStock: true,
    isActive: true,
  });

  const categoriesList = [
    "Todos",
    ...new Set(products.map((p) => p.fr_group).filter(Boolean)),
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resProd, resCat, resConfig] = await Promise.all([
          fetch("/api/products/"),
          fetch("/api/categories/"),
          fetch("/api/configuration/"),
        ]);

        if (!resProd.ok || !resCat.ok || !resConfig.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
        const configJson = await resConfig.json();
        const dataConfig = Array.isArray(configJson)
          ? configJson[0]
          : configJson;

        setProducts(dataProd);
        setCategories(dataCat);
        setConfiguration(dataConfig);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const productsFiltered = products
    .filter((product) => {
      if (!product.is_active) return false;

      const matchesSearch = product.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === "Todos" ||
        product.fr_group === filters.category ||
        product.fr_group?.name === filters.category;
      const matchesFeatured =
        !filters.onlyFeatured || product.is_featured === true;
      const matchesStock = !filters.onStock || product.stock_quantity > 0;

      return (
        matchesSearch && matchesCategory && matchesFeatured && matchesStock
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "lowPrice") return a.price - b.price;
      if (filters.sortBy === "highPrice") return b.price - a.price;
      return 0; // Ordem padrão (vinda do banco)
    });

  return (
    <div>
      <>
        {error && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold">Erro de Conexão</p>
                <p className="text-sm text-red-100">
                  {error}. Verifique se o Django está rodando.
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Carregando produtos para seu pet...
              </p>
            </div>
          ) : (
            <>
              <Navbar config={configuration} />
              <FiltersWrapper
                filters={filters}
                updateFilter={updateFilter}
                categories={categoriesList}
              />
              <ResultsInfo
                total={productsFiltered.length}
                filters={filters}
                updateFilter={updateFilter}
              />
              <ProductGridCatalogue
                products={productsFiltered}
                config={configuration}
                loading={loading}
              />
            </>
          )}

          <Footer />
        </div>
      </>
    </div>
  );
};

export default Products;
