// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Lock,
  CreditCard,
} from "lucide-react";

/**
 * COMPONENTE: Footer
 * Objetivo: Fornecer informações de contato, links de navegação e selos de segurança.
 * Estratégia de Portfólio: Utilizamos links de âncora (#) para seções existentes na Home,
 * garantindo que o usuário não caia em páginas de erro (404) enquanto o projeto cresce.
 */
const Footer = ({ config }) => {
  // Formatação do link do WhatsApp para ação direta
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsapp_number?.replace(/\D/g, "")}&text=Olá! Vim pelo VetSite e gostaria de tirar uma dúvida.`;

  return (
    <footer id="contato" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* COLUNA 1: Identidade e Redes Sociais */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <circle cx="8" cy="8" r="2" /> <circle cx="16" cy="8" r="2" />
                  <circle cx="6" cy="13" r="1.5" />{" "}
                  <circle cx="18" cy="13" r="1.5" />
                  <ellipse cx="12" cy="15" rx="3" ry="4" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tighter">
                Vet<span className="text-teal-400">Site</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Sua pet shop de confiança em Soledade. Qualidade e carinho para
              quem você mais ama desde 2014.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, link: "https://instagram.com" },
                { Icon: Facebook, link: "https://facebook.com" },
                { Icon: Youtube, link: "https://youtube.com" },
              ].map(({ Icon, link }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* COLUNA 2: Navegação Rápida (Resolvendo os campos brancos) */}
          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#inicio"
                  className="hover:text-teal-400 transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#categorias"
                  className="hover:text-teal-400 transition-colors"
                >
                  Categorias
                </a>
              </li>
              <li>
                <a
                  href="#produtos"
                  className="hover:text-teal-400 transition-colors"
                >
                  Produtos
                </a>
              </li>
              <li>
                <a
                  href="/sobre"
                  className="hover:text-teal-400 transition-colors"
                >
                  Sobre o Desenvolvedor
                </a>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: Institucional/Ajuda */}
          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">
              Institucional
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  className="hover:text-teal-400 transition-colors"
                >
                  Como Comprar
                </a>
              </li>
              <li>
                <span className="text-gray-600">
                  Políticas de Troca (Em breve)
                </span>
              </li>
              <li>
                <span className="text-gray-600">
                  Trabalhe Conosco (Em breve)
                </span>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: Contato Dinâmico */}
          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">
              Contato
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-teal-400" />
                <span>{config.whatsapp_number || "(00) 0000-0000"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-teal-400" />
                <span className="truncate">
                  {config.email_contact || "contato@vetsite.com"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 mt-0.5" />
                <span>Soledade - PB</span>
              </li>
              <li className="mt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                >
                  <MessageCircle size={14} /> Falar no WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SECURITY & COPYRIGHT */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 flex-wrap justify-center opacity-70">
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-[10px] font-bold uppercase">
                  Site Seguro
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
                <Lock size={16} className="text-teal-400" />
                <span className="text-[10px] font-bold uppercase">
                  SSL Encrypted
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
                <CreditCard size={16} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase">
                  Pagamento Local
                </span>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 font-medium">
              © {new Date().getFullYear()} VETSITE | DESENVOLVIDO DANIEL S.
              COSTA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
