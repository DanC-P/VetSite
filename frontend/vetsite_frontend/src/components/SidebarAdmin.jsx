// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import {
  LayoutDashboard,
  Package,
  List,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * COMPONENTE: SidebarAdmin
 * Objetivo: Navegação lateral do painel administrativo.
 * Demonstra: Uso de NavLink para estados ativos e branding dinâmico.
 */
const SidebarAdmin = ({ config }) => {
  // Nome dinâmico vindo da configuração do banco de dados (Django)
  const siteName = config?.title_site || "VetSite";

  const menuItems = [
    {
      path: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    { path: "reg_produtos", label: "Produtos", icon: <Package size={20} /> },
    { path: "reg_categorias", label: "Categorias", icon: <List size={20} /> },
    {
      path: "config_site",
      label: "Configurações",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="w-[280px] bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col">
      {/* BRANDING DINÂMICO NO ADMIN */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-teal-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Painel de Controle
          </span>
        </div>
        <h1 className="text-xl font-black text-gray-800 truncate">
          {siteName}
          <span className="text-teal-600">.</span>
        </h1>
      </div>

      {/* NAVEGAÇÃO DE ROTAS */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-600 text-white font-bold shadow-lg shadow-teal-100"
                  : "text-gray-500 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            {/* O ícone herda a cor do texto automaticamente */}
            <span className="transition-transform group-hover:scale-110 duration-200">
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* RODAPÉ DA SIDEBAR (Status do Sistema) */}
      <div className="p-6 border-t border-gray-50">
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
            Servidor Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
