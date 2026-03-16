import React, { useState, useEffect, useRef } from "react";
import { Save, UploadCloud, ImageIcon, PawPrint } from "lucide-react";

const AdminConfigSite = ({ csrftoken }) => {
  const [configuration, setConfiguration] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title_site: "",
    whatsapp_number: "",
    default_mensage: "",
    email_contact: "",
  });

  const fetchSettings = async () => {
    try {
      const resConfg = await fetch("/api/configuration/");
      if (!resConfg.ok) throw new Error("Erro na rede");

      const dataConfig = await resConfg.json();

      return dataConfig;
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
      return null;
    }
  };

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSettings();

    if (data) {
      const config = Array.isArray(data) ? data[0] : data;

      if (config) {
        setEditingId(config.id);
        setFormData({
          title_site: config.title_site || "",
          whatsapp_number: config.whatsapp_number || "",
          default_mensage: config.default_mensage || "",
          email_contact: config.email_contact || "",
        });

        if (config.logo) {
          setPreviewUrl(config.logo);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("title_site", formData.title_site);
    dataToSend.append("whatsapp_number", formData.whatsapp_number);
    dataToSend.append("default_mensage", formData.default_mensage);
    dataToSend.append("email_contact", formData.email_contact);

    if (logoFile) {
      dataToSend.append("logo", logoFile);
    }

    const url = editingId
      ? `/api/configuration/${editingId}/`
      : "/api/configuration/";
    const method = editingId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSend,
        credentials: "include",
        headers: { "X-CSRFToken": csrftoken },
      });

      if (response.ok) {
        alert(
          editingId ? "✅ Configurações atualizadas!" : "Configuração criada!",
        );
        setShowForm(false);
        fetchSettings();
      } else {
        const err = await response.json();
        console.error(err);
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
    <div className="mx-auto">
      {/* Aumentei para 4xl e centralizei */}
      <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Informações do Site
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure os dados principais da sua loja VetSite
            </p>
          </div>
        </div>

        <form id="settings-form" className="space-y-6" onSubmit={handleSubmit}>
          {/* Site Logo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Logo do Site
              </label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-500 hover:bg-teal-50/50 transition-all cursor-pointer group"
                onClick={() =>
                  document.getElementById("file-input-logo").click()
                }
              >
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
                <p className="text-gray-600 font-medium text-sm">
                  Arraste a logo ou clique para upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG até 5MB (Recomendado: fundo transparente)
                </p>
              </div>
              <input
                type="file"
                id="file-input-logo"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Preview
              </label>
              <div className="w-40 h-40 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <PawPrint className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Sem Logo</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Título do Site */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Site
            </label>
            <input
              type="text"
              name="title_site"
              value={formData.title_site}
              onChange={handleInputChange}
              placeholder="Ex: VetSite - Sua Loja de Produtos para Pets"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Grid para WhatsApp e Email (Fica lado a lado em telas maiores) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="text" // Mudei para text para aceitar parênteses/espaços se quiser, ou mantenha number
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                placeholder="Ex: 11999998888"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email_contact"
                value={formData.email_contact}
                onChange={handleInputChange}
                placeholder="contato@vetsite.com.br"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          {/* Default Mensage WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem Padrão (WhatsApp)
            </label>
            <textarea
              name="default_mensage"
              value={formData.default_mensage}
              onChange={handleInputChange}
              placeholder="Ex: Olá! Gostaria de saber mais sobre os produtos."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Texto que aparecerá automaticamente para o cliente ao clicar no
              WhatsApp.
            </p>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-100 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminConfigSite;
