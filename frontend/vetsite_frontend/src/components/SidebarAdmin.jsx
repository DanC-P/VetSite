import React from "react";
import { LayoutDashboard, Package, List, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // Removi a "/" inicial para usar caminhos relativos às sub-rotas do Dashboard
  const menuItems = [
    {
      path: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    { path: "reg_produtos", label: "Produtos", icon: <Package size={20} /> },
    { path: "reg_categorias", label: "Categorias", icon: <List size={20} /> },
    {
      path: "config_site",
      label: "Configurações",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="w-[280px] bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <span className="text-xl font-bold text-teal-600">VetSite Admin</span>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-teal-50 text-teal-600 font-bold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
