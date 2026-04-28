// --- IMPORTANDO BIBLIOTECAS ---

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
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Toast } from "../components";

/**
 * PAGE: AdminOverview
 * Objetivo: Fornecer um resumo executivo do inventário e status da loja.
 * Técnica: Consome 'config' do OutletContext para personalização e busca dados
 * específicos (produtos/categorias) localmente para evitar sobrecarga no App.jsx.
 */
const AdminOverview = () => {
  // Pegamos a config do Dashboard pai (opcional, caso queira usar o nome da loja no título)
  const { config } = useOutletContext();
  const navigate = useNavigate();

  const [data, setData] = useState({
    products: [],
    categories: [],
    loading: true,
  });

  // Estado do Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  /**
   * Dispara o alerta visual customizado na tela
   */
  const triggerAlert = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Molde de estado inicial para criação de novo produto
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
        // Busca paralela para otimizar tempo de resposta
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products/"),
          fetch("/api/categories/"),
        ]);

        // Verificação de autenticação básica
        if (prodRes.status === 401 || prodRes.status === 403) {
          window.location.href = "/login";
          return;
        }

        const products = await prodRes.json();
        const categories = await catRes.json();
        setData({ products, categories, loading: false });
      } catch (err) {
        triggerAlert("Erro ao carregar dados.", "error");
        setData((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  // --- LÓGICA DE NEGÓCIO (DERIVADA DO ESTADO) ---
  const activeProducts = data.products.filter((p) => p.is_active).length;
  const lowStockProducts = data.products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= 5,
  );
  const outOfStock = data.products.filter((p) => p.stock_quantity === 0);

  const totalStockValue = data.products.reduce(
    (acc, p) => acc + parseFloat(p.price || 0) * (p.stock_quantity || 0),
    0,
  );

  const handleNavigateToRegister = () => {
    navigate("/dashboard/reg_produtos", { state: { productToPass } });
  };

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="italic animate-pulse">
          Compilando estatísticas de inventário...
        </p>
      </div>
    );
  }

  // Definição dos cartões de métricas
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
      value: totalStockValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full space-y-10">
      {/* HEADER DINÂMICO */}
      <header>
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter">
          Resumo da{" "}
          <span className="text-teal-600">{config?.title_site || "Loja"}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Dashboard de inventário atualizado em tempo real.
        </p>
      </header>

      {/* GRID DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <article
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-lg"
          >
            <div
              className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
            >
              <s.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">
              {s.title}
            </p>
            <h3 className="text-2xl font-black text-gray-900">{s.value}</h3>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ALERTAS DE ESTOQUE CRÍTICO */}
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800 uppercase italic tracking-tighter">
                Alertas Críticos
              </h2>
            </div>
            <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-[10px] font-black">
              {outOfStock.length + lowStockProducts.length} ITENS EM RISCO
            </span>
          </div>

          <div className="flex-1 p-4">
            {data.products.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-medium">
                Sem produtos cadastrados.
              </div>
            ) : outOfStock.length === 0 && lowStockProducts.length === 0 ? (
              <div className="py-20 text-center text-teal-600 font-bold italic">
                Estoque saudável! ✨
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {[...outOfStock, ...lowStockProducts]
                  .slice(0, 5)
                  .map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={prod.image}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                          alt=""
                        />
                        <div>
                          <div className="font-bold text-gray-800 text-sm leading-tight">
                            {prod.title}
                          </div>
                          <div
                            className={`text-[10px] font-black mt-1 uppercase ${prod.stock_quantity === 0 ? "text-red-500" : "text-orange-500"}`}
                          >
                            {prod.stock_quantity === 0
                              ? "⚠️ Sem estoque"
                              : `⚠️ Apenas ${prod.stock_quantity} unidades`}
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/dashboard/reg_produtos?id=${prod.id}`}
                        className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50/50 text-center">
            <Link
              to="/dashboard/reg_produtos"
              className="text-xs font-black uppercase tracking-widest text-teal-600 hover:text-teal-700"
            >
              Gerenciar Inventário Completo
            </Link>
          </div>
        </section>

        {/* COLUNA LATERAL: ATALHOS */}
        <aside className="space-y-6">
          <div
            className="bg-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-teal-100 relative overflow-hidden group cursor-pointer"
            onClick={handleNavigateToRegister}
          >
            <ShoppingCart
              className="absolute -right-6 -bottom-6 text-teal-500 opacity-20 group-hover:scale-125 transition-transform duration-500"
              size={160}
            />
            <h3 className="text-2xl font-black mb-2 italic tracking-tighter">
              Novo Produto
            </h3>
            <p className="text-teal-50 text-xs mb-8 font-medium leading-relaxed opacity-90">
              Expanda seu catálogo. Adicione novos itens à vitrine rapidamente.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-teal-600 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-teal-50 transition-colors">
              Iniciar Cadastro <ArrowRight size={14} />
            </div>
          </div>

          {/* INDICADOR DE SAÚDE DO CATÁLOGO */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-widest">
              Saúde da Vitrine
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-gray-800">
                    {activeProducts}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Online
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-teal-600">
                    {(
                      (activeProducts / (data.products.length || 1)) *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Taxa
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(activeProducts / (data.products.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sistema de Alerta Centralizado */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default AdminOverview;
