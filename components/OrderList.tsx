
import React from 'react';
import { 
  MoreVertical, 
  Bot, 
  Clock, 
  Search,
  Package,
  Plus,
  ExternalLink,
  Trash2,
  FileText,
  MessageCircle
} from 'lucide-react';
import { Order, OrderStatus, ComplaintStatus } from '../types';

interface OrderListProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onAddClick: () => void;
  onDeleteOrder: (id: string) => void;
  statusFilter?: 'problems' | 'resolved' | 'all';
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ 
  orders, 
  onOrderClick, 
  onAddClick, 
  onDeleteOrder,
  statusFilter = 'problems',
  searchTerm,
  onSearchChange
}) => {
  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    
    // Multi-field smart search
    const matchesSearch = 
      order.trackingCode.toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term) ||
      (order.customerWhatsApp && order.customerWhatsApp.toLowerCase().replace(/\D/g, '').includes(term.replace(/\D/g, ''))) ||
      (order.customerWhatsApp && order.customerWhatsApp.toLowerCase().includes(term));
    
    if (statusFilter === 'problems') {
      return matchesSearch && order.status !== OrderStatus.RESOLVED && order.status !== OrderStatus.DELIVERED;
    }

    if (statusFilter === 'resolved') {
      return matchesSearch && order.status === OrderStatus.RESOLVED;
    }
    
    return matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-700';
      case OrderStatus.DELAYED: return 'bg-amber-100 text-amber-700';
      case OrderStatus.STUCK: return 'bg-orange-100 text-orange-700';
      case OrderStatus.LOST: return 'bg-red-100 text-red-700';
      case OrderStatus.WRONG_ADDRESS: return 'bg-purple-100 text-purple-700';
      case OrderStatus.FAILED_ATTEMPT: return 'bg-indigo-100 text-indigo-700';
      case OrderStatus.RESOLVED: return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getComplaintBadge = (status?: ComplaintStatus) => {
    if (!status || status === ComplaintStatus.NONE) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 w-fit">
        <FileText size={10} />
        Manifestação: {status}
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      default: return 'text-slate-400';
    }
  };

  const handleExternalTrack = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    window.open(`https://www.melhorrastreio.com.br/${code}`, '_blank');
  };

  const handleWhatsAppClick = (e: React.MouseEvent, whatsapp?: string) => {
    e.stopPropagation();
    if (!whatsapp) return;
    const cleanNumber = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanNumber}`, '_blank');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteOrder(id);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {statusFilter === 'problems' ? 'Problemas Críticos' : statusFilter === 'resolved' ? 'Histórico Resolvido' : 'Todos os Pedidos'}
          </h2>
          <p className="text-sm text-slate-500">
            {statusFilter === 'problems' 
              ? 'Monitoramento inteligente de registros logísticos ativos.' 
              : 'Registros que foram solucionados com sucesso.'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar qualquer informação..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>

          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            <Plus size={18} />
            <span>Novo Pedido</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-16">Nível</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente / Rastreio</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transportadora</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Última Atualização</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => onOrderClick(order)}
                >
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Clock size={18} className={getPriorityColor(order.priority)} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <p className="text-xs text-slate-500 font-mono">{order.trackingCode}</p>
                      {order.customerWhatsApp && <p className="text-[10px] text-slate-400">WhatsApp: {order.customerWhatsApp}</p>}
                      {getComplaintBadge(order.complaintStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{order.carrier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {order.lastUpdate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.customerWhatsApp && (
                        <button 
                          onClick={(e) => handleWhatsAppClick(e, order.customerWhatsApp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap border border-emerald-100"
                          title="Conversar via WhatsApp"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleExternalTrack(e, order.trackingCode)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                        title="Rastrear Pedido Externamente"
                      >
                        <ExternalLink size={14} />
                        Rastrear
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, order.id)}
                        className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        title="Remover Pedido"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Bot size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">Nenhum pedido encontrado com os filtros atuais.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
