import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// Importação das suas Pages
import {
  Home,
  Login,
  AdminDashboard,
  AdminOverview,
  AdminProduct,
  AdminCategory,
  AdminConfigSite,
  Products,
  AboutUs,
  Contact,
} from "./pages";

// Importação dos Componentes de Segurança e Contexto
import PrivateRoute from "./components/PrivateRoute";
import { ConfigProvider } from "./context/ConfigContext";

/**
 * DEFINIÇÃO DAS ROTAS
 * Usamos a estrutura de objetos do createBrowserRouter
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // O App contém o Outlet para as rotas públicas
    children: [
      { index: true, element: <Home /> },
      { path: "produtos", element: <Products /> },
      { path: "sobre", element: <AboutUs /> },
      { path: "contato", element: <Contact /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/overview" replace />,
      },
      { path: "overview", element: <AdminOverview /> },
      { path: "reg_produtos", element: <AdminProduct /> },
      { path: "reg_categorias", element: <AdminCategory /> },
      { path: "config_site", element: <AdminConfigSite /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

/**
 * RENDERIZAÇÃO PRINCIPAL
 * O ConfigProvider envolve o RouterProvider para que
 * o contexto flutue por todas as rotas.
 * Sendo ConfigProvider o responsável por "distribuir" os dados de configuração.
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
);

reportWebVitals();
