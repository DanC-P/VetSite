import React from "react";
import { useLocation } from "react-router-dom";

const AdminHeader = () => {
  const location = useLocation();
  const { pathname } = location;

  const menuTitulos = [
    {
      path: "overview",
      breadcrumb: "Dashboard",
      tittle: "Painel Geral",
    },
    {
      path: "reg_produtos",
      breadcrumb: "Produtos",
      tittle: "Gerenciar Produtos",
    },
    {
      path: "reg_categorias",
      breadcrumb: "Categorias",
      tittle: "Gerenciar Categorias",
    },
    {
      path: "config_site",
      breadcrumb: "Configurações",
      tittle: "Configurações do Site",
    },
  ];

  const itemAtual = menuTitulos.find((item) => pathname.includes(item.path));

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 font-medium">
          {itemAtual?.breadcrumb}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          {itemAtual?.tittle}
        </h1>

        {/* Lado Direito: Perfil */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Admin</p>
            <p className="text-xs text-teal-600 font-medium">Acesso Total</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
