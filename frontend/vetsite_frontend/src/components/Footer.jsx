// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Lock,
  CreditCard,
  PawPrint, // Importado para manter consistência com o Navbar
} from "lucide-react";

// Instagram icon removed from lucide-react v1.x — using inline SVG
const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Footer = ({ config }) => {
  // --- LÓGICA DE BRANDING DINÂMICO (Igual ao Navbar) ---
  const title = config?.title_site || "VetSite";
  const half = Math.floor(title.length / 2);
  const firstHalf = title.slice(0, half);
  const secondHalf = title.slice(half);

  const API_URL = process.env.REACT_APP_API_URL || "";

  const logoUrl = config?.logo
    ? config.logo.startsWith("http")
      ? config.logo
      : `${API_URL}${config.logo}`
    : null;

  const whatsappNumber = config?.whatsapp_number || "(00) 0000-0000";

  // Formatação do link do WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber.replace(/\D/g, "")}&text=Olá! Vim pelo ${title} e gostaria de tirar uma dúvida.`;

  return (
    <footer id="contato" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* COLUNA 1: Identidade e Redes Sociais */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* LOGO DINÂMICA */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg overflow-hidden border-2 border-gray-800">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <PawPrint
                    size={20}
                    className="text-white"
                    fill="currentColor"
                  />
                )}
              </div>

              {/* TÍTULO DINÂMICO */}
              <span className="text-xl font-extrabold text-white tracking-tighter">
                {firstHalf}
                <span className="text-teal-400">{secondHalf}</span>
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Sua pet shop de confiança em Soledade. Qualidade e carinho para
              quem você mais ama desde 2014.
            </p>

            <div className="flex gap-3">
              {[
                {
                  Icon: Instagram,
                  link: config.instagram_url || "https://instagram.com",
                },
                {
                  Icon: Facebook,
                  link: config.facebook_url || "https://facebook.com",
                },
                {
                  Icon: Youtube,
                  link: config.youtube_url || "https://youtube.com",
                },
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

          {/* COLUNA 2: Navegação Rápida */}
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

          {/* COLUNA 3: Institucional */}
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
                <span>{config?.whatsapp_number || "(00) 0000-0000"}</span>
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
            <p className="text-[11px] text-gray-600 font-medium uppercase">
              © {new Date().getFullYear()} {title} | DESENVOLVIDO POR DANIEL S.
              COSTA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
