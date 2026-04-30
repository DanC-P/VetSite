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
    const loadConfig = () => {
      console.log("Buscando atualizações de configuração...");

      fetch("/api/configuration/")
        .then((res) => {
          if (!res.ok) throw new Error("Erro na resposta do servidor");
          return res.json();
        })
        .then((data) => {
          const configData = Array.isArray(data) ? data[0] : data;

          // SUTILEZA: Só atualiza o estado se houver mudança real nos dados
          setConfig((prevConfig) => {
            if (JSON.stringify(prevConfig) !== JSON.stringify(configData)) {
              console.log("Configurações atualizadas dinamicamente!");
              return configData;
            }
            return prevConfig;
          });
        })
        .catch((err) => {
          console.error("Erro ao carregar configurações:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // 1. Execução imediata ao montar o Contexto
    loadConfig();

    // 2. Define o intervalo de verificação (ex: a cada 60 segundos)
    // Configurações mudam com menos frequência que produtos, então 1 minuto é um bom tempo.
    const interval = setInterval(loadConfig, 60000);

    // 3. Limpeza ao desmontar o Provider
    return () => clearInterval(interval);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
