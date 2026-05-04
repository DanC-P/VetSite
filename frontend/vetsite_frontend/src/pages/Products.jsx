import React, { useState, useEffect } from "react";
import { useConfig } from "../context/ConfigContext"; // Integrando com seu Contexto Global
import {
  Navbar,
  Footer,
  FiltersWrapper,
  ResultsInfo,
  ProductGridCatalogue,
  Toast,
} from "../components";

const Products = () => {
  // --- CONTEXTO E ESTADOS ---
  const { config: configuration, loading: configLoading } = useConfig();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "todos",
    sortBy: "default",
    onlyFeatured: false,
    onStock: true,
    isActive: true,
  });

  const triggerAlert = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Gera a lista de categorias dinamicamente baseada nos produtos
  const getCategoryValue = (value) => {
    if (!value) return null;

    if (typeof value === "object") return value.name?.trim().toLowerCase();
    if (typeof value === "string") return value.trim().toLowerCase();

    return null;
  };

  const categoriesList = [
    ...new Set(
      products.map((p) => getCategoryValue(p.fr_group)).filter(Boolean),
    ),
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const resProd = await fetch("/api/products/");
        if (!resProd.ok) throw new Error("Erro ao buscar produtos");

        const dataProd = await resProd.json();

        // SUTILEZA: Só atualiza o estado se os dados forem realmente diferentes
        // Isso evita que o React renderize a tela sem necessidade
        setProducts((prevProducts) => {
          if (JSON.stringify(prevProducts) !== JSON.stringify(dataProd)) {
            return dataProd;
          }
          return prevProducts;
        });
      } catch (err) {
        triggerAlert("Erro ao carregar produtos.", "error");
      } finally {
        setLoadingProducts(false);
      }
    };

    // 1. Carrega os dados imediatamente ao abrir a página
    loadData();

    // 2. Configura uma verificação automática a cada 30 segundos (30000ms)
    const interval = setInterval(loadData, 30000);

    // 3. LIMPEZA (Crucial): Para o relógio se o usuário sair da página
    return () => clearInterval(interval);
  }, []);

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // --- LÓGICA DE FILTRAGEM (Seu código original preservado) ---
  const productsFiltered = products
    .filter((product) => {
      if (!product.is_active) return false;

      const productCategory = getCategoryValue(product.fr_group);

      const matchesSearch = product.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "todos" || productCategory === filters.category;

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
      return 0;
    });

  // Estado de carregamento mestre (Config + Produtos)
  const isGlobalLoading = configLoading || loadingProducts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alerta Dinâmico */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {isGlobalLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600 font-medium">
            Carregando produtos para seu pet...
          </p>
        </div>
      ) : (
        <>
          <Navbar config={configuration} />

          {/* Componentes de UI originais */}
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
            loading={isGlobalLoading}
          />

          <Footer config={configuration} />
        </>
      )}
    </div>
  );
};

export default Products;
