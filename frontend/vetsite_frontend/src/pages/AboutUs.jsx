import React, { useEffect, useState } from "react";
import { Navbar, Footer, Toast } from "../components"; // Importações centralizadas
import { useConfig } from "../context"; // Hook global do VetSite
import { Linkedin, Github, Mail, Code, Palette, Zap } from "lucide-react";

/**
 * PAGE: AboutUs
 * Objetivo: Apresentar o desenvolvedor e o projeto VetSite.
 * Destaque: Utiliza o ConfigContext para obter dados do site sem novas requisições.
 */
const AboutUs = () => {
  // 1. Consumindo o contexto global
  const { config: configuration, loading } = useConfig();

  // 2. Estado local apenas para o sistema de alertas
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const triggerAlert = (message, type) => {
    setToast({ show: true, message, type });
  };

  // --- VALIDAÇÃO DE DADOS ---
  useEffect(() => {
    // Se parou de carregar e não temos o objeto de configuração...
    if (!loading && !configuration) {
      triggerAlert(
        "Atenção: Não foi possível carregar as informações do site. Verifique sua conexão.",
        "error",
      );
    }
  }, [loading, configuration]);

  // --- VALIDAÇÂO DE EMAIL ---
  const handleContactClick = (e) => {
    if (!configuration?.email_contact) {
      e.preventDefault();
      triggerAlert(
        "O e-mail de contato ainda não foi configurado no painel.",
        "info",
      );
    }
  };

  // Pequeno codigo para verificar se tem title ou n no site
  const siteTitle = configuration?.title_site || "VetSite";

  // Fragmento de texto para organização do código
  const introducaoPessoal = (
    <div className="text-lg text-gray-600 max-w-3xl mx-auto space-y-4 leading-relaxed">
      <p>
        Sou um desenvolvedor fullstack em início de carreira, movido pela
        curiosidade e pela paixão de transformar linhas de código em soluções
        reais. O <strong>{siteTitle}</strong> é um marco fundamental na minha
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
      {/* Exibe a Navbar apenas quando o contexto carregar */}
      {!loading && <Navbar config={configuration} />}

      {/* Sistema de Alerta Centralizado */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando perfil...</p>
        </div>
      ) : (
        <>
          <main className="max-w-4xl mx-auto px-8 py-16">
            {/* Seção Perfil */}
            <div className="text-center mb-16">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <img
                  src={`/media/config/WhatsApp Image 2026-01-25 at 07.09.25.jpeg`}
                  alt="Daniel Costa"
                  className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-white ring-4 ring-teal-100 hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-2 right-2 block h-5 w-5 rounded-full ring-2 ring-white bg-green-400 animate-pulse"></span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Daniel dos Santos Costa
              </h1>
              {introducaoPessoal}
            </div>

            {/* Redes Sociais */}
            <div className="flex justify-center gap-6 mb-16">
              <a
                href="https://linkedin.com/..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border p-3 rounded-lg hover:text-teal-600 transition-all"
              >
                <Linkedin size={20} />{" "}
                <span className="font-semibold text-sm">LinkedIn</span>
              </a>
              <a
                href="https://github.com/..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border p-3 rounded-lg hover:text-teal-600 transition-all"
              >
                <Github size={20} />{" "}
                <span className="font-semibold text-sm">GitHub</span>
              </a>
            </div>

            {/* Grid de Skills (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  title: "Desenvolvimento",
                  icon: <Code />,
                  text: "Aplicações modernas com Django e React.",
                },
                {
                  title: "Design",
                  icon: <Palette />,
                  text: "Interfaces responsivas com Tailwind CSS.",
                },
                {
                  title: "Performance",
                  icon: <Zap />,
                  text: "Otimização de rotas e consumo de APIs.",
                },
              ].map((skill, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-4">
                    {skill.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{skill.text}</p>
                </div>
              ))}
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                Pronto para trabalhar juntos?
              </h2>
              <a
                href="mailto:seu-email@gmail.com"
                onClick={handleContactClick}
                className="inline-flex items-center gap-2 bg-white text-teal-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all"
              >
                <Mail size={20} /> Entre em Contato
              </a>
            </div>
          </main>

          {/* Footer consome os dados de contato do contexto global automaticamente */}
          <Footer config={configuration} />
        </>
      )}
    </div>
  );
};

export default AboutUs;
