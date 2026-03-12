import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, UploadCloud, Save, Edit2, Trash2, Plus, X, Star, AlertCircle 
} from 'lucide-react';
import SidebarAdmin from '../components/SidebarAdmin';
import AdminHeader from '../components/AdminHeader';

const AdminProduct = ({ csrftoken }) => {
  // --- ESTADOS ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Refs para manipulação de arquivos e scroll
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    old_price: '',
    category: '', 
    description: '',
    is_active: true,
    is_featured: false
  });

  // --- BUSCA DE DADOS ---
  const fetchData = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products/'),
        fetch('/api/categories/')
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

  useEffect(() => { fetchData(); }, []);

  // --- HANDLERS DE INTERAÇÃO (Estilo Canva) ---
  
  const handleSelectProduct = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      old_price: product.old_price || '',
      category: product.fr_group_id || '',
      description: product.description || '',
      is_active: product.is_active,
      is_featured: product.is_featured
    });
    setPreviewUrl(product.image);
    setImageFile(null); // Reseta o arquivo novo, pois estamos usando o que já existe
    setShowForm(true);
    
    // Scroll suave para o formulário como no script do Canva
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleOpenNewForm = () => {
    setEditingId(null);
    setFormData({ title: '', price: '', old_price: '', category: '', description: '', is_active: true, is_featured: false });
    setPreviewUrl(null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('price', formData.price);
    dataToSend.append('old_price', formData.old_price || 0);
    dataToSend.append('description', formData.description);
    dataToSend.append('fr_group_id', formData.category);
    dataToSend.append('is_active', formData.is_active ? 'True' : 'False');
    dataToSend.append('is_featured', formData.is_featured ? 'True' : 'False');
    
    if (imageFile) {
      dataToSend.append('image', imageFile);
    }

    const url = editingId ? `/api/products/${editingId}/` : '/api/products/';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSend,
        credentials: 'include',
        headers: { 'X-CSRFToken': csrftoken }
      });

      if (response.ok) {
        alert(editingId ? "✅ Produto atualizado!" : "✅ Produto criado!");
        setShowForm(false);
        fetchData();
      } else {
        const err = await response.json();
        console.error(err);
      }
    } catch (err) {
      alert("Erro na conexão com o servidor.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-600"></div>
    </div>
  );

  return (
    /* Removidos: a div flex externa, o SidebarAdmin e o AdminHeader */
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header da Seção de Tabela (Título interno da página) */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 italic uppercase tracking-tight">
            Selecione um Produto para Editar
          </h2>
          <p className="text-sm text-gray-500 italic">{products.length} produtos encontrados no sistema</p>
        </div>
        <button 
          onClick={handleOpenNewForm}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-100"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-lg font-bold text-gray-400 font-sans italic">Nenhum produto cadastrado</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Foto</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Nome</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Preço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((prod) => (
                  <tr 
                    key={prod.id} 
                    onClick={() => handleSelectProduct(prod)}
                    className={`cursor-pointer transition-all hover:bg-teal-50/30 ${editingId === prod.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''}`}
                  >
                    <td className="px-8 py-4">
                      <img src={prod.image} className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" alt="" />
                    </td>
                    <td className="px-8 py-4">
                      <div className="font-bold text-gray-800">{prod.title}</div>
                      <div className="text-xs text-teal-600 font-bold">{prod.fr_group_name || 'Sem Categoria'}</div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      {prod.is_featured && <Star size={14} className="inline ml-2 text-yellow-500 fill-yellow-500" />}
                    </td>
                    <td className="px-8 py-4 font-black text-gray-700">
                      R$ {prod.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Seção de Formulário */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-3xl shadow-xl border border-teal-100 p-8 animate-in fade-in slide-in-from-bottom-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                {editingId ? `Editando: ${formData.title}` : 'Novo Produto'}
              </h2>
              <p className="text-sm text-gray-500 italic">Preencha as informações detalhadas abaixo</p>
            </div>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* O conteúdo do seu formulário continua exatamente igual aqui... */}
              {/* ... */}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;