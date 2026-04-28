import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

/**
 * COMPONENTE: Toast
 * Finalidade: Exibir alertas temporários para o usuário.
 * Props:
 * - message: Texto a ser exibido.
 * - type: 'success', 'error' ou 'info'.
 * - onClose: Função para fechar o alerta.
 */
const Toast = ({ message, type, onClose }) => {
  // Efeito para fechar automaticamente após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    error: {
      border: "border-red-500",
      bgIcon: "bg-red-100",
      textColor: "text-red-600",
      icon: <AlertCircle size={20} />,
    },
    success: {
      border: "border-green-500",
      bgIcon: "bg-green-100",
      textColor: "text-green-600",
      icon: <CheckCircle size={20} />,
    },
    info: {
      border: "border-blue-500",
      bgIcon: "bg-blue-100",
      textColor: "text-blue-600",
      icon: <Info size={20} />,
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className="fixed bottom-5 right-5 z-[100] animate-bounce-short">
      <div
        className={`bg-white border-l-4 ${currentStyle.border} p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px]`}
      >
        <div
          className={`${currentStyle.bgIcon} p-2 rounded-full ${currentStyle.textColor}`}
        >
          {currentStyle.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900 italic">Notificação</p>
          <p className="text-xs text-gray-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
