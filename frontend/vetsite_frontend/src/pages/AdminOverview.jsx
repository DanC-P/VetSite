import React, { useState, useEffect } from "react";
import {
  Package,
  Layers,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom"; // Assumindo que você usa react-router

const AdminOverview = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    loading: true,
  });
  const navigate = useNavigate();

  const productToPass = {
    title: "",
    price: "",
    old_price: "",
    fr_group_id: "",
    description: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products/"),
          fetch("/api/categories/"),
        ]);
        const products = await prodRes.json();
        const categories = await catRes.json();
        setData({ products, categories, loading: false });
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="p-12 text-center animate-pulse italic text-gray-400">
        Gerando relatório estatístico...
      </div>
    );
  }

  // Cálculos para o Dashboard
  const activeProducts = data.products.filter((p) => p.is_active).length;
  const lowStockProducts = data.products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= 5,
  );
  const outOfStock = data.products.filter((p) => p.stock_quantity === 0).length;
  const totalStockValue = data.products.reduce(
    (acc, p) => acc + parseFloat(p.price) * (p.stock_quantity || 0),
    0,
  );

  const handleNavigate = () => {
    navigate("/dashboard/reg_produtos", { state: { productToPass } });
  };

  const stats = [
    {
      title: "Total Produtos",
      value: data.products.length,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Categorias",
      value: data.categories.length,
      icon: Layers,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Ativos na Loja",
      value: activeProducts,
      icon: CheckCircle2,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Valor em Estoque",
      value: `R$ ${totalStockValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo de volta! Aqui está o resumo do seu inventário hoje.
        </p>
      </header>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
            >
              <s.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              {s.title}
            </p>
            <h3 className="text-2xl font-black text-gray-800">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alertas de Estoque Crítico */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800 uppercase italic tracking-tighter">
                Atenção ao Estoque
              </h2>
            </div>
            <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-black">
              {lowStockProducts.length + outOfStock} ALERTAS
            </span>
          </div>

          <div className="p-4">
            {lowStockProducts.length === 0 && outOfStock === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium italic">
                Tudo sob controle no estoque!
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  ...(outOfStock > 0
                    ? data.products.filter((p) => p.stock_quantity === 0)
                    : []),
                  ...lowStockProducts,
                ]
                  .slice(0, 5)
                  .map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={prod.image}
                          className="w-12 h-12 rounded-xl object-cover"
                          alt=""
                        />
                        <div>
                          <div className="font-bold text-gray-800">
                            {prod.title}
                          </div>
                          <div
                            className={`text-[10px] font-black uppercase ${prod.stock_quantity === 0 ? "text-red-500" : "text-orange-500"}`}
                          >
                            {prod.stock_quantity === 0
                              ? "ESGOTADO"
                              : `Apenas ${prod.stock_quantity} unidades`}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="p-6 bg-gray-50/50 text-center">
            <button className="text-sm font-bold text-teal-600 hover:underline">
              Ver inventário completo
            </button>
          </div>
        </div>

        {/* Atalhos Rápidos & Ações */}
        <div className="space-y-6">
          <div className="bg-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-teal-100 relative overflow-hidden group">
            <ShoppingCart
              className="absolute -right-4 -bottom-4 text-teal-500 opacity-20 group-hover:scale-110 transition-transform"
              size={140}
            />
            <h3 className="text-2xl font-black mb-2 italic">Novo Produto</h3>
            <p className="text-teal-100 text-sm mb-6 font-medium leading-relaxed">
              Cadastre novos itens para sua loja agora mesmo.
            </p>
            <button
              onClick={handleNavigate}
              className="bg-white text-teal-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-teal-50 transition-colors"
            >
              IR PARA CADASTRO
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-800 mb-4 uppercase italic">
              Resumo de Atividade
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">
                  Produtos Ativos
                </span>
                <span className="font-bold text-gray-800">
                  {activeProducts}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full"
                  style={{
                    width: `${(activeProducts / data.products.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {((activeProducts / data.products.length) * 100).toFixed(1)}% do
                catálogo está online
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
