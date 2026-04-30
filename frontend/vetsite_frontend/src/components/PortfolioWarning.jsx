import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const PortfolioWarning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou o aviso anteriormente
    const hasSeenWarning = localStorage.getItem("vetsite_warning_accepted");
    if (!hasSeenWarning) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    // Salva a preferência no navegador para não mostrar de novo
    localStorage.setItem("vetsite_warning_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-amber-100 animate-in fade-in zoom-in duration-300">
        {/* Header com cor de alerta */}
        <div className="bg-amber-500 p-4 flex justify-center">
          <div className="bg-white/20 p-3 rounded-full">
            <AlertTriangle size={32} className="text-white" />
          </div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Atenção: Site Demonstrativo
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Este site é um **projeto de portfólio acadêmico**. Nenhum dos
            produtos listados está à venda e nenhuma transação financeira será
            processada.
          </p>

          <button
            onClick={handleClose}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg"
          >
            Entendido, quero visualizar o projeto
          </button>

          <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
            Desenvolvido por Daniel S. Costa
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWarning;
