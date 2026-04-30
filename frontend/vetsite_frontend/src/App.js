import React from "react";
// O Outlet é um componente do react-router-dom que serve como um "espaço reservado".
// Ele renderiza o componente da rota filha correspondente à URL atual.
import { Outlet } from "react-router-dom";

/**
 * Componente Raiz: App
 * Este componente envolve toda a aplicação.
 * É o local ideal para definir layouts globais que devem aparecer em todas as páginas
 * ou para envolver a aplicação com Provedores de Contexto (Context Providers).
 */
function App() {
  return (
    // A classe "App" pode ser usada para aplicar estilos globais de fonte ou reset de CSS.
    <div className="App">
      {/* 
        O Outlet funciona como um "buraco" onde o conteúdo de cada página 
        (Home, Products, Contact, etc.) será inserido dinamicamente.
      */}
      <Outlet />
    </div>
  );
}

export default App;
