
import React from 'react';
import { 
  Save, 
  Globe, 
  Bot, 
  Smartphone, 
  Bell, 
  Link as LinkIcon, 
  Shield, 
  Store,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('integrations');
  const [isSaving, setIsSaving] = React.useState(false);

  const sections = [
    { id: 'integrations', label: 'Integrações', icon: LinkIcon },
    { id: 'automation', label: 'Automação & IA', icon: Bot },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'store', label: 'Perfil da Loja', icon: Store },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500">Gerencie integrações, regras de automação e preferências da plataforma.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeSection === section.id 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <section.icon size={20} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe className="text-indigo-600" size={20} />
                  Transportadoras (API Tracking)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">Correios</div>
                      <div>
                        <p className="text-sm font-bold">Correios (SIGEP Web)</p>
                        <p className="text-xs text-slate-500">Conectado através do Melhor Envio</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                      <CheckCircle2 size={12} /> Ativo
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg border border-slate-200 text-indigo-600 font-bold">Loggi</div>
                      <div>
                        <p className="text-sm font-bold">Loggi API</p>
                        <p className="text-xs text-slate-500">Token: ••••••••••••••••</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Configurar</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Smartphone className="text-emerald-600" size={20} />
                  Canais de Comunicação
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">WhatsApp Business API Key</label>
                    <input 
                      type="password" 
                      placeholder="Sua chave da API do WhatsApp Cloud..."
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-400">Utilizado para enviar mensagens preventivas automáticas via IA.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'automation' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Bot className="text-indigo-600" size={20} />
                  Regras de Automação Inteligente
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-bold">Abrir Manifestação Automática</p>
                      <p className="text-xs text-slate-500">Abre chamado na transportadora após 3 dias de atraso.</p>
                    </div>
                    <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-t">
                    <div>
                      <p className="text-sm font-bold">Priorização por IA</p>
                      <p className="text-xs text-slate-500">Classificar pedidos críticos automaticamente.</p>
                    </div>
                    <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-slate-200 rounded-full cursor-pointer">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="text-amber-500" size={20} />
                  Persona da IA (Gemini)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Tom de Voz Padrão</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      <option>Empático e Prestativo (Recomendado)</option>
                      <option>Profissional e Direto</option>
                      <option>Casual e Moderno</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Instruções Customizadas</label>
                    <textarea 
                      placeholder="Ex: Sempre peça desculpas em nome da Loja X e ofereça um cupom de 10%..."
                      className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="text-red-500" size={20} />
                Alertas do Sistema
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30">
                  <div className="mt-1">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-900">Notificações de Pedidos Parados</p>
                    <p className="text-xs text-red-700">Receber alerta quando um pedido não atualiza há mais de 48h.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100">
                  <div className="mt-1">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Relatório Diário via E-mail</p>
                    <p className="text-xs text-slate-500">Resumo matinal com todos os problemas do dia anterior.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100">
                  <div className="mt-1">
                    <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Avisos de Insucesso de Entrega</p>
                    <p className="text-xs text-slate-500">Ser notificado instantaneamente quando ocorrer uma tentativa sem sucesso.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'store' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Store className="text-indigo-600" size={20} />
                Dados da Loja
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome da Empresa</label>
                  <input type="text" defaultValue="Minha Loja Online Ltda" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">E-mail de Suporte</label>
                  <input type="email" defaultValue="suporte@minhaloja.com.br" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Endereço de Devolução</label>
                  <textarea defaultValue="Rua das Flores, 123 - Centro, São Paulo - SP, 01234-567" className="w-full h-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
