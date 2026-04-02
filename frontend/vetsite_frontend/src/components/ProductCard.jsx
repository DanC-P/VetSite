import React from "react";
import { MessageCircle, Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  if (!product) return null;

  // 1. Destruturação corrigida: Usando exatamente o que vem do Django
  const {
    title,
    price,
    old_price,
    fr_group,
    image,
    is_active,
    stock_quantity, // Corrigido de stockQuantity para stock_quantity
  } = product;

  if (!is_active) return null;

  const categoryName = fr_group?.name || "Pet Shop";
  const whatsappUrl = `https://wa.me/5511999999999?text=Olá! Gostaria de comprar: ${encodeURIComponent(title)}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
      {/* CONTAINER RELATIVO PRINCIPAL */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
        {/* IMAGEM (Base do container) */}
        {image ? (
          <img
            src={
              image.startsWith("http") ? image : `http://127.0.0.1:8000${image}`
            }
            alt={title}
            className="w-full h-full object-contain mix-blend-multiply"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200?text=PetShop";
            }}
          />
        ) : (
          <div className="text-gray-300 italic text-xs">Sem imagem</div>
        )}

        {/* ETIQUETAS (Agora saindo das divs fantasmas e usando z-index direto sobre a imagem) */}
        {Number(stock_quantity) <= 0 && (
          <span className="absolute top-3 left-3 z-20 px-3 py-1.5 bg-[#FF0000] backdrop-blur-sm text-white text-[10px] font-bold rounded-lg uppercase border border-gray-200 shadow-sm flex items-center gap-1.5">
            Esgotado
          </span>
        )}

        {Number(stock_quantity) > 0 && Number(old_price) > Number(price) && (
          <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-teal-600 text-white text-[10px] font-bold rounded-lg uppercase shadow-sm">
            {Math.round(100 - (price * 100) / old_price)}% OFF
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mb-1">
          {categoryName}
        </p>
        <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 h-10">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div>
            {Number(old_price) > Number(price) && (
              <span className="text-xs text-gray-400 line-through block">
                R${" "}
                {Number(old_price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
            <span className="block text-lg font-extrabold text-teal-600">
              R${" "}
              {Number(price).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2.5 rounded-full text-white transition-colors ${
              Number(stock_quantity) <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
