// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import { useLocation } from "react-router-dom";

/**
 * CONFIGURAÇÃO DE NAVEGAÇÃO (ESTÁTICA)
 * Definimos os títulos e breadcrumbs fora do componente para evitar
 * que sejam recriados na memória a cada renderização do React.
 */
const MENU_TITULOS = [
  {
    path: "overview",
    breadcrumb: "Dashboard",
    title: "Painel Geral",
  },
  {
    path: "reg_produtos",
    breadcrumb: "Produtos",
    title: "Gerenciar Produtos",
  },
  {
    path: "reg_categorias",
    breadcrumb: "Categorias",
    title: "Gerenciar Categorias",
  },
  {
    path: "config_site",
    breadcrumb: "Configurações",
    title: "Gerenciar Configurações do Site",
  },
];

const AdminHeader = () => {
  // Hook do react-router-dom para identificar a URL atual
  const location = useLocation();
  const { pathname } = location;

  /**
   * LÓGICA DE BUSCA:
   * Filtramos o array de títulos comparando com a URL atual (pathname).
   * O uso do 'find' garante que pegaremos o primeiro mapeamento correspondente.
   */
  const itemAtual = MENU_TITULOS.find((item) => pathname.includes(item.path));

  // --- JSX DO COMPONENTE ---
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* LADO ESQUERDO: Identificação da Página */}
        <div className="flex flex-col">
          {/* O breadcrumb ajuda o usuário a se localizar na hierarquia do app */}
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {itemAtual?.breadcrumb || "VetSite Admin"}
          </span>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            {itemAtual?.title || "Bem-vindo"}
          </h1>
        </div>

        {/* LADO DIREITO: Perfil do Usuário */}
        <div className="flex items-center gap-4">
          {/* Informações de nível de acesso (Hardcoded para fins de interface de Admin) */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Administrador</p>
            <p className="text-xs text-teal-600 font-medium italic">
              Sessão Ativa
            </p>
          </div>

          {/* Avatar com Gradiente seguindo a identidade visual do VetSite */}
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-teal-700 
                       flex items-center justify-center text-white font-bold shadow-sm 
                       border-2 border-white ring-2 ring-teal-50"
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
