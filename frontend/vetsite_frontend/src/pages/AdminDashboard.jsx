import React, { useState, useEffect } from "react";
import { SidebarAdmin, AdminHeader } from "../components";
import AdminProduct from "./AdminProduct"; // A view de produtos que criamos
import AdminOverview from "./AdminOverview"; // Uma view de dashboard/estatísticas
import AdminCategory from "./AdminCategory";
import AdminConfigSite from "./AdminConfigSite";
import { Outlet, useOutletContext } from "react-router-dom";

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
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Pega o token uma vez para todos os filhos
    setCsrfToken(getCookie("csrftoken"));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin /> {/* Note: Sem props de activePage! */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* A MÁGICA: O Outlet renderiza o filho da URL atual.
              A prop 'context' envia o token para QUALQUER filho que for renderizado aqui.
          */}
          <Outlet context={{ csrfToken }} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
