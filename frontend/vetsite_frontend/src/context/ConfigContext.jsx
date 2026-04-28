// --- IMPORTANDO BIBLIOTECAS ---
import React, { createContext, useContext, useEffect, useState } from "react";

export const ConfigContext = createContext();

/*
    ConfigProvider
    Um context responsável por puxar dados de configurações do site e retorna-lo como um conjunto de dados legíveis para o React

*/

export const ConfigProvider = ({ children }) => {
  // --- ESTADOS ---

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chamada de API dos dados de Config
    console.log("Iniciando busca de configurações...");
    fetch("/api/configuration/")
      // Transforma o conjunto de dados em json
      .then((res) => {
        console.log("Resposta do servidor:", res.status);
        return res.json();
      })
      // Pega a data e "seta" no estado de Config e seta o Loading para false
      .then((data) => {
        console.log("Dados recebidos:", data);
        const configData = Array.isArray(data) ? data[0] : data;
        setConfig(configData);
        setLoading(false);
      })
      // Caso o dado pego seja um error, alerta via console.
      .catch((err) => {
        console.error("Erro ao carregar configurações:", err);
        setLoading(false);
      });
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
