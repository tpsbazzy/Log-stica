
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import OrderDetailModal from './components/OrderDetailModal';
import AddOrderModal from './components/AddOrderModal';
import ConfirmationModal from './components/ConfirmationModal';
import Settings from './components/Settings';
import { Order, OrderStatus } from './types';
import { MOCK_ORDERS } from './constants';

const LOCAL_STORAGE_KEY = 'logipulse_orders_v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('problems');
  
  // Inicializa o estado buscando do localStorage ou usando os dados mockados
  const [orders, setOrders] = React.useState<Order[]>(() => {
    const savedOrders = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (e) {
        console.error("Erro ao carregar pedidos do localStorage", e);
        return MOCK_ORDERS;
      }
    }
    return MOCK_ORDERS;
  });

  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // State para o modal de confirmação
  const [orderToDeleteId, setOrderToDeleteId] = React.useState<string | null>(null);

  // Persiste as mudanças sempre que o estado 'orders' for alterado
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(null);
  };

  const handleDeleteOrderTrigger = (id: string) => {
    setOrderToDeleteId(id);
  };

  const confirmDeleteOrder = () => {
    if (orderToDeleteId) {
      setOrders(prev => prev.filter(o => o.id !== orderToDeleteId));
      setOrderToDeleteId(null);
      if (selectedOrder?.id === orderToDeleteId) {
        setSelectedOrder(null);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'problems':
        return (
          <OrderList 
            orders={orders}
            statusFilter="problems" 
            onOrderClick={setSelectedOrder} 
            onAddClick={() => setIsAddModalOpen(true)}
            onDeleteOrder={handleDeleteOrderTrigger}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );
      case 'resolved':
        const resolvedOrders = orders.filter(o => o.status === OrderStatus.RESOLVED);
        if (resolvedOrders.length === 0 && searchTerm === '') {
          return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20 animate-in fade-in duration-500">
               <div className="bg-slate-100 p-8 rounded-full mb-6">
                  <img src="https://api.iconify.design/lucide:check-circle-2.svg?color=%2310b981&width=64" alt="Check" />
               </div>
               <p className="text-xl font-medium text-slate-900">Nenhum pedido marcado como resolvido ainda.</p>
               <button 
                 onClick={() => setActiveTab('problems')}
                 className="mt-4 text-red-600 font-semibold hover:underline"
               >
                 Ver problemas ativos
               </button>
            </div>
          );
        }
        return (
          <OrderList 
            orders={orders}
            statusFilter="resolved" 
            onOrderClick={setSelectedOrder} 
            onAddClick={() => setIsAddModalOpen(true)}
            onDeleteOrder={handleDeleteOrderTrigger}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );
      default:
        return (
          <OrderList 
            orders={orders} 
            statusFilter="problems" 
            onOrderClick={setSelectedOrder} 
            onAddClick={() => setIsAddModalOpen(true)} 
            onDeleteOrder={handleDeleteOrderTrigger}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {renderContent()}
      
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrderTrigger}
        />
      )}

      {isAddModalOpen && (
        <AddOrderModal 
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddOrder}
        />
      )}

      <ConfirmationModal 
        isOpen={!!orderToDeleteId}
        onClose={() => setOrderToDeleteId(null)}
        onConfirm={confirmDeleteOrder}
        title="Remover Pedido"
        message="Tem certeza que deseja remover este pedido permanentemente? Esta ação não pode ser desfeita e todos os registros de eventos associados serão apagados."
      />
    </Layout>
  );
};

export default App;
