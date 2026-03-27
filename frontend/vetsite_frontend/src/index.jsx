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
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/produtos",
        element: <Products />,
      },
      {
        path: "/sobre",
        element: <AboutUs />,
      },
      {
        path: "/contato",
        element: <Contact />,
      },
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
      {
        path: "overview",
        element: <AdminOverview />,
      },
      {
        path: "reg_produtos",
        element: <AdminProduct />,
      },
      {
        path: "reg_categorias",
        element: <AdminCategory />,
      },
      {
        path: "config_site",
        element: <AdminConfigSite />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

reportWebVitals();
