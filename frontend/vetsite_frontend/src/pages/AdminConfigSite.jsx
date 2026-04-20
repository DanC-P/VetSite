import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  UploadCloud,
  PawPrint,
  RefreshCcwDotIcon,
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

const AdminConfigSite = () => {
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [alertPopup, setAlertPopup] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("");

  const { csrfToken } = useOutletContext();

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title_site: "",
    whatsapp_number: "",
    default_message: "",
    email_contact: "",
  });

  // Função para disparar o alerta visual
  const triggerAlert = (message, type) => {
    setAlertText(message);
    setAlertPopup(true);
    setAlertType(type || "info");

    setTimeout(() => setAlertPopup(false), 5000);
  };

  const alertStyles = {
    error: {
      border: "border-red-500",
      bgIcon: "bg-red-100",
      textColor: "text-red-600",
      icon: <AlertCircle size={20} />,
    },
    success: {
      border: "border-green-500",
      bgIcon: "bg-green-100",
      textColor: "text-green-600",
      icon: <CheckCircle size={20} />,
    },
    info: {
      border: "border-blue-500",
      bgIcon: "bg-blue-100",
      textColor: "text-blue-600",
      icon: <Info size={20} />,
    },
  };

  const fetchSettings = useCallback(async () => {
    try {
      const resConfig = await fetch("/api/configuration/");

      if (resConfig.status === 401 || resConfig.status === 403) {
        window.location.href = "/login";
        return;
      }

      const dataConfig = await resConfig.json();
      return dataConfig;
    } catch (err) {
      triggerAlert("Erro ao carregar configurações.", "error");
      console.error("Erro ao sincronizar:", err);
      return null;
    }
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const data = await fetchSettings();

    if (data) {
      const config = Array.isArray(data) ? data[0] : data;
      if (config) {
        setEditingId(config.id);
        setFormData({
          title_site: config.title_site || "",
          whatsapp_number: config.whatsapp_number || "",
          default_message: config.default_message || "",
          email_contact: config.email_contact || "",
        });
        if (config.logo) setPreviewUrl(config.logo);
      }
    }
    setLoading(false);
  }, [fetchSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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

    if (!csrfToken) {
      triggerAlert("Erro de segurança: Token CSRF não encontrado.", "error");
      return;
    }

    // VALIDAÇÕES USANDO O ESTADO (formData)
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

    const dataToSend = new FormData();
    dataToSend.append("title_site", formData.title_site);
    dataToSend.append("whatsapp_number", formData.whatsapp_number);
    dataToSend.append("default_message", formData.default_message);
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
        headers: { "X-CSRFToken": csrfToken },
      });

      if (response.ok) {
        triggerAlert("✅ Configurações salvas com sucesso!", "success");
        loadSettings(); // Recarrega os dados para garantir sincronia
      } else {
        const errData = await response.json();
        console.error(errData);
        triggerAlert("Erro ao salvar no servidor.", "error");
      }
    } catch (err) {
      triggerAlert("Erro na conexão com o servidor.", "error");
      console.error("Erro de rede:", err);
    }
  };

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
          {/* Logo Upload Section */}
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

          {/* Título */}
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

          {/* WhatsApp e Email */}
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
                  // FILTRO DE NÚMEROS: Remove qualquer letra instantaneamente
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

          {/* Mensagem Padrão */}
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

          {/* Botões */}
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

      {/* Pop-up de Alerta Personalizado */}
      {alertPopup && (
        <div className="fixed bottom-5 right-5 z-[100] animate-bounce-short">
          <div
            className={`bg-white border-l-4 ${alertStyles[alertType]?.border || "border-blue-500"} p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px]`}
          >
            <div
              className={`${alertStyles[alertType]?.bgIcon || "bg-blue-100"} p-2 rounded-full ${alertStyles[alertType]?.textColor || "text-blue-600"}`}
            >
              {alertStyles[alertType]?.icon || <AlertTriangle size={20} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 italic">
                Notificação
              </p>
              <p className="text-xs text-gray-600">{alertText}</p>
            </div>
            <button
              onClick={() => setAlertPopup(false)}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfigSite;
