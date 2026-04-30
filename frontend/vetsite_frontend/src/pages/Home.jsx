import React, { useState, useEffect } from "react";
// Importação do useConfig - Verifique se o caminho do arquivo está 100% correto
import { useConfig } from "../context/ConfigContext";
import {
  Navbar,
  Hero,
  Categories,
  ProductGrid,
  Features,
  Footer,
  Toast,
} from "../components";

/**
 * PAGE: Home
 * Referência técnica para portfólio.
 * Esta página demonstra a integração entre estados locais (Produtos)
 * e estados globais (Configuração via Context API).
 */
const Home = () => {
  // --- ESTADOS LOCAIS ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading para os produtos
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // --- CONTEXTO GLOBAL ---
  // Se o fetch dentro do contexto funciona, esses dados devem chegar aqui
  const { config: configuration, loading: configLoading } = useConfig();

  const triggerAlert = (message, type) => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Buscamos apenas o que é dinâmico da Home
        const [resProducts, resCategories] = await Promise.all([
          fetch("/api/products/?home=true"),
          fetch("/api/categories/"),
        ]);

        if (!resProducts.ok) throw new Error("Erro na API de produtos");

        const dataProducts = await resProducts.json();
        const dataCategories = await resCategories.json();

        setProducts((prevProducts) => {
          if (JSON.stringify(prevProducts) !== JSON.stringify(dataProducts)) {
            return dataProducts;
          }
          return prevProducts;
        });

        setCategories((prevCategories) => {
          if (
            JSON.stringify(prevCategories) !== JSON.stringify(dataCategories)
          ) {
            return dataCategories;
          }
          return prevCategories;
        });
      } catch (err) {
        triggerAlert("Erro ao carregar vitrine.", "error");
      } finally {
        setLoading(false);
      }
    };

    // 1. Carrega os dados imediatamente ao abrir a página
    loadHomeData();

    // 2. Configura uma verificação automática a cada 30 segundos (30000ms)
    const interval = setInterval(loadHomeData, 30000);

    // 3. LIMPEZA (Crucial): Para o relógio se o usuário sair da página
    return () => clearInterval(interval);
  }, []);

  // Produto em destaque para o Hero
  const featured = products.find((p) => p.is_featured === true) || products[0];

  /**
   * ESTA É A CHAVE:
   * Se o Contexto ainda está carregando (configLoading),
   * nós não renderizamos a página para evitar que a Navbar receba 'null'.
   */
  if (configLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Agora a Navbar recebe o configuration vindo do Contexto */}
        <Navbar config={configuration} />

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        ) : (
          <>
            <Hero featuredProduct={featured} config={configuration} />
            <main>
              <Categories categoriesData={categories} />
              <ProductGrid products={products} config={configuration} />
              <Features />
            </main>
          </>
        )}

        <Footer config={configuration} />
      </div>

      {/* Alerta de Erro */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default Home;
