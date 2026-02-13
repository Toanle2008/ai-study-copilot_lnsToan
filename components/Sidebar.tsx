import React from 'react';
import { AppTab } from '../types';
import { MessageSquare, FileText, User, Calendar, BrainCircuit, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { id: AppTab.CHAT, icon: MessageSquare, label: 'Copilot' },
    { id: AppTab.SUMMARY, icon: LayoutGrid, label: 'Sơ đồ' },
    { id: AppTab.PLANNER, icon: Calendar, label: 'Lộ trình' },
    { id: AppTab.PROFILE, icon: User, label: 'Cá nhân' },
    { id: AppTab.DOCUMENTS, icon: FileText, label: 'Tài liệu' },
  ];

  return (
    <aside className={`fixed bottom-0 left-0 w-full h-[64px] bg-white dark:bg-[#0f1115] border-t border-slate-100 dark:border-slate-800 md:relative md:h-screen md:border-t-0 md:border-r z-50 flex md:flex-col items-center py-2 md:py-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
      
      {/* Toggle Button & Logo (Desktop Only) */}
      <div className={`hidden md:flex items-center w-full px-4 mb-8 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg flex-shrink-0">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white whitespace-nowrap">
              AI Study Copilot
            </h1>
          </div>
        )}
        {isCollapsed && (
          <div className="bg-indigo-600 p-2 rounded-xl flex-shrink-0 cursor-pointer" onClick={() => setIsCollapsed(false)}>
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors ${isCollapsed ? 'mt-4' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex md:flex-col w-full justify-around md:justify-start gap-1 md:px-2 h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : ''}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-1.5 md:py-2.5 rounded-xl transition-all h-full md:h-auto ${
                isCollapsed ? 'md:justify-center w-full md:px-0' : ''
              } ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-white font-semibold' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-white' : 'text-slate-400 dark:text-slate-500'} />
              <span className={`text-[10px] md:text-sm whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden md:block w-full px-4 text-[10px] text-slate-400 dark:text-slate-600 font-medium italic">
        {!isCollapsed && "Prototype • THPT Vietnam"}
      </div>
    </aside>
  );
};

export default Sidebar;