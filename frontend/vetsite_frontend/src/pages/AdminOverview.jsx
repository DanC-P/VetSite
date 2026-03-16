import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Save, Trash2, UploadCloud, Edit2, Check, Star, X } from 'lucide-react';

const AdminOverview = ({ csrfToken }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado do formulário baseado no código do Canva
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    old_price: '',
    category: '',
    description: '',
    is_active: true,
    is_featured: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products/'),
        fetch('/api/categories/')
      ]);
      const prods = await prodRes.json();
      const cats = await catRes.json();
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      old_price: product.old_price || '',
      category: product.category,
      description: product.description || '',
      is_active: product.is_active,
      is_featured: product.is_featured
    });
    setPreviewUrl(product.image);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();

  // 1. Tratamento dos campos de texto e Categoria
  Object.keys(formData).forEach(key => {
    let value = formData[key];

    // Se for o campo de categoria, precisamos garantir que vá o ID correto
    if (key === 'category') {
      const backendKey = 'fr_group_id'; // Nome que seu modelo espera
      if (value && value !== "") {
        data.append(backendKey, parseInt(value)); // Garante que é um número (PK)
      }
      // Se value for vazio, não damos append (o Django usará o valor atual ou null)
    } else {
      data.append(key, value);
    }
  });

  // 2. Lógica da Imagem: Só envia se for um novo arquivo selecionado
  if (imageFile instanceof File) {
    data.append('image', imageFile);
  }

  const url = editingId ? `/api/products/${editingId}/` : '/api/products/';
  // PATCH é fundamental para atualizações onde nem tudo é enviado
  const method = editingId ? 'PATCH' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      body: data,
      headers: { 'X-CSRFToken': csrfToken }
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setImageFile(null);
      fetchData();
    } else {
      const errorData = await res.json();
      console.error("Erro do Django:", errorData);
      alert("Erro ao salvar: " + JSON.stringify(errorData));
    }
  } catch (err) {
    alert("Erro de conexão com o servidor");
  }
  };  

  if (loading) return <div className="p-12 text-center italic text-gray-500">Carregando painel...</div>;

  return (
    <div className="p-8 animate-in fade-in duration-500">
      
      {/* Botão de Atalho para Novo Produto */}
      {!showForm && (
        <div className="mb-8 flex justify-end">
          <button 
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-teal-100 flex items-center gap-2 hover:bg-teal-700 transition-all"
          >
            <Plus size={20} /> ADICIONAR PRODUTO
          </button>
        </div>
      )}

      {/* Seção do Formulário (O Form-Section do Canva) */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 italic uppercase tracking-tighter">
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Título</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Ração Premium..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Categoria</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <input 
                   type="number" placeholder="Preço (R$)"
                   className="px-4 py-3 rounded-xl border border-gray-200"
                   value={formData.price}
                   onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <input 
                   type="number" placeholder="Preço Antigo (R$)"
                   className="px-4 py-3 rounded-xl border border-gray-200 text-gray-400"
                   value={formData.old_price}
                   onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                />
             </div>

             <div className="flex gap-4">
               <button type="submit" className="px-8 py-3 bg-teal-600 text-white font-black rounded-xl hover:bg-teal-700 flex items-center gap-2">
                 <Save size={18} /> {editingId ? 'ATUALIZAR' : 'SALVAR PRODUTO'}
               </button>
               <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200">
                 CANCELAR
               </button>
             </div>
          </form>
        </div>
      )}

      {/* Tabela de Produtos Cadastrados */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 italic">Produtos no Inventário</h2>
          <span className="text-xs font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
            {products.length} ITENS
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Produto</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Preço</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 flex items-center gap-4">
                    <img src={prod.image} className="w-10 h-10 rounded-lg object-cover border" alt="" />
                    <div>
                      <div className="font-bold text-gray-800">{prod.title}</div>
                      <div className="text-[10px] text-teal-600 font-bold uppercase">{prod.fr_group_name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-black text-gray-700 text-sm">R$ {prod.price}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {prod.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(prod)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;