import React from 'react';
import { MessageCircle, Scroll } from 'lucide-react';

const Hero = ({ featuredProduct }) => {
  // Lógica de WhatsApp: Se houver um produto em destaque, a mensagem já vai personalizada
  const whatsappUrl = featuredProduct 
    ? `https://wa.me/5511999999999?text=Olá! Vi o destaque ${featuredProduct.title} no site e gostaria de saber mais.`
    : "https://wa.me/5511999999999?text=Olá! Gostaria de conhecer o catálogo da VetSite.";

  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-gray-100">
      {/* Elementos Decorativos de Fundo (Paws) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none paw-pattern" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado Esquerdo: Conteúdo */}
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-bold rounded-full mb-6">
              🐾 {featuredProduct ? "Oferta de Destaque" : "Bem-vindo à VetSite"}
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {featuredProduct ? (
                <>O melhor para o seu pet: <span className="text-teal-600">{featuredProduct.title}</span></>
              ) : (
                <>Cuidado e Qualidade para seu <span className="text-teal-600">Melhor Amigo</span></>
              )}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              {featuredProduct 
                ? `Aproveite nossa seleção especial! ${featuredProduct.title} com o melhor preço da região e entrega imediata.`
                : "Produtos premium selecionados para a saúde, bem-estar e felicidade do seu pet. Entrega rápida e atendimento especializado."
              }
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-4 text-white font-bold rounded-full text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-teal-200 transition-all transform hover:-translate-y-1"
              >
                <MessageCircle size={22} />
                <span>Comprar no WhatsApp</span>
              </a>
              
              <button className="px-8 py-4 bg-white text-teal-600 font-bold rounded-full text-lg border-2 border-teal-100 hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center gap-2">
                <Scroll size={22} />
                <span>Ver Catálogo</span>
              </button>
            </div>
          </div>

          {/* Lado Direito: Ilustração ou Imagem do Produto */}
          <div className="relative animate-scale-in hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-200/50 to-transparent rounded-3xl transform rotate-3" />
            
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 transform -rotate-3 hover:rotate-0 transition-all duration-500">
              {featuredProduct?.image ? (
                <img 
                  src={featuredProduct.image} 
                  alt={featuredProduct.title}
                  className="w-full h-[400px] object-contain rounded-2xl"
                />
              ) : (
                /* Fallback para o seu SVG original do Canva quando não há produto em destaque */
                <div className="p-8">
                   <img src="/img/hero-illustration.svg" alt="Pet Illustration" className="w-full h-auto animate-float" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Wave Divider (Ondinha debaixo) */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;