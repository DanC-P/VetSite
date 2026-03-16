import React from 'react';
import { Star, MessageCircle, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  if (!product) return null;

  // 1. Destruturamos usando os nomes EXATOS que você definiu no models.py do Django
  const { 
    title,          
    price, 
    old_price, 
    fr_group,       
    image,          
    is_active,
    rating = 5 
  } = product;

  // Se o produto estiver inativo no banco, não mostramos o card
  if (!is_active) return null;

  // 2. Lógica para lidar com a categoria (que vem como objeto do Django)
  const categoryName = fr_group?.name || "Pet Shop";

  const whatsappUrl = `https://wa.me/5511999999999?text=Olá! Gostaria de comprar: ${encodeURIComponent(title)}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4">
        {/* 3. Ajuste da Imagem: o Django envia o caminho do arquivo */}
        {image ? (
          <img 
            src={image.startsWith('http') ? image : `http://127.0.0.1:8000${image}`} 
            alt={title} 
            className="w-full h-full object-contain mix-blend-multiply" 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200?text=PetShop'; // Imagem reserva caso falhe
            }}
          />
        ) : (
          <div className="text-gray-300 italic text-xs">Sem imagem</div>
        )}
        
        {/* Lógica de Desconto: Se o preço antigo for maior que o novo, mostramos "Oferta" */}
        {old_price > price && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase">
            Oferta
          </span>
        )}

        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
          <Heart size={16} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mb-1">
          {categoryName}
        </p>
        <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 h-10">
          {title}
        </h3>
        
        <div className="flex items-center gap-0.5 mb-3 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < rating ? "currentColor" : "none"} />
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            {/* 4. Só mostra o preço antigo se ele existir e for maior que zero */}
            {old_price > 0 && (
              <span className="text-xs text-gray-400 line-through block">
                R$ {Number(old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="block text-lg font-extrabold text-teal-600">
              R$ {Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-500 p-2.5 rounded-full text-white hover:bg-teal-600 transition-colors"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;