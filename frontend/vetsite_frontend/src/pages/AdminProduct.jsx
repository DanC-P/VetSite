import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  UploadCloud,
  Save,
  Edit2,
  Trash2,
  Plus,
  X,
  Star,
  AlertCircle,
} from "lucide-react";
import {
  useLocation,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

const AdminProduct = () => {
  // --- ESTADOS ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const location = useLocation();
  const productFromState = location.state?.productToPass;

  const { csrfToken } = useOutletContext();

  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    old_price: "",
    fr_group_id: "",
    description: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
  });

  // --- BUSCA DE DADOS ---
  const fetchData = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products/"),
        fetch("/api/categories/"),
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      setProducts(dataProd);
      setCategories(dataCat);
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (productFromState) {
      handleOpenNewForm();

      window.history.replaceState({}, document.title);
    }
  }, [productFromState]);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      old_price: product.old_price || "",
      fr_group_id: product.fr_group?.id || product.fr_group || "",
      description: product.description || "",
      stock_quantity: product.stock_quantity || 0,
      is_active: product.is_active,
      is_featured: product.is_featured,
    });
    setPreviewUrl(product.image);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenNewForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      price: "",
      old_price: "",
      fr_group_id: "",
      description: "",
      stock_quantity: 0,
      is_active: true,
      is_featured: false,
    });
    setPreviewUrl(null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      const res = await fetch(`/api/products/${id}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": csrfToken },
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- ENVIO (POST/PATCH) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      alert(
        "Erro de segurança: Token CSRF não encontrado. Tente atualizar a página.",
      );
      return;
    }

    const dataToSend = new FormData();

    dataToSend.append("title", formData.title);
    dataToSend.append("price", formData.price);
    dataToSend.append("description", formData.description);
    dataToSend.append("stock_quantity", formData.stock_quantity);
    dataToSend.append("is_active", formData.is_active);
    dataToSend.append("is_featured", formData.is_featured);

    if (formData.old_price) {
      dataToSend.append("old_price", formData.old_price);
    }

    const catId = formData.fr_group_id?.id || formData.fr_group_id;

    if (catId) {
      dataToSend.append("fr_group_id", catId);
    }

    if (imageFile instanceof File) {
      dataToSend.append("image", imageFile);
    }

    const url = editingId ? `/api/products/${editingId}/` : "/api/products/";
    const method = editingId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSend,
        credentials: "include",
        headers: { "X-CSRFToken": csrfToken },
      });

      if (response.ok) {
        alert(editingId ? "✅ Produto atualizado!" : "✅ Produto criado!");
        setShowForm(false);
        setEditingId(null);
        setImageFile(null);
        fetchData();
      } else {
        const err = await response.json();
        console.error("Erro do Django:", err);
        alert("Erro ao salvar: " + JSON.stringify(err));
      }
    } catch (err) {
      alert("Erro na conexão com o servidor.");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-600"></div>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* --- HEADER DINÂMICO --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {showForm
              ? editingId
                ? `Editando: ${formData.title}`
                : "Cadastrar Novo Produto"
              : "Gestão de Inventário"}
          </h2>
          <p className="text-sm text-gray-500 mt-1  ">
            {showForm
              ? "Certifique-se de preencher todos os campos obrigatórios."
              : `${products.length} produtos listados no sistema`}
          </p>
        </div>

        {/* Só mostra o botão de "Novo" se a lista estiver visível */}
        {!showForm && (
          <button
            onClick={handleOpenNewForm}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-100"
          >
            <Plus size={20} /> Novo Produto
          </button>
        )}
      </div>

      {/* --- LÓGICA DE ALTERNÂNCIA DE TELAS --- */}
      {showForm ? (
        /* 1. TELA DO FORMULÁRIO (SOBREPÕE A LISTA) */
        <div
          ref={formRef}
          className="bg-white rounded-3xl shadow-xl border border-teal-100 p-8 animate-in fade-in slide-in-from-bottom-6"
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
            <h2 className="text-2xl font-black text-gray-800">
              {editingId ? "Informações do Produto" : "Novo Registro"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Título do Produto
                </label>
                <input
                  name="title"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Ração Premium 15kg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Categoria
                </label>
                <select
                  name="fr_group_id"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
                  value={formData.fr_group_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Preço de Venda (R$)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Preço Antigo (R$)
                </label>
                <input
                  type="number"
                  name="old_price"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-400"
                  value={formData.old_price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Estoque Inicial
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Descrição do Produto
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva detalhes do produto, benefícios, etc..."
                />
              </div>
            </div>

            {/* Upload de Imagem */}
            <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 flex flex-col items-center">
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    className="w-40 h-40 object-cover rounded-2xl shadow-md"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <UploadCloud size={48} className="text-gray-300 mb-2" />
                  <span className="text-sm font-bold text-gray-400">
                    Clique para subir a foto
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-teal-600 text-white font-black rounded-xl hover:bg-teal-700 flex items-center gap-2 transition-all"
              >
                <Save size={18} />{" "}
                {editingId ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                VOLTAR PARA LISTA
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 2. TELA DA TABELA (SÓ APARECE SE SHOWFORM FOR FALSE) */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          {products.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-24">
              <div className="bg-gray-50 p-6 rounded-3xl mb-4">
                <Package className="text-gray-200" size={64} />
              </div>
              <h3 className="text-xl font-bold text-gray-400 italic uppercase">
                Nenhum produto encontrado
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                      Foto
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                      Produto
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                      Status / Estoque
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                      Preço
                    </th>
                    <th className="px-8 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((prod) => (
                    <tr
                      key={prod.id}
                      className="cursor-pointer transition-all hover:bg-teal-50/30 group"
                    >
                      <td className="px-8 py-4">
                        <img
                          alt={`Imagem de categoria ${prod.fr_group}`}
                          src={prod.image}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </td>
                      <td className="px-8 py-4">
                        <div className="font-bold text-gray-800">
                          {prod.title}
                        </div>
                        <div className="text-xs text-teal-600 font-bold uppercase">
                          {prod.fr_group?.name || "Geral"}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${prod.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {prod.is_active ? "Ativo" : "Inativo"}
                          </span>
                          <span
                            className={`text-xs font-bold ${prod.stock_quantity === 0 ? "text-orange-500" : "text-gray-400"}`}
                          >
                            Estoque: {prod.stock_quantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-black text-gray-700">
                        R$ {prod.price}
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(prod)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
