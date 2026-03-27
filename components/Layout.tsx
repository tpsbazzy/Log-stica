
import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle2, 
  Settings as SettingsIcon, 
  Menu,
  Bell,
  Search,
  Truck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab,
  searchTerm,
  onSearchChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { id: 'problems', label: 'Problemas Ativos', icon: AlertTriangle },
    { id: 'dashboard', label: 'Estatísticas', icon: LayoutDashboard },
    { id: 'resolved', label: 'Histórico Resolvido', icon: CheckCircle2 },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Truck size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">LogiPulse</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <SettingsIcon size={22} />
            {isSidebarOpen && <span className="font-medium">Configurações</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-md">
              <Menu size={20} className="text-slate-600" />
            </button>
            <div className="relative w-96 max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por código, nome, ID ou WhatsApp..." 
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-red-500 rounded-lg text-sm transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-4 ml-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Gestor de Logística</p>
                <p className="text-xs text-red-600 font-medium uppercase tracking-tighter">Modo Emergência</p>
              </div>
              <img src="https://picsum.photos/seed/admin/40/40" className="w-9 h-9 rounded-full border border-slate-200" alt="avatar" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
