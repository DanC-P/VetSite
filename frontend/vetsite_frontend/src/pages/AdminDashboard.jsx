import React, { useState, useEffect } from "react";
import { SidebarAdmin, AdminHeader } from "../components";
import { Outlet } from "react-router-dom";
import { useConfig } from "../context";
import { List } from "lucide-react";

/**
 * UTILS: getCookie
 * Recupera o token CSRF necessário para as requisições de modificação (POST, PUT, DELETE)
 * no Django. Centralizar isso aqui evita repetição nas sub-páginas.
 */
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

/**
 * PAGE: AdminDashboard
 * Atua como o Layout Base para todas as áreas administrativas.
 * Responsabilidades:
 * 1. Prover o layout estrutural (Sidebar + Header).
 * 2. Gerenciar o token de segurança CSRF.
 * 3. Repassar dados globais (config) para sub-rotas via Outlet Context.
 */
const AdminDashboard = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Consumindo o contexto global que criamos
  const { config, loading } = useConfig();

  useEffect(() => {
    // Sincroniza o token de segurança do Django ao montar o dashboard
    setCsrfToken(getCookie("csrftoken"));
  }, []);

  // Early return enquanto a configuração global (nome do site, etc) está sendo buscada
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      {/* SIDEBAR: Agora recebe a config vinda diretamente do Contexto */}
      <SidebarAdmin
        config={config}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* HEADER: Adicionamos um botão para abrir a sidebar no mobile */}
        <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between md:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <List size={24} />
            </button>
            <span className="ml-4 font-bold text-gray-800">
              {config?.title_site}
            </span>
          </div>
        </header>

        <AdminHeader config={config} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* OUTLET CONTEXT:
              Aqui enviamos o csrfToken e a config para as sub-pages (Overview, Products, etc).
              Dessa forma, os filhos não precisam chamar useConfig() novamente se não quiserem,
              pois já recebem os dados "mastigados" via context do Outlet.
            */}
            <Outlet context={{ csrfToken, config }} />
          </div>
        </main>
      </div>

      {/* OVERLAY: Escurece o fundo quando a sidebar abre no mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[35] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
