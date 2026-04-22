// --- IMPORTANDO BIBLIOTECAS ---
import React, { useState } from "react";
import { SearchX, Loader2 } from "lucide-react"; // Usando Lucide para consistência visual
import { ProductCard, ProductVisualizer } from "./"; // Via Barrel pattern

/**
 * COMPONENTE: ProductGridCatalogue
 * Objetivo: Exibir a listagem completa e filtrável do catálogo.
 * Diferencial: Gerencia estados complexos (Loading e Empty State).
 */
const ProductGridCatalogue = ({ products, loading, config }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- 1. ESTADO DE CARREGAMENTO (Loading State) ---
  // Essencial para APIs assíncronas (Django)
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] text-teal-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">
          Buscando os melhores produtos...
        </p>
      </div>
    );
  }

  // --- 2. ESTADO VAZIO (Empty State) ---
  // UX: Ajuda o usuário a entender por que a lista está em branco (filtros muito restritos)
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
        <div className="bg-gray-100 p-8 rounded-full mb-6 text-gray-400">
          <SearchX size={52} />
        </div>
        <h3 className="text-xl font-black text-gray-900">
          Nenhum produto por aqui...
        </h3>
        <p className="text-gray-500 max-w-sm mt-3 leading-relaxed">
          Não encontramos resultados para os filtros selecionados. Tente ajustar
          sua busca ou limpar as categorias.
        </p>
        <button
          onClick={() => window.location.reload()} // Exemplo de ação de recuperação
          className="mt-8 text-teal-600 font-bold hover:underline"
        >
          Resetar filtros
        </button>
      </div>
    );
  }

  // --- 3. GRID DE SUCESSO ---
  return (
    <div className="p-4 md:p-8">
      {/* Grid ultra-responsivo: vai de 1 coluna (mobile) até 5 colunas (ultrawide) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={(prod) => setSelectedProduct(prod)}
            config={config}
          />
        ))}
      </div>

      {/* Visualizer condicional */}
      {selectedProduct && (
        <ProductVisualizer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          config={config}
        />
      )}
    </div>
  );
};

export default ProductGridCatalogue;
