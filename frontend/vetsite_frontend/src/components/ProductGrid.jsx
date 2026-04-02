import React from "react";
import ProductCard from "./ProductCard"; // Reutilizamos o seu card aqui!
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  // Se não houver produtos, não mostramos a seção
  if (!products || products.length === 0) return null;

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-3 uppercase tracking-widest">
              ⭐ Destaques
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Destaques da Semana
            </h2>
            <p className="text-teal-600 font-medium mt-2">
              Os favoritos dos nossos clientes com entrega imediata
            </p>
          </div>

          <Link
            to="/produtos"
            className="mt-4 sm:mt-0 text-teal-600 font-bold hover:text-teal-700 flex items-center gap-1 transition-all hover:gap-2"
          >
            Ver catálogo completo <ChevronRight size={20} />
          </Link>
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            /* [SUGESTÃO PRO] Usamos o id do banco como key para performance */
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
