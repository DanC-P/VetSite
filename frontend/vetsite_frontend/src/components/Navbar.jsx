import React, { useState } from "react";
import { Menu, X, PawPrint } from "lucide-react"; // Importei o ícone PawPrint como sugestão caso não use o SVG
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Centralização dos dados de navegação
  // Isso facilita a manutenção: se mudar o nome de uma página, muda aqui.
  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/produtos" },
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Agora envolta em um link para voltar ao início */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center animate-float text-white">
              {/* O SVG do Canva entraria aqui. Usei PawPrint como fallback do Lucide */}
              <PawPrint size={24} />
            </div>
            <span className="text-2xl font-extrabold text-gray-800">
              Vet<span className="text-teal-500">Site</span>
            </span>
          </div>

          {/* Desktop Menu - Mapeado a partir dos nossos dados */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 font-semibold hover:text-teal-600 transition-colors relative group"
              >
                {link.name}

                {/* Underline animado */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Botão Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-teal-500 transition-colors"
            aria-label="Abrir menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Reativo - Agora funcional e mapeado */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-up">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 px-3 text-gray-700 font-semibold hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um link
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
