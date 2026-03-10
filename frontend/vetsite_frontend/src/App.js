import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; // <--- VOCÊ PRECISA IMPORTAR O NOVO COMPONENTE AQUI

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota principal do site */}
          <Route path="/" element={<Home />} />

          {/* Rota de Login que estava faltando no seu código */}
          <Route path="/login" element={<Login />} />

          {/* Rota do Dashboard protegida */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Redirecionamento de segurança para rotas inexistentes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;