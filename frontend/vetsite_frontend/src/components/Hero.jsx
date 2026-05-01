// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import { MessageCircle, Scroll, Tag } from "lucide-react";

/**
 * COMPONENTE: Hero
 * Objetivo: Primeira dobra do site. Exibe o produto em destaque (Featured)
 * ou uma mensagem de boas-vindas caso não haja um destaque definido.
 */
const Hero = ({ featuredProduct, config }) => {
  const hasImage = featuredProduct?.image;

  // --- LÓGICA DE FORMATAÇÃO ---
  // Transforma o número do banco (ex: 45.9) em moeda brasileira (R$ 45,90)
  const formattedPrice = featuredProduct?.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(featuredProduct.price)
    : null;

  // --- HANDLERS ---
  const handleRedirectWatts = (e) => {
    e.preventDefault();
    const isValid = (value) => value && value !== "" && value !== "undefined";
    const phone = config?.whatsapp_number;
    const msgBase = config?.default_message;

    if (isValid(phone)) {
      const message = isValid(msgBase)
        ? `${msgBase}. Tenho interesse no: ${featuredProduct.title}`
        : `Olá! Gostaria de comprar o produto: ${featuredProduct.title}`;

      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert("O número de WhatsApp não foi configurado nas definições do site.");
    }
  };

  const API_URL = process.env.REACT_APP_API_URL || "";

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-gray-100"
    >
      {/* Pattern sutil de patinhas no fundo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none paw-pattern" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div
          className={`grid ${hasImage ? "lg:grid-cols-2" : "grid-cols-1 text-center items-center"} gap-12 items-center`}
        >
          {/* LADO ESQUERDO: TEXTOS E CTA */}
          <div
            className={`animate-fade-in-up ${!hasImage ? "flex flex-col items-center max-w-3xl mx-auto" : ""}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-bold rounded-full mb-6">
              <Tag size={14} />
              {featuredProduct ? "OFERTA EXCLUSIVA" : "BEM-VINDO À VETSITE"}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {featuredProduct ? (
                <>
                  O melhor para o seu pet:{" "}
                  <span className="text-teal-600 block">
                    {featuredProduct.title}
                  </span>
                </>
              ) : (
                <>
                  Cuidado e Qualidade para seu{" "}
                  <span className="text-teal-600">Melhor Amigo</span>
                </>
              )}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              {featuredProduct
                ? `Aproveite! ${featuredProduct.title} com o melhor preço da região. Estoque limitado para garantir a qualidade que seu pet merece.`
                : "Produtos premium selecionados para a saúde e felicidade do seu pet. Atendimento especializado e entrega rápida."}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={handleRedirectWatts}
                className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-4 text-white font-bold rounded-full text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-teal-200 transition-all transform hover:-translate-y-1"
              >
                <MessageCircle size={22} />
                <span>Comprar Agora</span>
              </button>

              <a
                href="#produtos"
                className="px-8 py-4 bg-white text-teal-600 font-bold rounded-full text-lg border-2 border-teal-100 hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center gap-2"
              >
                <Scroll size={22} />
                <span>Ver Catálogo</span>
              </a>
            </div>
          </div>

          {/* LADO DIREITO: CARD DE PRODUTO COM PREÇO */}
          {hasImage && (
            <div className="relative animate-scale-in hidden lg:block group">
              {/* Moldura Decorativa */}
              <div className="absolute inset-0 bg-teal-200/40 rounded-3xl transform rotate-6 scale-95 group-hover:rotate-3 transition-transform duration-500" />

              <div className="relative bg-white rounded-3xl shadow-2xl p-6 transform -rotate-3 group-hover:rotate-0 transition-all duration-500 border border-teal-50">
                {/* Badge de Preço Flutuante - Agora como foco principal de conversão */}
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20">
                  <p className="text-[10px] font-bold uppercase opacity-90 tracking-widest">
                    Apenas
                  </p>
                  <p className="text-2xl font-black">{formattedPrice}</p>
                </div>

                <img
                  src={
                    featuredProduct.image.startsWith("http")
                      ? featuredProduct.image
                      : `${API_URL}${featuredProduct.logo}`
                  }
                  alt={featuredProduct.title}
                  className="w-full h-[420px] object-contain rounded-2xl"
                  onError={(e) => {
                    e.target.closest(".relative").style.display = "none";
                  }}
                />

                {/* Info complementar: Substituímos as estrelas por um selo de disponibilidade */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                    Destaque da Loja
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Pronta Entrega
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wave Divider (Transição para a próxima seção) */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-16"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
