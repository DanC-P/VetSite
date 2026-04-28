import React, { useState, useEffect } from "react";
import { SidebarAdmin, AdminHeader } from "../components";
import { Outlet } from "react-router-dom";
import { useConfig } from "../context";

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
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR: Agora recebe a config vinda diretamente do Contexto */}
      <SidebarAdmin config={config} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER: Também pode usar o contexto se necessário para exibir nome/logo */}
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
    </div>
  );
};

export default AdminDashboard;
