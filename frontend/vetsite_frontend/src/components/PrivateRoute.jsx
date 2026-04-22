import React from "react";
import { Navigate } from "react-router-dom";

/**
 * COMPONENTE: PrivateRoute
 * Objetivo: Proteção de rotas administrativas (Dashboard).
 * * Como funciona:
 * Este componente atua como um "Wrapper" (embrulho). Ele verifica o estado
 * de autenticação do usuário antes de renderizar o conteúdo da página.
 */
const PrivateRoute = ({ children }) => {
  /**
   * VERIFICAÇÃO DE AUTH:
   * No momento, estamos utilizando o localStorage para persistir o login.
   * Em uma aplicação real, aqui também poderíamos validar a expiração de um Token JWT.
   */
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  /**
   * LÓGICA DE REDIRECIONAMENTO:
   * - Se logado: Renderiza os 'children' (a página que o usuário tentou acessar).
   * - Se não logado: Redireciona para '/login' usando o componente Navigate,
   * impedindo o acesso a dados sensíveis do administrador.
   */
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
