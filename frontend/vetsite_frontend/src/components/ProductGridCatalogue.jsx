import React, { useState } from "react";
import ProductCard from "./ProductCard"; // Certifique-se de que o caminho está correto
import ProductVisualizer from "./ProductVisualizer";

const ProductGridCatalogue = ({ products, loading, config }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          {/* Ícone de busca vazia */}
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-500 max-w-xs mt-2">
          Não encontramos nada com esses filtros. Tente ajustar sua busca ou
          mudar a categoria.
        </p>
      </div>
    );
  }

  // 3. Grid de Produtos
  return (
    <div className="p-8">
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

      <ProductVisualizer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductGridCatalogue;
