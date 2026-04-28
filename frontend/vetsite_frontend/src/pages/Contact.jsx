import React, { useState, useEffect } from "react";
// Importamos o contexto para substituir o fetch manual
import { useConfig } from "../context/ConfigContext";
import { Navbar, Footer, Toast } from "../components";
import { Mail, Phone, Send, ChevronDown } from "lucide-react";

/**
 * Função utilitária para capturar o CSRF Token
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Contact = () => {
  // --- USANDO O CONTEXTO (Lógica corrigida) ---
  const { config: configuration, loading: configLoading } = useConfig();

  // --- ESTADOS DE CONTROLE ---
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCsrfToken(getCookie("csrftoken"));
  }, []);

  const triggerAlert = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const isValid = (v) => v && v !== "" && v !== "undefined";

  const handleRedirectWatts = (e) => {
    e.preventDefault();
    const phone = configuration?.whatsapp_number;
    if (isValid(phone)) {
      const messageContact = `Olá, gostaria de entrar em contato com o proprietário do site ${configuration.title_site}.`;
      const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(messageContact)}`;
      window.open(url, "_blank");
    } else {
      triggerAlert(
        "Proprietário não configurou um número de WhatsApp.",
        "info",
      );
    }
  };

  const handleRedirectEmail = (e) => {
    e.preventDefault();
    const mail = configuration?.email_contact;
    if (isValid(mail)) {
      const messageContact = `Olá, gostaria de entrar em contato com o proprietário do site ${configuration.title_site}.`;
      const url = `mailto:${mail}?subject=${encodeURIComponent("Contato via VetSite")}&body=${encodeURIComponent(messageContact)}`;
      window.open(url, "_blank");
    } else {
      triggerAlert("Proprietário não configurou um email em seu site.", "info");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const dados = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/send_contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        triggerAlert("Mensagem enviada com sucesso!", "success");
        e.target.reset();
      } else {
        triggerAlert("Erro ao enviar mensagem.", "error");
      }
    } catch (err) {
      triggerAlert("Erro ao conectar ao servidor.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se o contexto estiver carregando, mostramos o seu spinner original
  if (configLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar config={configuration} />

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* CABEÇALHO (Seu design original) */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fale Conosco
          </h1>
          <p className="text-lg text-gray-600">
            Estamos aqui para ajudar! Entre em contato conosco e responderemos o
            mais rápido possível.
          </p>
        </div>

        {/* CARDS DE CONTATO (Seu design original) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <button
            onClick={handleRedirectWatts}
            className={`group bg-white rounded-lg shadow-md hover:shadow-xl p-8 border border-gray-100 transition-all duration-300 ${!configuration?.whatsapp_number ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  WhatsApp
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Atendimento rápido e direto via chat.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleRedirectEmail}
            className={`group bg-white rounded-lg shadow-md hover:shadow-xl p-8 border border-gray-100 transition-all duration-300 ${!configuration?.email_contact ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Envie um email para nossa caixa oficial.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* FORMULÁRIO (Seu design original) */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Envie uma Mensagem
          </h2>
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assunto *
              </label>
              <input
                name="subject"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                placeholder="Como podemos ajudar?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem *
              </label>
              <textarea
                name="message"
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all resize-none"
                placeholder="Descreva sua mensagem..."
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group hover:shadow-lg disabled:opacity-50"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </button>
              <button
                type="reset"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        {/* FAQ (Seu design original) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              "Qual é o tempo de resposta?",
              "Qual é o horário de atendimento?",
              "Posso fazer pedidos pelo WhatsApp?",
            ].map((q, i) => (
              <details
                key={i}
                className="bg-white rounded-lg shadow-md border border-gray-100 p-6 group cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-teal-600">
                  {q}{" "}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-gray-600 mt-4">
                  {i === 0 &&
                    "Respondemos todas as mensagens dentro de 24 horas úteis."}
                  {i === 1 &&
                    "Estamos disponíveis de segunda a sexta-feira, das 9h às 18h."}
                  {i === 2 &&
                    "Sim! Você pode enviar fotos dos produtos ou descrever o que precisa."}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <Footer config={configuration} />

      {/* Componente Toast (Unificado) */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Contact;
