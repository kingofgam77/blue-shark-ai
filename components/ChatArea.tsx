
import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { ChatMessage, Role, AppMode } from '../types';
import { SendIcon, SharkIcon, CameraIcon, MicIcon, StopIcon } from '../constants';

interface ChatAreaProps {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  currentMode: AppMode;
  pendingImage: { data: string, mimeType: string } | null;
  sessionId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSet: (value: string) => void;
  onSend: () => void;
  onImageSelect: (file: File) => void;
  onClearPendingImage: () => void;
}

const PAGE_SIZE = 20;

const MarkdownText = ({ text }: { text: string }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-sm md:text-base leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const content = part.slice(3, -3).replace(/^.*\n/, '');
          return (
            <pre key={i} className="bg-shark-900 p-3 rounded-md my-2 overflow-x-auto border border-shark-700 font-mono text-shark-cyan text-xs">
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
  pendingImage,
  sessionId,
  onInputChange,
  onInputSet,
  onSend,
  onImageSelect,
  onClearPendingImage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Reset pagination when switching sessions
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [sessionId]);

  // Derived state for pagination
  const visibleMessages = messages.slice(-limit);
  const hasMore = messages.length > limit;

  const scrollToBottom = () => {
    // Only scroll to bottom if we are not actively paginating
    if (prevScrollHeightRef.current === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when new messages arrive (and not loading history)
  useEffect(() => {
    if (prevScrollHeightRef.current === 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Handle maintaining scroll position when loading more history
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container && prevScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      container.scrollTop = diff;
      prevScrollHeightRef.current = 0; // Reset
    }
  }, [visibleMessages]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasMore) {
      // User hit top, load more
      prevScrollHeightRef.current = container.scrollHeight;
      setLimit((prev) => prev + PAGE_SIZE);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const newValue = input ? `${input} ${transcript}` : transcript;
      onInputSet(newValue);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-shark-deep relative">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <SharkIcon className="w-24 h-24 mb-4 text-shark-cyan animate-pulse-slow" />
            <p className="text-xl font-light">Blue Shark AI is ready.</p>
            <p className="text-sm">Select a mode or choose from history.</p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-shark-700 border-t-shark-cyan rounded-full animate-spin"></div>
          </div>
        )}

        {visibleMessages.map((msg) => (
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
                 <span className="text-[10px] font-bold uppercase tracking-wider">
                   {msg.role === 'user' ? 'You' : 'Blue Shark'}
                 </span>
                 {msg.role === 'model' && (
                   <span className="text-[8px] bg-black/20 px-2 py-0.5 rounded-full">
                     AI
                   </span>
                 )}
              </div>

              {msg.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                  <img 
                    src={`data:${msg.image.mimeType};base64,${msg.image.data}`} 
                    alt="Multimodal content"
                    className="max-w-full h-auto object-cover max-h-[300px]"
                  />
                </div>
              )}

              <MarkdownText text={msg.content} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview Area for Pending Image */}
      {pendingImage && (
        <div className="px-4 pt-2">
          <div className="relative inline-block group">
            <img 
              src={`data:${pendingImage.mimeType};base64,${pendingImage.data}`} 
              className="w-20 h-20 object-cover rounded-lg border-2 border-shark-cyan shadow-lg"
              alt="Preview"
            />
            <button 
              onClick={onClearPendingImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="p-4 bg-shark-900 border-t border-shark-700 z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          
          <div className="flex items-center gap-2 w-full">
            {/* File Upload Trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-full transition-colors ${pendingImage ? 'bg-shark-cyan text-shark-900' : 'bg-shark-deep text-slate-400 hover:text-shark-cyan hover:bg-shark-800'}`}
              title="Upload photo to transform"
            >
              <CameraIcon className="w-6 h-6" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />

            {/* Voice Input Trigger */}
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-shark-deep text-slate-400 hover:text-shark-cyan hover:bg-shark-800'}`}
              title="Voice Input"
            >
              {isListening ? <StopIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isListening ? "Listening..." : "Ask anything..."}
              className="flex-1 bg-shark-deep text-slate-100 border border-shark-700 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-shark-cyan focus:border-transparent transition-all placeholder-slate-500 disabled:opacity-50"
            />
            <button
              onClick={onSend}
              disabled={(!input.trim() && !pendingImage) || isLoading}
              className="bg-shark-cyan hover:bg-cyan-400 text-shark-900 rounded-full p-3 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-shark-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <SendIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
