import React, { useState } from "react";
import { MessageCircle, AlertTriangle, X } from "lucide-react"; // Adicionei ícones para o alerta

const ProductCard = ({ product, onOpen, config }) => {
  const [showConfigAlert, setShowConfigAlert] = useState(false);

  if (!product) return null;

  const {
    title,
    price,
    old_price,
    fr_group,
    image,
    is_active,
    stock_quantity,
  } = product;

  if (!is_active) return null;

  const handleRedirectWatts = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = (v) => v && v !== "" && v !== "undefined";
    const phone = config?.whatsapp_number;

    if (isValid(phone)) {
      const msgBase = isValid(config?.default_message)
        ? config.default_message
        : "Olá! Gostaria de comprar o produto:";

      const message = `${msgBase} ${title}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    } else {
      setShowConfigAlert(true);
      setTimeout(() => setShowConfigAlert(false), 4000);
    }
  };

  const categoryName = fr_group?.name || "Pet Shop";

  return (
    <>
      {/* 1. CARD DO PRODUTO */}
      <div
        onClick={() => onOpen(product)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
      >
        <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
          {image ? (
            <img
              src={
                image.startsWith("http")
                  ? image
                  : `http://127.0.0.1:8000${image}`
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

          {Number(stock_quantity) <= 0 && (
            <span className="absolute top-3 left-3 z-20 px-3 py-1.5 bg-[#FF0000] text-white text-[10px] font-bold rounded-lg uppercase shadow-sm">
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

            <button
              onClick={handleRedirectWatts}
              disabled={Number(stock_quantity) <= 0}
              className={`p-2.5 rounded-full text-white transition-colors ${
                Number(stock_quantity) <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 shadow-md active:scale-95"
              }`}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ALERTA FLUTUANTE (Renderizado fora do card para não quebrar layout) */}
      {showConfigAlert && (
        <div className="fixed bottom-5 right-5 z-[100] animate-bounce-short">
          <div className="bg-white border-l-4 border-amber-500 p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="text-amber-600 w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                Configuração Pendente
              </p>
              <p className="text-xs text-gray-500">
                O WhatsApp não foi configurado.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfigAlert(false);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
