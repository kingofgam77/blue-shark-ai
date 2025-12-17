import React from 'react';
import { AppMode } from '../types';
import { MODE_CONFIGS, SharkIcon } from '../constants';

interface SidebarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onSelectMode, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-shark-900 border-r border-shark-700 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-shark-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-shark-blue to-shark-cyan rounded-xl flex items-center justify-center shadow-lg shadow-shark-cyan/20">
            <SharkIcon className="text-shark-900 w-6 h-6 animate-float" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight">Blue Shark</h1>
            <p className="text-xs text-shark-cyan">AI Assistant Suite</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {Object.entries(MODE_CONFIGS).map(([key, config]) => {
            const modeKey = key as AppMode;
            const isActive = currentMode === modeKey;
            
            return (
              <button
                key={modeKey}
                onClick={() => {
                  onSelectMode(modeKey);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`
                  w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-200 text-left group
                  ${isActive 
                    ? 'bg-shark-800 border border-shark-cyan/30 shadow-[0_0_15px_-3px_rgba(34,211,238,0.1)]' 
                    : 'hover:bg-shark-800/50 border border-transparent hover:border-shark-700'
                  }
                `}
              >
                <div className={`mt-1 p-2 rounded-lg ${isActive ? 'bg-shark-cyan text-shark-900' : 'bg-shark-950 text-slate-400 group-hover:text-shark-cyan'}`}>
                  {config.icon}
                </div>
                <div>
                  <div className={`font-semibold ${isActive ? 'text-shark-cyan' : 'text-slate-300'}`}>
                    {config.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 leading-tight">
                    {config.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-shark-700">
          <div className="text-[10px] text-slate-600 text-center">
            Ethical AI &bull; Secure &bull; Advanced
          </div>
        </div>
      </div>
    </>
  );
};