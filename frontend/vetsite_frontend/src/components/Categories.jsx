// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";

// --- IMPORTANDO COMPONENTES ---
// O CategoryIcon é um componente auxiliar que mapeia strings do banco para ícones Lucide
import CategoryIcon from "./CategoryIcon";

/**
 * COMPONENTE: Categories
 * Objetivo: Renderizar a vitrine de categorias na Home do VetSite.
 * Este componente demonstra a capacidade de consumir dados relacionais do Django
 * (como o 'product_count') e transformar em elementos visuais intuitivos.
 */
const Categories = ({ categoriesData }) => {
  /**
   * RENDERIZAÇÃO CONDICIONAL (GUARD CLAUSE):
   * Caso o Backend ainda não tenha retornado dados ou o administrador
   * tenha deletado as categorias, evitamos erros de renderização exibindo um feedback.
   */
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl mx-8 my-4 border-2 border-dashed border-gray-200">
        <p className="text-gray-500 italic">
          Nenhuma categoria cadastrada no momento.
        </p>
      </div>
    );
  }

  return (
    <section
      id="categorias"
      className="py-12 bg-white border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Explore por Categorias
          </h2>
          <div className="h-1 w-12 bg-teal-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Grid de Categorias: Flexbox responsivo para centralizar os itens */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categoriesData.map((category) => (
            <button
              key={category.id}
              className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 focus:outline-none"
              title={`Ver produtos de ${category.name}`}
            >
              {/* Círculo de Ícone: Visual inspirado na identidade do Canva */}
              <div
                className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center 
                            border-2 border-transparent group-hover:border-teal-400 
                            group-hover:bg-white shadow-sm transition-all duration-300"
              >
                {/* Componente de ícone dinâmico: 'iconName' vem como String do Banco de Dados
                  e é convertido para um Componente React dentro do CategoryIcon.
                */}
                <CategoryIcon
                  iconName={category.icon_name}
                  className="w-10 h-10 text-teal-600 group-hover:rotate-12 transition-transform duration-300"
                />
              </div>

              {/* Informações da Categoria */}
              <div className="text-center">
                <h3 className="font-bold text-gray-700 group-hover:text-teal-600 transition-colors text-sm md:text-base">
                  {category.name}
                </h3>

                {/* Badge de Contagem: Mostra o total de produtos vinculados (Foreign Key)
                  calculado de forma eficiente no Backend Django.
                */}
                <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors">
                  {category.product_count} itens
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
