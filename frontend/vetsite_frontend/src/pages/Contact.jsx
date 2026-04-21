import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Footer } from "../components";
// import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Send,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

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
  const [configuration, setConfiguration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertPopup, setAlertPopup] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [alertType, setAlertType] = useState("");

  const alertStyles = {
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

  const fetchData = useCallback(async () => {
    try {
      const resConfig = await fetch("http://127.0.0.1:8000/api/configuration/");
      console.log("Status da Resposta:", resConfig.status);

      const configJson = await resConfig.json();

      const dataConfig =
        Array.isArray(configJson) && configJson.length > 0 ? configJson[0] : {};
      setConfiguration(dataConfig);
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
      triggerAlert("Erro ao carregar as configurações", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    setCsrfToken(getCookie("csrftoken"));
  }, [fetchData]);

  const triggerAlert = (message, type) => {
    setAlertText(message);
    setAlertPopup(true);
    setAlertType(type || "info");

    setTimeout(() => setAlertPopup(false), 5000);
  };

  const handleRedirectWatts = (e) => {
    e.preventDefault();

    const phone = configuration?.whatsapp_number;

    if (isValid(phone)) {
      const messageContact = `Olá, gostaria de entrar em contato com o proprietário do site ${configuration.title_site}.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageContact)}`;
      window.open(url, "_blank");
    } else {
      triggerAlert(
        "Proprietário não configurou um número de WhatsApp em seu site.",
        "info",
      );
    }
  };

  const isValid = (v) => v && v !== "" && v !== "undefined";

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
    const formData = new FormData(e.target);
    const dados = Object.fromEntries(formData.entries());

    if (!dados.name || !dados.email || !dados.subject || !dados.message) {
      triggerAlert("Preencha todos os campos.", "info");
      return;
    }

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
      }
    } catch (err) {
      triggerAlert("Erro ao conectar ao servidor.", "error");
      console.error("Erro de rede:", err);
    }
  };

  return (
    <div>
      {/* 1. Mantenha o Alert fora do loading se quiser que erros apareçam sempre */}
      {alertPopup && (
        <div className="fixed bottom-5 right-5 z-[100] animate-bounce-short">
          <div
            className={`bg-white border-l-4 ${alertStyles[alertType]?.border || "border-blue-500"} p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px]`}
          >
            <div
              className={`${alertStyles[alertType]?.bgIcon || "bg-blue-100"} p-2 rounded-full ${alertStyles[alertType]?.textColor || "text-blue-600"}`}
            >
              {alertStyles[alertType]?.icon || <AlertTriangle size={20} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 italic">
                Notificação
              </p>
              <p className="text-xs text-gray-600">{alertText}</p>
            </div>
            <button
              onClick={() => setAlertPopup(false)}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        /* 2. Adicione o estado de Loading igual ao do Products */
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      ) : (
        /* 3. O Navbar e o Form só aparecem quando loading for false */
        <>
          <Navbar config={configuration} />
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Fale Conosco
              </h1>
              <p className="text-lg text-gray-600">
                Estamos aqui para ajudar! Entre em contato conosco e
                responderemos o mais rápido possível.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <button
                onClick={handleRedirectWatts}
                // Só desativa se o loading acabou E realmente não tem o número
                disabled={loading || !configuration?.whatsapp_number}
                className={`group bg-white rounded-lg shadow-md hover:shadow-xl p-8 border border-gray-100 transition-all duration-300 no-underline ${
                  !loading && !configuration?.whatsapp_number
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      WhatsApp
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Converse conosco pelo WhatsApp para um atendimento rápido
                      e direto.
                    </p>
                    {loading && (
                      <p className="text-teal-600 font-semibold animate-pulse">
                        Carregando...
                      </p>
                    )}
                    {!loading && !configuration?.whatsapp_number && (
                      <p className="text-red-500 text-xs">
                        Indisponível no momento
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={handleRedirectEmail}
                // Só desativa se o loading acabou E realmente não tem o número
                disabled={loading || !configuration?.email_contact}
                className={`group bg-white rounded-lg shadow-md hover:shadow-xl p-8 border border-gray-100 transition-all duration-300 no-underline ${
                  !loading && !configuration?.email_contact
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Email
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Converse conosco pelo Email para um atendimento rápido e
                      direto.
                    </p>
                    {loading && (
                      <p className="text-teal-600 font-semibold animate-pulse">
                        Carregando...
                      </p>
                    )}
                    {!loading && !configuration?.email_contact && (
                      <p className="text-red-500 text-xs">
                        Indisponível no momento
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envie uma Mensagem
              </h2>
              <form
                id="contact-form"
                className="space-y-6"
                onSubmit={handleEmailSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      defaultValue={""}
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={""}
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    defaultValue={""}
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    defaultValue={""}
                    name="message"
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    placeholder="Descreva sua mensagem..."
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Enviar Mensagem
                  </button>
                  <button
                    type="reset"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
                  >
                    Limpar
                  </button>
                </div>
                <div
                  id="form-message"
                  className="hidden p-4 rounded-lg text-sm font-medium"
                ></div>
              </form>
            </div>
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                <details className="bg-white rounded-lg shadow-md border border-gray-100 p-6 group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-teal-600">
                    Qual é o tempo de resposta?
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-gray-600 mt-4">
                    Respondemos todas as mensagens dentro de 24 horas úteis.
                    Para consultas urgentes, recomendamos entrar em contato via
                    WhatsApp.
                  </p>
                </details>
                <details className="bg-white rounded-lg shadow-md border border-gray-100 p-6 group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-teal-600">
                    Qual é o horário de atendimento?
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-gray-600 mt-4">
                    Estamos disponíveis de segunda a sexta-feira, das 9h às 18h.
                    Nos fins de semana, respondemos as mensagens na
                    segunda-feira pela manhã.
                  </p>
                </details>
                <details className="bg-white rounded-lg shadow-md border border-gray-100 p-6 group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-teal-600">
                    Posso fazer pedidos pelo WhatsApp?
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-gray-600 mt-4">
                    Sim! Você pode enviar fotos dos produtos ou descrever o que
                    precisa. Nosso time ajudará você com o melhor atendimento
                    possível.
                  </p>
                </details>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Contact;
