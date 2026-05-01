// --- IMPORTANDO BIBLIOTECAS ---
import React, { useState } from "react";
import { Menu, X, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * COMPONENTE: Navbar
 * Objetivo: Menu de navegação principal com suporte a branding dinâmico.
 * Demonstra: Manipulação de strings, estados do React e design responsivo.
 */
const Navbar = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- LÓGICA DE BRANDING DINÂMICO ---
  // Dividimos o título para aplicar o estilo "VetSite" (Metade preto, metade teal)
  const title = config?.title_site || "VetSite";
  const half = Math.floor(title.length / 2);
  const firstHalf = title.slice(0, half);
  const secondHalf = title.slice(half);

  const logoUrl =
    config.logo &&
    (config.logo.startsWith("http")
      ? config.logo
      : `http://127.0.0.1:8000${config.logo}`);

  // --- CONFIGURAÇÃO DE ROTAS ---
  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/produtos" },
    { name: "Sobre Mim", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO & NOME: Link para Home */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 
                          flex items-center justify-center text-white overflow-hidden 
                          border-2 border-white shadow-sm transition-transform group-hover:scale-110"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback silencioso: se a imagem falhar, mostramos o ícone
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <PawPrint size={22} fill="currentColor" />
              )}
            </div>

            <span className="text-2xl font-black text-gray-800 tracking-tighter">
              {firstHalf}
              <span className="text-teal-500">{secondHalf}</span>
            </span>
          </Link>

          {/* DESKTOP MENU: Links com hover animado */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-bold text-gray-600 hover:text-teal-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* BOTÃO MOBILE: Toggle Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU: Dropdown reativo */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-gray-100 ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block py-3 px-4 text-base font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
