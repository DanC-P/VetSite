import React from 'react';
import { MessageCircle, Users, CheckCircle, Truck } from 'lucide-react';

const Features = () => {
  // [SUGESTÃO PRO] Centralizamos os dados aqui para facilitar manutenção
  const benefits = [
    {
      icon: <MessageCircle size={24} />,
      title: "Compre pelo WhatsApp",
      description: "Conversa direta e rápida"
    },
    {
      icon: <Users size={24} />,
      title: "Atendimento Pessoal",
      description: "Foco no comércio local"
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Produtos Curados",
      description: "Qualidade garantida"
    },
    {
      icon: <Truck size={24} />,
      title: "Entrega Rápida",
      description: "Receba no mesmo dia"
    }
  ];

  return (
    <section className="py-12 bg-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, index) => (
            <div key={index} className="text-center text-white group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-teal-100">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;