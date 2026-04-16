import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Chamada GET apenas para o Django plantar o cookie csrftoken no navegador
    fetch("/api/products/", { credentials: "include" })
      .then(() => console.log("Cookie CSRF solicitado ao servidor"))
      .catch((err) => console.error("Erro ao solicitar cookie:", err));
    fetch("/api-auth/login/", { method: "GET" });
  }, []);

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
    const csrfToken = getCookie("csrftoken");

    // Criamos um corpo de formulário clássico
    const details = new URLSearchParams({
      username: username,
      password: password,
    });

    try {
      const response = await fetch("/api-auth/login/", {
        method: "POST",
        headers: {
          // O Django padrão espera esse Content-Type para gerar a sessão
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrfToken || "",
        },
        body: details,
        credentials: "include", // ESSENCIAL para receber o sessionid
      });

      // Se o Django responder 200 ou 302 (redirecionamento), ele enviará o cookie
      if (response.ok || response.status === 302) {
        console.log("Login realizado com sucesso!");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        alert("Falha no login. Verifique usuário e senha.");
      }
    } catch (error) {
      console.error("Erro:", error);
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
