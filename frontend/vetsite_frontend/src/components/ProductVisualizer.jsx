// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import { X, MessageCircle, Info, Package, CheckCircle2 } from "lucide-react";

/**
 * COMPONENTE: ProductVisualizer
 * Objetivo: Pop-up de detalhes para conversão final.
 * Demonstra: Manipulação de Modais, composição de URLs dinâmicas e Glassmorphism.
 */
const ProductVisualizer = ({ product, onClose, config }) => {
  if (!product) return null;

  const {
    title,
    price,
    old_price,
    fr_group,
    image,
    description,
    stock_quantity,
  } = product;

  // --- LÓGICA DE WHATSAPP DINÂMICO ---
  const phone = config?.whatsapp_number?.replace(/\D/g, "");
  const msgBase = config?.default_message || "Olá! Tenho interesse no produto:";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`${msgBase} ${title}`)}`;

  // --- FORMATAÇÃO DE PREÇO ---
  const formatCurrency = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const API_URL = process.env.REACT_APP_API_URL || "";

  return (
    // Backdrop (Fundo escurecido com desfoque)
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose} // Fecha ao clicar fora
    >
      {/* Container do Modal - Detém a propagação do clique para não fechar ao clicar dentro */}
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-red-50 rounded-full shadow-lg transition-all text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* LADO ESQUERDO: GALERIA/IMAGEM */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <img
            src={image.startsWith("http") ? image : `${API_URL}${image}`}
            alt={title}
            className="max-h-[400px] object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* LADO DIREITO: INFORMAÇÕES E COMPRA */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
          <span className="inline-block self-start px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest mb-4">
            {fr_group?.name || "Pet Shop"}
          </span>

          <h2 className="text-3xl font-black text-gray-800 leading-tight mb-4">
            {title}
          </h2>

          {/* ÁREA DE PREÇO */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-black text-teal-600">
              {formatCurrency(price)}
            </span>
            {Number(old_price) > Number(price) && (
              <span className="text-lg text-gray-400 line-through font-medium">
                {formatCurrency(old_price)}
              </span>
            )}
          </div>

          <div className="space-y-8 flex-1">
            {/* STATUS DE ESTOQUE */}
            <div className="flex items-center gap-6 py-4 border-y border-gray-50">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <Package size={18} className="text-teal-500" />
                Estoque: {stock_quantity} un.
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                <CheckCircle2 size={18} />
                Pronta Entrega
              </div>
            </div>

            {/* DESCRIÇÃO TÉCNICA */}
            <div>
              <div className="flex items-center gap-2 text-gray-800 font-bold mb-3">
                <Info size={18} className="text-teal-500" />
                Sobre o Produto
              </div>
              <p className="text-gray-500 leading-relaxed text-sm italic">
                {description ||
                  "O pet shop não forneceu uma descrição detalhada para este item."}
              </p>
            </div>

            {/* BOTÃO DE CONVERSÃO (CTA) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto flex items-center justify-center gap-3 w-full py-5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl shadow-xl shadow-teal-100 transition-all hover:-translate-y-1 active:scale-95"
            >
              <MessageCircle size={22} />
              PEDIR PELO WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVisualizer;
