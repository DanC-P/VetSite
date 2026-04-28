import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  List,
  Trash2,
  Plus,
  X,
  Dog,
  Cat,
  Heart,
  Bone,
  ShieldCheck,
  Activity,
  Soup,
  Scissors,
  PawPrint,
  Edit2,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Toast } from "../components";

/**
 * MAPEAMENTO DE ÍCONES:
 * Como o banco de dados (Django) guarda apenas o nome (string) do ícone,
 * este objeto traduz essa string para o componente React do Lucide.
 */
const ICON_MAP = {
  Dog: <Dog />,
  Cat: <Cat />,
  Heart: <Heart />,
  Bone: <Bone />,
  Activity: <Activity />,
  Soup: <Soup />,
  Scissors: <Scissors />,
  ShieldCheck: <ShieldCheck />,
};

// Transforma as chaves do mapa em um array para facilitar a renderização dos botões de escolha
const ICON_OPTIONS = Object.keys(ICON_MAP).map((name) => ({
  name,
  icon: ICON_MAP[name],
}));

const AdminCategory = () => {
  // --- ESTADOS DA LISTAGEM E UI ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null); // Referência para scroll automático até o formulário

  // --- ESTADOS DE EDIÇÃO E EXCLUSÃO ---
  const [editingId, setEditingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Estado do Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Token CSRF vindo do Layout Pai (Dashboard/Outlet)
  const { csrfToken } = useOutletContext();

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    icon_name: "Dog",
  });

  /**
   * BUSCA DE DADOS: Puxa todas as categorias do Django
   */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/categories/");

      // Redireciona se houver erro de permissão (Sessão expirada)
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      triggerAlert("Erro ao carregar categorias", "error");
      console.error("Erro ao sincronizar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /// --- GATILHO DO TOAST ---
  const triggerAlert = (message, type) => {
    setToast({ show: true, message, type });
  };

  /**
   * Prepara o formulário para uma nova categoria
   */
  const handleOpenNewForm = () => {
    setFormData({ name: "", icon_name: "Dog" });
    setEditingId(null);
    setShowForm(true);
    // Scroll suave para o formulário após a renderização
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  /**
   * EXCLUSÃO: Deleta uma categoria via API
   */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": csrfToken },
      });
      if (res.ok) {
        triggerAlert("Categoria excluída com sucesso!", "success");
        fetchData();
      } else {
        triggerAlert("Erro ao deletar categoria.", "error");
      }
    } catch (err) {
      triggerAlert("Erro ao excluir categoria.");
    }
  };

  /**
   * EDIÇÃO: Preenche o formulário com dados existentes
   */
  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      icon_name: category.icon_name,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * SUBMIT: Criação (POST) ou Atualização (PATCH)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      triggerAlert("Erro de segurança: Token CSRF ausente.", "error");
      return;
    }

    if (!formData.name) {
      triggerAlert("O nome da categoria é obrigatório.");
      return;
    }

    const url = editingId
      ? `/api/categories/${editingId}/`
      : "/api/categories/";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        triggerAlert(
          editingId ? "Categoria atualizada!" : "Categoria criada!",
          "success",
        );
        setShowForm(false);
        setEditingId(null);
        fetchData();
      } else {
        const errorData = await res.json();
        triggerAlert(
          "Erro: " + (errorData.detail || "Dados inválidos"),
          "error",
        );
      }
    } catch (err) {
      triggerAlert("Erro ao salvar categoria");
    }
  };

  // --- RENDERS ---

  if (loading)
    return (
      <div className="p-8 text-center italic">Carregando categorias...</div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* HEADER DA PÁGINA */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Gerenciar Categorias
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {categories.length} categorias encontradas no sistema
          </p>
        </div>
        <button
          onClick={handleOpenNewForm}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-teal-100"
        >
          <Plus size={20} /> Nova Categoria
        </button>
      </div>

      {/* GRID DE CATEGORIAS CADASTRADAS */}
      <div className="mb-12">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Renderização dinâmica do ícone baseado no mapeamento global */}
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                    {ICON_MAP[cat.icon_name] || <List />}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 uppercase tracking-tighter text-lg">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-bold italic">
                      ID do Ícone: {cat.icon_name}
                    </p>
                  </div>
                </div>

                {/* Ações: Editar e Excluir */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-3 text-gray-200 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <PawPrint className="text-gray-100 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-400 italic uppercase tracking-tight">
              Nenhuma categoria encontrada
            </h3>
          </div>
        )}
      </div>

      {/* FORMULÁRIO DE CATEGORIA (Renderiza apenas se showForm for true) */}
      {showForm && (
        <div
          ref={formRef}
          className="bg-white rounded-3xl shadow-2xl border-2 border-teal-50 p-8 animate-in slide-in-from-bottom-10 duration-500"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-widest">
              {editingId ? "Editar Categoria" : "Nova Categoria"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Campo Nome */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Nome da Categoria
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all font-bold"
                  placeholder="Ex: Rações, Farmácia..."
                  required
                />
              </div>

              {/* Preview Grande do Ícone Selecionado */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-4 border border-dashed border-gray-200">
                <span className="text-[10px] font-black text-gray-300 uppercase mb-2">
                  Visualização da Capa
                </span>
                <div className="text-teal-600 scale-[2.0]">
                  {ICON_MAP[formData.icon_name]}
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE ÍCONES: Mapeia as opções disponíveis para botões clicáveis */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">
                Selecione o Ícone Representativo
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon_name: opt.name })
                    }
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                      formData.icon_name === opt.name
                        ? "border-teal-500 bg-teal-50 text-teal-600 shadow-sm scale-105"
                        : "border-gray-100 text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-teal-700 transition-all uppercase tracking-widest"
            >
              {editingId ? "SALVAR ALTERAÇÕES" : "CRIAR NOVA CATEGORIA"}
            </button>
          </form>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800">Tem certeza?</h3>
            <p className="text-gray-500 text-sm mt-2">
              Você está excluindo <strong>{categoryToDelete.name}</strong>. Esta
              ação é irreversível.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDelete(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminCategory;
