import * as LucideIcons from "lucide-react";

const CategoryIcon = ({ iconName, className }) => {
  // 1. Tenta pegar o ícone pelo nome vindo do banco
  const IconComponent = LucideIcons[iconName];

  // 2. Se não existir (ou for nulo), usa o PawPrint como padrão (Fallback)
  if (!IconComponent) {
    return <LucideIcons.PawPrint className={className} />;
  }

  return <IconComponent className={className} />;
};

export default CategoryIcon;
