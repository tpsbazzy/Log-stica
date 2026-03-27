
import React from 'react';
import { X, Package, User, Hash, Truck, AlertCircle, Save, Smartphone } from 'lucide-react';
import { Order, OrderStatus, Carrier } from '../types';

interface AddOrderModalProps {
  onClose: () => void;
  onAdd: (order: Order) => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = React.useState({
    customerName: '',
    customerWhatsApp: '',
    trackingCode: '',
    carrier: Carrier.CORREIOS,
    status: OrderStatus.DELAYED,
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: formData.customerName,
      customerWhatsApp: formData.customerWhatsApp,
      trackingCode: formData.trackingCode,
      carrier: formData.carrier,
      status: formData.status,
      priority: formData.priority,
      shippedDate: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toLocaleString(),
      events: [
        {
          date: new Date().toLocaleString(),
          location: 'Sistema',
          status: 'Cadastrado Manualmente',
          description: 'Pedido inserido manualmente no sistema LogiPulse.'
        }
      ]
    };

    onAdd(newOrder);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Novo Pedido Manual</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User size={14} /> Nome do Cliente
              </label>
              <input 
                required
                type="text"
                placeholder="Ex: João da Silva"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Smartphone size={14} /> WhatsApp do Cliente
              </label>
              <input 
                type="tel"
                placeholder="Ex: 11999999999"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.customerWhatsApp}
                onChange={e => setFormData({...formData, customerWhatsApp: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Hash size={14} /> Código de Rastreio
            </label>
            <input 
              required
              type="text"
              placeholder="Ex: AA123456789BR"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all uppercase font-mono"
              value={formData.trackingCode}
              onChange={e => setFormData({...formData, trackingCode: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Truck size={14} /> Transportadora
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none"
                value={formData.carrier}
                onChange={e => setFormData({...formData, carrier: e.target.value as Carrier})}
              >
                {Object.values(Carrier).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <AlertCircle size={14} /> Status Atual
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as OrderStatus})}
              >
                {Object.values(OrderStatus).filter(s => s !== OrderStatus.RESOLVED && s !== OrderStatus.DELIVERED).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
            >
              <Save size={18} /> Salvar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
