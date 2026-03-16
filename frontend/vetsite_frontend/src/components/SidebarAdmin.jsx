import React from 'react';
import { LayoutDashboard, Package, List, Settings } from 'lucide-react';

const Sidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: 'produtos', label: 'Produtos', icon: <Package /> },
    { id: 'categorias', label: 'Categorias', icon: <List /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings /> },
  ];

  return (
    <div className="w-[280px] bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* ... logo ... */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)} // Aqui acontece a mágica
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              activePage === item.id 
                ? 'bg-teal-50 text-teal-600 font-bold' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;