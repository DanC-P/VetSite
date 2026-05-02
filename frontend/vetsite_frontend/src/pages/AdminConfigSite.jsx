import React, { useState, useEffect, useCallback, useContext } from "react";
import { Save, UploadCloud, PawPrint, RefreshCcwDotIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
// IMPORTANTE: Importe o seu contexto global aqui
import { ConfigContext } from "../context";
import { Toast } from "../components";

const AdminConfigSite = () => {
  // --- ESTADOS DE UI E ALERTAS ---
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // --- CONTEXTOS ---
  // Pegamos o csrfToken do Outlet (Router)
  const { csrfToken } = useOutletContext();
  // Pegamos a função de atualizar do nosso Contexto Global (Solução para atualização dinâmica)
  const { fetchConfig } = useContext(ConfigContext);

  // --- ESTADOS DE FORMULÁRIO E ARQUIVOS ---
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    title_site: "",
    whatsapp_number: "",
    default_message: "",
    email_contact: "",
  });

  // Estado do Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  /// --- GATILHO DO TOAST ---
  const triggerAlert = (message, type) => {
    setToast({ show: true, message, type });
  };

  /**
   * Busca as configurações iniciais para preencher o formulário.
   * Usamos useCallback para evitar recriações desnecessárias da função.
   */
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/configuration/");

      // Verificação de autenticação básica
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      const config = Array.isArray(data) ? data[0] : data;

      if (config) {
        setEditingId(config.id);
        setFormData({
          title_site: config?.title_site || "",
          whatsapp_number: config?.whatsapp_number || "",
          default_message: config?.default_message || "",
          email_contact: config?.email_contact || "",
        });
        if (config.logo) setPreviewUrl(config.logo);
      }
    } catch (err) {
      triggerAlert("Erro ao carregar configurações.", "error");
      console.error("Erro ao sincronizar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito de montagem: carrega os dados assim que o componente abre
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Handlers para mudanças nos inputs de texto e arquivos
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Gera preview temporário da imagem
    }
  };

  /**
   * ENVIO DO FORMULÁRIO (Update/Create)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      triggerAlert("Erro de segurança: Token CSRF não encontrado.", "error");
      return;
    }

    // Validações simples de negócio
    if (
      formData.whatsapp_number.length > 0 &&
      formData.whatsapp_number.length < 10
    ) {
      triggerAlert("Número de WhatsApp muito curto. Verifique o DDD.", "info");
      return;
    }

    if (formData.email_contact && !formData.email_contact.includes("@")) {
      triggerAlert("Email inválido. Verifique o formato.", "info");
      return;
    }

    // Preparação do multipart/form-data para envio de arquivos (Logo)
    const dataToSend = new FormData();
    dataToSend.append("title_site", formData.title_site);
    dataToSend.append("whatsapp_number", formData.whatsapp_number);
    dataToSend.append("default_message", formData.default_message);
    dataToSend.append("email_contact", formData.email_contact);
    if (logoFile) dataToSend.append("logo", logoFile);

    const url = editingId
      ? `/api/configuration/${editingId}/`
      : "/api/configuration/";
    const method = editingId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSend,
        credentials: "include",
        headers: { "X-CSRFToken": csrfToken },
      });

      if (response.ok) {
        triggerAlert("✅ Configurações salvas com sucesso!", "success");

        // --- A SOLUÇÃO DINÂMICA ---
        // Aqui chamamos a função do Contexto Global.
        // Isso faz com que o Header (lá no Dashboard pai) atualize na hora!
        if (fetchConfig) await fetchConfig();

        loadSettings(); // Recarrega o formulário localmente também
      } else {
        triggerAlert("Erro ao salvar no servidor.", "error");
      }
    } catch (err) {
      triggerAlert("Erro na conexão com o servidor.", "error");
    }
  };

  /**
   * Reseta os campos do formulário visualmente
   */
  const handleResetConfig = (e) => {
    e.preventDefault();
    setFormData({
      title_site: "",
      whatsapp_number: "",
      default_message: "",
      email_contact: "",
    });
    setPreviewUrl(null);
    setLogoFile(null);
  };

  // View de carregamento inicial
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-600"></div>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">
            Informações do Site
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure os dados principais da sua loja
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* SEÇÃO DE LOGO: Upload e Preview */}
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
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-teal-500" />
                <p className="text-gray-600 font-medium text-sm">
                  Clique para upload da logo
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
              <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <PawPrint className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>
          </div>

          {/* INPUTS DE TEXTO */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Site
            </label>
            <input
              type="text"
              name="title_site"
              value={formData.title_site}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) => {
                  // Filtro para aceitar apenas dígitos
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    whatsapp_number: onlyNums,
                  }));
                }}
                placeholder="Ex: 11999998888"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem Padrão (WhatsApp)
            </label>
            <textarea
              name="default_message"
              value={formData.default_message}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          {/* AÇÕES FINAIS */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleResetConfig}
              className="px-6 py-3 border-2 border-teal-600 text-teal-700 font-bold rounded-xl hover:bg-teal-50 flex items-center gap-2"
            >
              <RefreshCcwDotIcon className="w-5 h-5" />
              Resetar Padrões
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Configurações
            </button>
          </div>
        </form>
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

export default AdminConfigSite;
