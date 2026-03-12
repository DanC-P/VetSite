import React, { useState, useEffect, useRef } from 'react';
import { 
  List, UploadCloud, Save, Trash2, Plus, X, 
  Dog, Cat, Heart, Bone, ShieldCheck, Activity, Soup, Scissors 
} from 'lucide-react';

// Lista de ícones disponíveis para o usuário escolher
const ICON_OPTIONS = [
  { name: 'Dog', icon: <Dog /> },
  { name: 'Cat', icon: <Cat /> },
  { name: 'Heart', icon: <Heart /> },
  { name: 'Bone', icon: <Bone /> },
  { name: 'Activity', icon: <Activity /> },
  { name: 'Soup', icon: <Soup /> },
  { name: 'Scissors', icon: <Scissors /> },
  { name: 'ShieldCheck', icon: <ShieldCheck /> },
];

const AdminCategory = ({ csrfToken }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    icon_name: 'Dog', // Valor padrão
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/categories/');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenNewForm = () => {
    setFormData({ name: '', icon_name: 'Dog' });
    setPreviewUrl(null);
    setImageFile(null);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      const res = await fetch(`/api/categories/${id}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': csrfToken }
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('icon_name', formData.icon_name); // Campo novo que você adicionará no Django
    if (imageFile) dataToSend.append('cap_image', imageFile);

    try {
      const res = await fetch('/api/categories/', {
        method: 'POST',
        body: dataToSend,
        headers: { 'X-CSRFToken': csrfToken }
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      alert("Erro ao salvar.");
    }
  };

  if (loading) return <div className="p-8 text-center italic">Carregando categorias...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 italic">Gerenciar Categorias</h2>
          <p className="text-sm text-gray-500 italic">Adicione ou remova as divisões do seu catálogo</p>
        </div>
        <button 
          onClick={handleOpenNewForm}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-teal-100"
        >
          <Plus size={20} /> Nova Categoria
        </button>
      </div>

      {/* Grid de Categorias (Estilo Cards para diferenciar de Produtos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-50 shadow-inner bg-gray-50 flex items-center justify-center">
                {cat.cap_image ? (
                  <img src={cat.cap_image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <List className="text-gray-300" />
                )}
              </div>
              <div>
                <h4 className="font-black text-gray-800 uppercase tracking-tighter text-lg">{cat.name}</h4>
                <p className="text-xs text-teal-600 font-bold flex items-center gap-1 italic">
                   Ícone: {cat.icon_name || 'Nenhum'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(cat.id)}
              className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Formulário de Criação (Estilo Canva) */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-3xl shadow-2xl border-2 border-teal-50 p-8 animate-in slide-in-from-bottom-10 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-widest">Nova Categoria</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Imagem de Capa */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Imagem de Capa (Banner)</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="relative h-48 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden group cursor-pointer hover:border-teal-500 transition-all"
              >
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <UploadCloud className="mx-auto text-gray-300 mb-2" size={40} />
                    <p className="text-xs font-bold text-gray-400">Clique para selecionar</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            {/* Dados e Ícones */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Nome da Categoria</label>
                <input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all font-bold" 
                  placeholder="Ex: Rações, Brinquedos..."
                  required
                />
              </div>

              {/* Seleção de Ícone */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Selecione o Ícone Representativo</label>
                <div className="grid grid-cols-4 gap-3">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setFormData({...formData, icon_name: opt.name})}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                        formData.icon_name === opt.name 
                        ? 'border-teal-500 bg-teal-50 text-teal-600 shadow-sm shadow-teal-100 scale-105' 
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {opt.icon}
                      <span className="text-[10px] font-bold">{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-teal-700 transition-all uppercase tracking-widest mt-4">
                Criar Categoria
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;