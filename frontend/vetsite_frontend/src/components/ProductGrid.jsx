// --- IMPORTANDO BIBLIOTECAS ---
import React, { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard, ProductVisualizer } from "./"; // Importando via Barrel (index.js)

/**
 * COMPONENTE: ProductGrid
 * Objetivo: Organizar a listagem de produtos em destaque na Home.
 * Gerencia: O estado do modal de detalhes (ProductVisualizer).
 */
const ProductGrid = ({ products, config }) => {
  // Estado para controlar qual produto está sendo visualizado no Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Early Return: Se a API não retornar produtos, a seção nem aparece (UX limpa)
  if (!products || products.length === 0) return null;

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 text-[10px] font-black rounded-full mb-3 uppercase tracking-[0.2em]">
              <Sparkles size={12} /> Destaques Selecionados
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Ofertas da <span className="text-teal-600">Semana</span>
            </h2>
            <p className="text-gray-500 font-medium mt-2 max-w-xl">
              Produtos premium para saúde e bem-estar, com a curadoria
              especializada da VetSite.
            </p>
          </div>

          <Link
            to="/produtos"
            className="group flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-teal-600 font-bold text-sm shadow-sm border border-teal-50 hover:border-teal-500 transition-all"
          >
            Ver catálogo completo
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* GRADE DE PRODUTOS: Layout Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((item) => (
            <ProductCard
              key={item.id} // Chave única essencial para a performance do Virtual DOM
              product={item}
              onOpen={(prod) => setSelectedProduct(prod)} // Callback para abrir o modal
              config={config}
            />
          ))}
        </div>

        {/* MODAL DE DETALHES (Visualizer) */}
        {/* Renderizamos condicionalmente para evitar processamento desnecessário */}
        {selectedProduct && (
          <ProductVisualizer
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            config={config} // Passando config para o modal usar o WhatsApp também
          />
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
