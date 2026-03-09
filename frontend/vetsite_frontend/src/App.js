import React from 'react';
import Home from './pages/Home'; // Certifique-se de que o caminho está correto

function App() {
  return (
    <div className="App">
      {/* Chamamos apenas a Home aqui. 
        Como a Home já contém Navbar, Hero, etc., 
        tudo aparecerá em cascata.
      */}
      <Home />
    </div>
  );
}

export default App;
