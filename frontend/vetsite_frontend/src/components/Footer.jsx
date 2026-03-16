import React from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Lock,
  CreditCard,
} from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand - Coluna 1 */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                {/* SVG da patinha que estava no seu código */}
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
              <span className="text-xl font-extrabold text-white">
                Vet<span className="text-teal-400">Site</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Cuidando do seu pet com amor e qualidade desde 2014.
            </p>
            <div className="flex gap-3">
              {[FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-9 h-9 bg-gray-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Links Úteis - Coluna 2 */}
          <div>
            <h3 className="font-bold text-white mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Trabalhe Conosco
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Fidelidade
                </a>
              </li>
            </ul>
          </div>

          {/* Ajuda - Coluna 3 */}
          <div>
            <h3 className="font-bold text-white mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Como Comprar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Rastrear Pedido
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Política de Troca
                </a>
              </li>
            </ul>
          </div>

          {/* Contato - Coluna 4 */}
          <div>
            <h3 className="font-bold text-white mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-teal-400" />{" "}
                <span>(83) 4002-8922</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-teal-400" />{" "}
                <span>contato@vetsite.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 mt-0.5" />{" "}
                <span>Soledade - PB</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="text-teal-400" />
                <a
                  href="https://wa.me/5583999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition-colors"
                >
                  WhatsApp para comprar
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Badges - A parte final que você enviou */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-2 rounded-lg">
                <ShieldCheck size={20} className="text-emerald-400" />
                <span className="text-xs font-semibold">Site Seguro</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-2 rounded-lg">
                <Lock size={20} className="text-teal-400" />
                <span className="text-xs font-semibold">SSL Certificado</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-2 rounded-lg">
                <CreditCard size={20} className="text-amber-400" />
                <span className="text-xs font-semibold">Pagamento Seguro</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 VetSite. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
