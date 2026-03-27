import React, { useState, useEffect, useRef } from "react";
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

// Mapeamento de ícones para renderização dinâmica
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

const ICON_OPTIONS = Object.keys(ICON_MAP).map((name) => ({
  name,
  icon: ICON_MAP[name],
}));

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [editingId, setEditingId] = useState(null);

  const { csrfToken } = useOutletContext();

  const [formData, setFormData] = useState({
    name: "",
    icon_name: "Dog",
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/categories/");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenNewForm = () => {
    setFormData({ name: "", icon_name: "Dog" });
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;
    try {
      const res = await fetch(`/api/categories/${id}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": csrfToken },
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      icon_name: category.icon_name,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar.");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center italic">Carregando categorias...</div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
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

      {/* Grid ou Empty State */}
      <div className="mb-12">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                    {ICON_MAP[cat.icon_name] || <List />}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 uppercase tracking-tighter text-lg">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-bold italic">
                      Identificador: {cat.icon_name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-3 text-red-200 hover:text-blue-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-3xl mb-4">
              <PawPrint className="text-gray-200" size={64} />
            </div>
            <h3 className="text-xl font-bold text-gray-400 italic uppercase tracking-tight text-center">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-sm text-gray-400 mt-2 text-center px-4">
              Sua vitrine está vazia. Comece criando uma nova categoria acima.
            </p>
          </div>
        )}
      </div>

      {/* Formulário Refatorado */}
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
              {/* Nome */}
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

              {/* Preview do Ícone que agora é a "Capa" */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-4 border border-dashed border-gray-200">
                <span className="text-[10px] font-black text-gray-300 uppercase mb-2">
                  Visualização do Ícone
                </span>
                <div className="text-teal-600 scale-[2.0]">
                  {ICON_MAP[formData.icon_name]}
                </div>
              </div>
            </div>

            {/* Seleção de Ícone */}
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
    </div>
  );
};

export default AdminCategory;
