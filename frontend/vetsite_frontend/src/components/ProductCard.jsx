// --- IMPORTANDO BIBLIOTECAS ---
import React, { useState } from "react";
import { MessageCircle, AlertTriangle, X } from "lucide-react";

/**
 * COMPONENTE: ProductCard
 * Objetivo: Exibir informações essenciais do produto e gerenciar a intenção de compra.
 * Diferenciais: Lógica de cálculo de desconto, badge de estoque e tratamento de erros de imagem.
 */
const ProductCard = ({ product, onOpen, config }) => {
  const [showConfigAlert, setShowConfigAlert] = useState(false);

  // Early return caso o produto seja inválido ou esteja inativo
  if (!product || !product.is_active) return null;

  const { title, price, old_price, fr_group, image, stock_quantity } = product;

  // --- LÓGICA DE NEGÓCIO ---
  const isOutOfStock = Number(stock_quantity) <= 0;
  const hasDiscount = Number(old_price) > Number(price);
  const discountPercentage = hasDiscount
    ? Math.round(100 - (price * 100) / old_price)
    : 0;

  const handleRedirectWatts = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Evita abrir o modal ao clicar no botão de compra

    const isValid = (v) => v && v !== "" && v !== "undefined";
    const phone = config?.whatsapp_number;

    if (isValid(phone)) {
      const msgBase = isValid(config?.default_message)
        ? config.default_message
        : "Olá! Gostaria de comprar o produto:";

      const message = `${msgBase} ${title}`;
      const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    } else {
      // Feedback visual caso o admin não tenha configurado o contato
      setShowConfigAlert(true);
      setTimeout(() => setShowConfigAlert(false), 4000);
    }
  };

  const categoryName = fr_group?.name || "Geral";

  return (
    <>
      {/* 1. CARD DO PRODUTO */}
      <div
        onClick={() => onOpen(product)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 
                   hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
      >
        {/* CONTAINER DA IMAGEM */}
        <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={
                image.startsWith("http")
                  ? image
                  : `http://127.0.0.1:8000${image}`
              }
              alt={title}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400?text=Produto+Sem+Foto";
              }}
            />
          ) : (
            <div className="text-gray-300 italic text-xs">Sem imagem</div>
          )}

          {/* BADGES: Esgotado ou Desconto */}
          {isOutOfStock ? (
            <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg uppercase">
              Esgotado
            </div>
          ) : (
            hasDiscount && (
              <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-teal-600 text-white text-[10px] font-bold rounded-lg uppercase animate-pulse">
                {discountPercentage}% OFF
              </div>
            )
          )}
        </div>

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="p-4 flex flex-col h-full">
          <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1">
            {categoryName}
          </p>
          <h3 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 h-10 group-hover:text-teal-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-end justify-between mt-auto">
            <div>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through block">
                  {Number(old_price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              )}
              <span className="block text-lg font-black text-teal-600">
                {Number(price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <button
              onClick={handleRedirectWatts}
              disabled={isOutOfStock}
              className={`p-3 rounded-xl text-white transition-all shadow-md ${
                isOutOfStock
                  ? "bg-gray-200 cursor-not-allowed text-gray-400"
                  : "bg-teal-500 hover:bg-teal-600 active:scale-90"
              }`}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ALERTA DE CONFIGURAÇÃO (Toast Notification) */}
      {showConfigAlert && (
        <div className="fixed bottom-5 right-5 z-[100] animate-in slide-in-from-right-full">
          <div className="bg-white border-l-4 border-amber-500 p-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-gray-900">
                Configuração Necessária
              </p>
              <p className="text-xs text-gray-500">
                O WhatsApp não foi definido no painel.
              </p>
            </div>
            <button
              onClick={() => setShowConfigAlert(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
