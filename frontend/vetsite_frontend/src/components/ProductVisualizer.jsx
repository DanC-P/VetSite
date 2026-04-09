import React from "react";
import { X, MessageCircle, Info, Package, CheckCircle2 } from "lucide-react";

const ProductVisualizer = ({ product, onClose }) => {
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
  const whatsappUrl = `https://wa.me/5511999999999?text=Olá! Vi o produto ${title} no site e gostaria de saber mais.`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Lado Esquerdo: Imagem */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <img
            src={
              image.startsWith("http") ? image : `http://127.0.0.1:8000${image}`
            }
            alt={title}
            className="max-h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Lado Direito: Info */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest mb-4">
            {fr_group?.name || "Pet Shop"}
          </span>

          <h2 className="text-3xl font-black text-gray-800 leading-tight mb-4">
            {title}
          </h2>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black text-teal-600">
              R${" "}
              {Number(price).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            {Number(old_price) > Number(price) && (
              <span className="text-lg text-gray-400 line-through font-medium">
                R${" "}
                {Number(old_price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Estoque e Status */}
            <div className="flex items-center gap-4 py-4 border-y border-gray-50">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <Package size={18} className="text-teal-500" />
                Estoque: {stock_quantity} un.
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                <CheckCircle2 size={18} />
                Pronta Entrega
              </div>
            </div>

            {/* Descrição */}
            <div>
              <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
                <Info size={18} className="text-teal-500" />
                Descrição do Produto
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">
                {description ||
                  "O pet shop não forneceu uma descrição detalhada para este item."}
              </p>
            </div>

            {/* Botão de Ação */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl shadow-lg shadow-teal-100 transition-all active:scale-95"
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
