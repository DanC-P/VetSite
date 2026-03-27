import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Função para pegar o CSRF Token (Essencial para POST no Django)
  const getCookie = (name) => {
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
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // USAMOS URL RELATIVA: O Django agora serve o React, então o domínio é o mesmo.
      const token = getCookie("csrftoken");

      const response = await fetch("/api-auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": token || "",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
          next: "/api/products/", // Truque: Dizemos ao Django para onde olhar internamente
        }),
        credentials: "include", // OBRIGATÓRIO para salvar o cookie de sessão no navegador
      });

      // O Django DRF retorna 200 em caso de sucesso no login via POST
      if (response.ok) {
        console.log("Login realizado com sucesso!");
        localStorage.setItem("isLoggedIn", "true");

        // Forçamos o redirecionamento manual no React
        navigate("/dashboard");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro no login:", errorData);
        alert("Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro na comunicação com o servidor:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">VetSite Admin</h2>
          <p className="text-gray-500 mt-2">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95"
          >
            Entrar no Painel
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm font-semibold text-gray-400 hover:text-blue-600 transition-colors"
            >
              ← Voltar para a vitrine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
