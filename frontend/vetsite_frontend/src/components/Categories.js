import React from 'react';

const Categories = ({ categoriesData }) => {
  // Verificação de segurança caso não venham dados
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 italic">Nenhuma categoria cadastrada no momento.</p>
      </div>
    );
  }

  return (
    <section id="categorias" className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da seção seguindo o padrão do Canva */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Explore por Categorias</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categoriesData.map((category) => (
            <button 
              key={category.id} 
              className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 focus:outline-none"
            >
              {/* O círculo colorido que o Canva usa */}
              <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center border-2 border-transparent group-hover:border-teal-400 group-hover:bg-white shadow-sm transition-all duration-300">
                <img 
                  src={category.image_url || 'placeholder-paw.png'} 
                  alt={category.name} 
                  className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform"
                />
              </div>

              {/* Textos dinâmicos vindos do seu banco */}
              <div className="text-center">
                <h3 className="font-bold text-gray-700 group-hover:text-teal-600 transition-colors text-sm md:text-base">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
                  {category.product_count} itens
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;