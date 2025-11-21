import React, { useState } from 'react';
import { Ticket, ViewState } from './types';
import { MOCK_TICKETS } from './constants';
import Dashboard from './components/Dashboard';
import RequestForm from './components/RequestForm';
import TicketList from './components/TicketList';
import { LayoutDashboard, PlusCircle, List, Wrench, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    setCurrentView('TICKET_LIST');
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
        currentView === view
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <Wrench className="h-8 w-8" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">IT Fix AI</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-10">Smart Repair System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="DASHBOARD" icon={LayoutDashboard} label="ภาพรวม (Dashboard)" />
          <NavItem view="CREATE_TICKET" icon={PlusCircle} label="แจ้งซ่อม (New Ticket)" />
          <NavItem view="TICKET_LIST" icon={List} label="รายการซ่อม (All Tickets)" />
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-1">AI Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Gemini 2.5 Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-blue-600">
          <Wrench className="h-6 w-6" />
          <span className="font-bold text-lg text-slate-900">IT Fix AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 pt-20 px-4 md:hidden">
          <nav className="space-y-2">
            <NavItem view="DASHBOARD" icon={LayoutDashboard} label="ภาพรวม" />
            <NavItem view="CREATE_TICKET" icon={PlusCircle} label="แจ้งซ่อม" />
            <NavItem view="TICKET_LIST" icon={List} label="รายการทั้งหมด" />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {currentView === 'DASHBOARD' && 'ภาพรวมระบบแจ้งซ่อม'}
              {currentView === 'CREATE_TICKET' && 'สร้างรายการแจ้งซ่อมใหม่'}
              {currentView === 'TICKET_LIST' && 'รายการแจ้งซ่อมทั้งหมด'}
            </h2>
            {currentView === 'TICKET_LIST' && (
               <button 
                 onClick={() => setCurrentView('CREATE_TICKET')}
                 className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
               >
                 + แจ้งซ่อม
               </button>
            )}
          </div>

          <div className="animate-fade-in">
            {currentView === 'DASHBOARD' && <Dashboard tickets={tickets} />}
            {currentView === 'CREATE_TICKET' && (
              <RequestForm 
                onSubmit={handleCreateTicket} 
                onCancel={() => setCurrentView('DASHBOARD')} 
              />
            )}
            {currentView === 'TICKET_LIST' && <TicketList tickets={tickets} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;