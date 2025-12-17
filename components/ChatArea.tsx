import React, { useRef, useEffect } from 'react';
import { ChatMessage, Role, AppMode } from '../types';
import { SendIcon, SharkIcon } from '../constants';

interface ChatAreaProps {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  currentMode: AppMode;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

const MarkdownText = ({ text }: { text: string }) => {
  // Simple replacement for newlines to <br> and code blocks to <pre>
  // In a real production app, use 'react-markdown'
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-sm md:text-base leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const content = part.slice(3, -3).replace(/^.*\n/, ''); // remove language tag line roughly
          return (
            <pre key={i} className="bg-shark-900 p-3 rounded-md my-2 overflow-x-auto border border-shark-700 font-mono text-shark-cyan">
              <code>{content}</code>
            </pre>
          );
        }
        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
      })}
    </div>
  );
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  input,
  isLoading,
  currentMode,
  onInputChange,
  onSend,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-shark-deep relative">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <SharkIcon className="w-24 h-24 mb-4 text-shark-cyan animate-pulse-slow" />
            <p className="text-xl font-light">Blue Shark AI is ready.</p>
            <p className="text-sm">Select a mode and start swimming.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 shadow-xl ${
                msg.role === 'user'
                  ? 'bg-shark-blue text-white rounded-tr-none'
                  : 'bg-shark-800 text-slate-200 border border-shark-700 rounded-tl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 opacity-70 border-b border-white/10 pb-1">
                 <span className="text-xs font-bold uppercase tracking-wider">
                   {msg.role === 'user' ? 'You' : 'Blue Shark'}
                 </span>
                 {msg.role === 'model' && (
                   <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">
                     {msg.isMultiModel ? 'Dual Core' : 'AI'}
                   </span>
                 )}
              </div>

              {msg.isMultiModel && msg.secondaryContent ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-shark-cyan mb-1 font-mono">⚡ FAST (Flash)</div>
                    <MarkdownText text={msg.content} />
                  </div>
                  <div className="hidden md:block w-px bg-shark-700 mx-2"></div>
                  <div className="md:hidden h-px bg-shark-700 my-2"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-purple-400 mb-1 font-mono">🧠 DEEP (Pro)</div>
                    <MarkdownText text={msg.secondaryContent} />
                  </div>
                </div>
              ) : (
                <MarkdownText text={msg.content} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-shark-900 border-t border-shark-700 z-10">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              currentMode === AppMode.SECURITY 
                ? "Ask about vulnerabilities or CTF hints..." 
                : currentMode === AppMode.CODING 
                  ? "Paste code or ask for a function..." 
                  : "Type your message..."
            }
            className="flex-1 bg-shark-deep text-slate-100 border border-shark-700 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-shark-cyan focus:border-transparent transition-all placeholder-slate-500 disabled:opacity-50 shadow-inner"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="bg-shark-cyan hover:bg-cyan-400 text-shark-900 rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-shark-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon className="w-6 h-6" />
            )}
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-slate-500 uppercase tracking-widest">
             {isLoading ? 'Shark is thinking...' : 'Powered by Gemini 2.5 & 3.0'}
           </span>
        </div>
      </div>
    </div>
  );
};