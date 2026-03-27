
import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw,
  Mail,
  Smartphone,
  CheckCircle2,
  Bot,
  ExternalLink,
  StickyNote,
  Save,
  Trash2,
  ChevronRight,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { Order, OrderStatus, ComplaintStatus } from '../types';
import { generateCustomerMessage } from '../services/geminiService';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onDeleteOrder: (id: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateOrder, onDeleteOrder }) => {
  const [generatedMessage, setGeneratedMessage] = React.useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(order.notes || '');
  const [isSavingNotes, setIsSavingNotes] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateMessage = async (tone: 'professional' | 'empathetic') => {
    setIsGeneratingMessage(true);
    try {
      const msg = await generateCustomerMessage(order, tone);
      setGeneratedMessage(msg);
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    const updatedOrder: Order = {
      ...order,
      notes: localNotes,
      lastUpdate: new Date().toLocaleString()
    };
    
    setTimeout(() => {
      onUpdateOrder(updatedOrder);
      setIsSavingNotes(false);
    }, 500);
  };

  const updateComplaintStatus = (status: ComplaintStatus) => {
    const updatedOrder: Order = {
      ...order,
      complaintStatus: status,
      lastUpdate: new Date().toLocaleString(),
      events: [
        {
          date: new Date().toLocaleString(),
          location: 'Sistema',
          status: 'Status de Manifestação Alterado',
          description: `Manifestação atualizada para: ${status}`
        },
        ...order.events
      ]
    };
    onUpdateOrder(updatedOrder);
  };

  const handleMarkAsResolved = () => {
    const updatedOrder: Order = {
      ...order,
      status: OrderStatus.RESOLVED,
      complaintStatus: ComplaintStatus.RESOLVED,
      lastUpdate: new Date().toLocaleString(),
      notes: localNotes,
      events: [
        {
          date: new Date().toLocaleString(),
          location: 'Sistema',
          status: 'Resolvido',
          description: 'O pedido foi marcado como resolvido pelo gestor.'
        },
        ...order.events
      ]
    };
    onUpdateOrder(updatedOrder);
  };

  const handleExternalTrack = () => {
    window.open(`https://www.melhorrastreio.com.br/${order.trackingCode}`, '_blank');
  };

  const handleOpenComplaint = () => {
    window.open('https://melhorenvio.com.br/painel/meus-envios#postados', '_blank');
    if (order.complaintStatus === ComplaintStatus.NONE || !order.complaintStatus) {
      updateComplaintStatus(ComplaintStatus.OPENED);
    }
  };

  const handleSendWhatsApp = () => {
    if (!order.customerWhatsApp) {
      alert("Este pedido não possui WhatsApp cadastrado.");
      return;
    }
    const cleanNumber = order.customerWhatsApp.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(generatedMessage);
    window.open(`https://wa.me/55${cleanNumber}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Pedido {order.trackingCode}
                {order.priority === 'high' && <AlertTriangle size={18} className="text-red-500" />}
              </h2>
              <button 
                onClick={handleCopyCode}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                  copied 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}
                title="Copiar Código de Rastreio"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Cliente: {order.customerName} {order.customerWhatsApp && `(${order.customerWhatsApp})`} • {order.carrier}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExternalTrack}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all"
            >
              <ExternalLink size={14} />
              Melhor Rastreio
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tracking Events & Notes */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Linha do Tempo</h3>
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {order.events.map((event, i) => (
                  <div key={i} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-4.5 h-4.5 rounded-full border-2 border-white ring-4 ring-slate-50 ${i === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-semibold ${i === 0 ? 'text-indigo-600' : 'text-slate-900'}`}>{event.status}</p>
                        <p className="text-sm text-slate-600">{event.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock size={12} /> {event.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Manual Notes Section */}
            <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 font-bold flex items-center gap-2">
                  <StickyNote size={20} className="text-amber-500" />
                  Anotações Internas
                </h3>
                <button 
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes || localNotes === (order.notes || '')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    localNotes !== (order.notes || '') 
                    ? 'bg-amber-500 text-white hover:bg-amber-600' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSavingNotes ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {isSavingNotes ? 'Salvando...' : 'Salvar Notas'}
                </button>
              </div>

              <textarea 
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Adicione detalhes sobre o caso, contatos feitos com a transportadora ou combinados com o cliente..."
                className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none shadow-inner"
              />
            </section>
          </div>

          {/* Right Column: Actions & Communication */}
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status da Manifestação</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(ComplaintStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateComplaintStatus(status)}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      order.complaintStatus === status
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ações Recomendadas</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleOpenComplaint}
                  className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-600" size={20} />
                    <span className="text-sm font-medium">Abrir Manifestação</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="text-blue-600" size={20} />
                    <span className="text-sm font-medium">Solicitar Reenvio</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                </button>
                {order.status !== OrderStatus.RESOLVED && (
                  <button 
                    onClick={handleMarkAsResolved}
                    className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" size={20} />
                      <span className="text-sm font-bold text-green-700">Marcar como Resolvido</span>
                    </div>
                    <ChevronRight size={16} className="text-green-400 group-hover:text-green-600" />
                  </button>
                )}
                <button 
                  onClick={() => onDeleteOrder(order.id)}
                  className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl hover:border-red-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="text-red-600" size={20} />
                    <span className="text-sm font-bold text-red-700">Remover Pedido</span>
                  </div>
                  <ChevronRight size={16} className="text-red-400 group-hover:text-red-600" />
                </button>
              </div>
            </section>

            <section className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Comunicar Cliente</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleGenerateMessage('empathetic')}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Tom Empático"
                  >
                    <Smartphone size={16} />
                  </button>
                  <button 
                    onClick={() => handleGenerateMessage('professional')}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Tom Profissional"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </div>

              {isGeneratingMessage ? (
                <div className="h-32 bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Bot size={24} className="text-indigo-600 animate-bounce" />
                    <p className="text-xs text-slate-400">Escrevendo resposta...</p>
                  </div>
                </div>
              ) : generatedMessage ? (
                <div className="space-y-3">
                  <textarea 
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    className="w-full h-40 bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-600 focus:ring-2 focus:ring-indigo-500 resize-none outline-none leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      <Mail size={14} /> Enviar E-mail
                    </button>
                    <button 
                      onClick={handleSendWhatsApp}
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Smartphone size={14} /> WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/50 border border-dashed border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-400">Gere uma mensagem automática com IA para este caso específico.</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 italic">Última atualização em tempo real via {order.carrier}</p>
          <div className="flex gap-3">
             <button onClick={onClose} className="px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
