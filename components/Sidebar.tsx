
import React from 'react';
import { AppMode, ChatSession } from '../types';
import { MODE_CONFIGS, SharkIcon, HistoryIcon, PlusIcon, DownloadIcon } from '../constants';

interface SidebarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  installable: boolean;
  onInstall: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentMode, 
  onSelectMode, 
  isOpen, 
  toggleSidebar, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  onClearHistory,
  installable,
  onInstall
}) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-shark-900 border-r border-shark-700 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-shark-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-shark-blue to-shark-cyan rounded-lg flex items-center justify-center">
              <SharkIcon className="text-shark-900 w-5 h-5 animate-float" />
            </div>
            <h1 className="font-bold text-lg text-white">Blue Shark</h1>
          </div>
          <button 
            onClick={onNewChat}
            className="p-2 hover:bg-shark-800 rounded-lg text-shark-cyan transition-colors"
            title="New Chat"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-2 flex items-center gap-2">
              Modes
            </div>
            <div className="space-y-1">
              {Object.entries(MODE_CONFIGS).map(([key, config]) => {
                const modeKey = key as AppMode;
                const isActive = currentMode === modeKey && !currentSessionId;
                
                return (
                  <button
                    key={modeKey}
                    onClick={() => {
                      onSelectMode(modeKey);
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group
                      ${isActive 
                        ? 'bg-shark-800 border border-shark-cyan/30 text-shark-cyan' 
                        : 'hover:bg-shark-800/50 border border-transparent hover:border-shark-700 text-slate-400'
                      }
                    `}
                  >
                    <div className={`${isActive ? 'text-shark-cyan' : 'group-hover:text-shark-cyan'}`}>
                      {config.icon}
                    </div>
                    <div className="font-medium text-sm">
                      {config.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {sessions.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-3 h-3" /> Recent History
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearHistory();
                  }}
                  className="hover:text-red-400 text-slate-400 hover:bg-shark-800 px-2 py-1 rounded transition-colors uppercase font-black tracking-tighter cursor-pointer"
                  title="Clear all history"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {sessions.slice(0, 10).map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`
                      w-full p-3 rounded-xl transition-all duration-200 text-left text-sm truncate group
                      ${currentSessionId === session.id 
                        ? 'bg-shark-800 border border-shark-cyan/30 text-shark-cyan' 
                        : 'hover:bg-shark-800/50 border border-transparent hover:border-shark-700 text-slate-400'
                      }
                    `}
                  >
                    <div className="flex flex-col">
                      <span className="truncate">{session.title || 'Untitled Session'}</span>
                      <span className="text-[10px] opacity-40 mt-1 uppercase tracking-tighter">
                        {MODE_CONFIGS[session.mode]?.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-shark-700 space-y-2">
          {installable && (
            <button
              onClick={onInstall}
              className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-shark-blue to-shark-cyan text-shark-900 font-bold rounded-lg hover:shadow-lg hover:shadow-shark-cyan/20 transition-all text-sm"
            >
              <DownloadIcon className="w-4 h-4" /> Install App
            </button>
          )}
          <div className="text-[10px] text-slate-600 text-center">
            Ethical AI Suite &bull; History Saved
          </div>
        </div>
      </div>
    </>
  );
};
