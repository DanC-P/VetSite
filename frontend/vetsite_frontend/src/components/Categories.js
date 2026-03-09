import React from 'react';

const Categories = ({ categoriesData }) => {

    if (!categoriesData || categoriesData.length == 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 italic">Nenhuma categoria cadastrada no momento.</p>
            </div>
        );
    }

    return(
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categoriesData.map((category) => (
                        <div key={category.id} className="border rounded-2xl p-6 text-center hover:shadow-lg transition-all">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                {/* Aqui puxamos a URL da imagem da categoria vinda do banco */}
                                <img src={category.image_url || 'placeholder-paw.png'} alt={category.name} className="w-10 h-10 object-contain" />
                            </div>
                            <h3 className="font-bold text-gray-800">{category.name}</h3>
                            {/* Quantidade real calculada no backend */}
                            <p className="text-sm text-gray-500">{category.product_count} produtos</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;