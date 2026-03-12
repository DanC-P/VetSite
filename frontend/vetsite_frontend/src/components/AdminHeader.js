import React from 'react';

const AdminHeader = ({ title, breadcrumb }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 font-medium">
            {breadcrumb}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            {title}
          </h1>
        </div>
        
        {/* Lado Direito: Perfil */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Admin</p>
            <p className="text-xs text-teal-600 font-medium">Acesso Total</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;