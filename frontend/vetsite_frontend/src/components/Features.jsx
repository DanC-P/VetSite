// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
// Importamos os ícones necessários para reforçar visualmente cada benefício
import { MessageCircle, Users, CheckCircle, Truck } from "lucide-react";

/**
 * CONFIGURAÇÃO DE BENEFÍCIOS (ESTÁTICA):
 * Movido para fora do componente para que o array não seja re-alocado na memória
 * a cada ciclo de renderização do React.
 */
const BENEFITS = [
  {
    icon: <MessageCircle size={24} />,
    title: "Compre pelo WhatsApp",
    description: "Conversa direta e rápida",
  },
  {
    icon: <Users size={24} />,
    title: "Atendimento Pessoal",
    description: "Foco no comércio local",
  },
  {
    icon: <CheckCircle size={24} />,
    title: "Produtos Curados",
    description: "Qualidade garantida",
  },
  {
    icon: <Truck size={24} />,
    title: "Entrega Rápida",
    description: "Receba no mesmo dia",
  },
];

/**
 * COMPONENTE: Features
 * Objetivo: Destacar os diferenciais competitivos do negócio.
 * Estilizado com as cores principais da marca (Teal/Ciano) para criar contraste na Home.
 */
const Features = () => {
  return (
    <section className="py-12 bg-teal-600 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Responsiva: 
            - 2 colunas em dispositivos móveis (grid-cols-2)
            - 4 colunas em desktops (lg:grid-cols-4)
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((item, index) => (
            <div
              key={index}
              className="text-center text-white group cursor-default"
            >
              {/* Container do Ícone com efeito de Glassmorphism (bg-white/20) */}
              <div
                className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl 
                           flex items-center justify-center 
                           group-hover:bg-white/30 group-hover:scale-110 
                           transition-all duration-300 shadow-lg"
              >
                {/* O ícone herda a cor branca do texto do pai */}
                {item.icon}
              </div>

              {/* Textos Informativos */}
              <h3 className="font-bold text-lg mb-1 tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-teal-100 font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
