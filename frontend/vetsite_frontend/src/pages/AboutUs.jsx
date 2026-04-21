import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Footer } from "../components";
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Linkedin,
  Github,
  Mail,
  Code,
  Palette,
  Zap,
} from "lucide-react";

const AboutUs = () => {
  const [configuration, setConfiguration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertPopup, setAlertPopup] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const resConfig = await fetch("/api/configuration/");
      const configJson = await resConfig.json();
      const dataConfig = Array.isArray(configJson) ? configJson[0] : configJson;
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
  }, [fetchData]);

  const triggerAlert = (message, type) => {
    setAlertText(message);
    setAlertPopup(true);
    setAlertType(type || "info");
    setTimeout(() => setAlertPopup(false), 5000);
  };

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

  const introducaoPessoal = (
    <div className="text-lg text-gray-600 max-w-3xl mx-auto space-y-4 leading-relaxed">
      <p>
        Sou um desenvolvedor fullstack em início de carreira, movido pela
        curiosidade e pela paixão de transformar linhas de código em soluções
        reais. O <strong>VetSite</strong> é um marco fundamental na minha
        jornada: ele representa o meu primeiro projeto completo, desenvolvido de
        ponta a ponta.
      </p>
      <p className="text-base">
        Durante este desenvolvimento, enfrentei e superei os desafios reais da
        integração entre um backend robusto em <strong>Django</strong> e um
        frontend dinâmico em <strong>React</strong>. Mais do que dominar
        ferramentas como a autenticação de sessões ou a estruturação de APIs,
        este projeto me ensinou a importância da persistência e da resolução
        prática de problemas — habilidades que considero essenciais para
        qualquer programador.
      </p>
      <p className="text-base italic bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm">
        "Concluir este projeto não é apenas o fim de um ciclo de
        desenvolvimento, mas o início da minha trajetória profissional, provando
        que estou pronto para aprender, adaptar e entregar valor com
        tecnologia."
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Navbar agora recebe as configurações */}
      {!loading && <Navbar config={configuration} />}

      {/* Alerta flutuante */}
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
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>
          <main className="max-w-4xl mx-auto px-8 py-16">
            {/* Header da Seção */}
            <div className="text-center mb-16">
              {/* Foto do Desenvolvedor com Sinergia Visual */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <img
                  src={`/media/config/WhatsApp Image 2026-01-25 at 07.09.25.jpeg`}
                  alt="Sua Foto de Perfil"
                  className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-white ring-4 ring-teal-100 transition-transform hover:scale-105 duration-300"
                />
                {/* Um pequeno detalhe visual opcional: um ponto verde de "Online" */}
                <span className="absolute bottom-2 right-2 block h-5 w-5 rounded-full ring-2 ring-white bg-green-400 shadow-lg"></span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Daniel dos Santos Costa
              </h1>

              {introducaoPessoal}
            </div>

            {/* Redes Sociais */}
            <div className="flex justify-center gap-6 mb-16">
              <a
                href="https://www.linkedin.com/in/daniel-costa-0525482aa/" // Nunca deixe apenas "#"
                target="_blank"
                rel="noopener noreferrer" // Obrigatório por segurança ao usar target="_blank"
                className="group flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-6 py-3 hover:border-teal-600 hover:text-teal-600 transition-all shadow-sm"
              >
                <Linkedin size={20} />
                <span className="font-semibold text-sm">LinkedIn</span>
              </a>
              <a
                href="https://github.com/DanC-P" // Substitua pelo seu link real
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-6 py-3 hover:border-teal-600 hover:text-teal-600 transition-all shadow-sm hover:shadow-md"
              >
                <Github
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold text-sm">GitHub</span>
              </a>
            </div>

            {/* Seção de Skills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Card 1: Desenvolvimento */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white mb-4">
                  <Code size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Desenvolvimento
                </h3>
                <p className="text-gray-600 text-sm">
                  Criação de aplicações web modernas com foco em performance,
                  escalabilidade e experiência do usuário.
                </p>
              </div>

              {/* Card 2: Design */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white mb-4">
                  <Palette size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Design</h3>
                <p className="text-gray-600 text-sm">
                  Interfaces intuitivas e responsivas, com atenção a detalhes
                  visuais e usabilidade em todas as plataformas.
                </p>
              </div>

              {/* Card 3: Performance */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Performance
                </h3>
                <p className="text-gray-600 text-sm">
                  Otimização contínua para garantir aplicações rápidas,
                  eficientes e com excelente experiência do usuário.
                </p>
              </div>
            </div>

            {/* Tecnologias */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Principais Tecnologias
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Python", icon: "🐍" },
                  { name: "Django", icon: "🎸" },
                  { name: "React", icon: "⚛️" },
                  { name: "JavaScript", icon: "🟨" },
                  { name: "Tailwind CSS", icon: "🎨" },
                  { name: "PostgreSQL", icon: "🗄️" },
                  { name: "Linux Mint", icon: "🌿" },
                  { name: "Git", icon: "🐙" },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="bg-gray-50 rounded-lg p-4 text-center hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-200"
                  >
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <p className="text-sm font-semibold text-gray-700">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                Pronto para trabalhar juntos?
              </h2>
              <a
                href={`mailto:danielsantoscosta16@gmail.com`}
                className="inline-flex items-center gap-2 bg-white text-teal-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all"
              >
                <Mail size={20} /> Entre em Contato
              </a>
            </div>
          </main>

          {/* 2. Footer recebe as configurações para exibir o WhatsApp/Email */}
          <Footer config={configuration} />
        </>
      )}
    </div>
  );
};

export default AboutUs;
