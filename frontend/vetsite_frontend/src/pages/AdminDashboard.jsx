import React, { useState, useEffect } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminHeader from "../components/AdminHeader";
import AdminProduct from "./AdminProduct"; // A view de produtos que criamos
import AdminOverview from "./AdminOverview"; // Uma view de dashboard/estatísticas
import AdminCategory from "./AdminCategory";
import AdminConfigSite from "./AdminConfigSite";

// Função única para pegar o CSRF
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

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Pega o token uma vez para todos os filhos
    setCsrfToken(getCookie("csrftoken"));
  }, []);

  const renderContent = () => {
    if (activePage === "dashboard")
      return <AdminOverview csrfToken={csrfToken} />;
    if (activePage === "categorias")
      return <AdminCategory csrfToken={csrfToken} />;
    if (activePage === "produtos")
      return <AdminProduct csrfToken={csrfToken} />;
    if (activePage === "configuracoes")
      return <AdminConfigSite csrfToken={csrfToken} />;
    return <AdminOverview csrfToken={csrfToken} />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fixo que controla o estado activePage */}
      <SidebarAdmin activePage={activePage} onNavigate={setActivePage} />

      <div className="flex-1 flex flex-col">
        {/* Header fixo que pode receber o título dinâmico */}
        <AdminHeader
          title={
            activePage === "dashboard"
              ? "Painel de Controle"
              : activePage === "categorias"
                ? "Gerenciar Categorias"
                : activePage === "produtos"
                  ? "Gerenciar Produtos"
                  : "Configurações do Site"
          }
          breadcrumb={`Admin / ${
            activePage === "dashboard"
              ? "Dashboard"
              : activePage === "categorias"
                ? "Categorias"
                : activePage === "produtos"
                  ? "Produtos"
                  : "Configurações"
          }`}
        />

        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
