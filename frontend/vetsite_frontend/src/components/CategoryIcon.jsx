// --- IMPORTANDO BIBLIOTECAS ---
import React from "react";
import * as LucideIcons from "lucide-react";

/**
 * COMPONENTE: CategoryIcon
 * Objetivo: Atuar como um "Dicionário de Ícones" dinâmico.
 * * Por que isso é importante?
 * O banco de dados (Django) armazena apenas uma String (ex: "Dog", "Cat", "Fish").
 * Este componente recebe essa string e a mapeia para o componente React real da biblioteca Lucide.
 */
const CategoryIcon = ({ iconName, className }) => {
  /**
   * LÓGICA DE MAPEAMENTO:
   * Acessamos o objeto LucideIcons usando a string vinda do banco como chave.
   * Ex: Se iconName for "Bird", LucideIcons["Bird"] retorna o componente <Bird />.
   */
  const IconComponent = LucideIcons[iconName];

  /**
   * SISTEMA DE FALLBACK (SEGURANÇA):
   * Caso o administrador digite um nome de ícone que não existe ou o campo venha vazio,
   * o sistema não "quebra". Ele exibe o ícone de 'PawPrint' (Patas) como padrão,
   * garantindo que a interface sempre tenha um elemento visual.
   */
  if (!IconComponent) {
    // Usamos o PawPrint por ser o ícone universal para Pet Shops/Veterinárias
    return <LucideIcons.PawPrint className={className} />;
  }

  // Retorna o componente encontrado com as classes de estilização (Tailwind) enviadas pelo pai
  return <IconComponent className={className} />;
};

export default CategoryIcon;
