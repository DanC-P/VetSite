import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, List, Settings, 
  UploadCloud, Save, Edit2, Trash2, PawPrint 
} from 'lucide-react';

// --- FUNÇÃO AUXILIAR PARA CSRF TOKEN ---
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const AdminDashboard = () => {
  // --- ESTADOS (STATES) ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    old_price: '',
    category: '', 
    description: '',
    is_active: true,
    is_featured: false
  });

  // --- BUSCA DE DADOS (GET) ---
  const fetchData = async () => {
    try {
      // Usamos URLs relativas porque o React e Django estão no mesmo servidor/porta
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products/'),
        fetch('/api/categories/')
      ]);
      
      if (!resProd.ok || !resCat.ok) throw new Error("Erro na resposta do servidor");

      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      
      setProducts(dataProd);
      setCategories(dataCat);
    } catch (err) {
      console.error("Erro ao sincronizar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- MANIPULADORES (HANDLERS) ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // --- ENVIO DE DADOS (POST) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie('csrftoken');

    if (!imageFile) {
      alert("⚠️ A imagem do produto é obrigatória!");
      return;
    }

    // Criamos o FormData CORRETO para enviar arquivos e textos juntos
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('price', formData.price);
    if (formData.old_price) dataToSend.append('old_price', formData.old_price);
    dataToSend.append('description', formData.description);
    dataToSend.append('fr_group', formData.category); // 'fr_group' deve ser o nome no seu models.py
    dataToSend.append('is_active', formData.is_active);
    dataToSend.append('is_featured', formData.is_featured);
    dataToSend.append('image', imageFile);

    try {
      const response = await fetch('/api/products/', {
        method: 'POST',
        body: dataToSend, // O corpo agora contém o FormData completo com a imagem
        credentials: 'include', // Envia os cookies de sessão para o Django
        headers: {
          'X-CSRFToken': csrftoken
          // NUNCA defina 'Content-Type' manualmente ao usar FormData
        }
      });

      if (response.ok) {
        alert("✅ Produto cadastrado com sucesso!");
        // Limpa o formulário
        setFormData({ title: '', price: '', old_price: '', category: '', description: '', is_active: true, is_featured: false });
        setImageFile(null);
        fetchData(); // Atualiza a lista de produtos abaixo
      } else {
        const errorData = await response.json();
        console.error("Erro do Django:", errorData);
        alert("Erro ao salvar produto. Verifique o console.");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  // --- RENDERIZAÇÃO ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-bold">Carregando Inventário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
              <PawPrint className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">VetSite <span className="text-teal-600">Admin</span></span>
          </div>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Package size={20} />} label="Produtos" />
          <NavItem icon={<List size={20} />} label="Categorias" />
          <NavItem icon={<Settings size={20} />} label="Configurações" />
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-8 py-5 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Painel Administrativo</p>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Inventário</h1>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-sm font-bold text-gray-700">Administrador</span>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Formulário */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="text-teal-600" size={20} /> Adicionar Novo Produto
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Título do Produto</label>
                  <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preço (R$)</label>
                  <input name="price" value={formData.price} onChange={handleChange} type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white" required>
                    <option value="">Selecione...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Foto do Produto</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-teal-500 transition-all">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">{imageFile ? imageFile.name : "Selecione uma imagem"}</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                <Save size={18} /> Salvar Produto
              </button>
            </form>
          </div>

          {/* Tabela de Produtos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                 <tr>
                   <th className="px-6 py-4">Produto</th>
                   <th className="px-6 py-4">Preço</th>
                   <th className="px-6 py-4 text-center">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {products.map((prod) => (
                   <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 flex items-center gap-3">
                       <img src={prod.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                       <span className="font-bold text-gray-700">{prod.title}</span>
                     </td>
                     <td className="px-6 py-4 text-sm font-semibold text-gray-600">R$ {prod.price}</td>
                     <td className="px-6 py-4 flex justify-center gap-2">
                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                       <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-teal-50 text-teal-600 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'
  }`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default AdminDashboard;