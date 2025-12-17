import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AppMode, ChatMessage } from './types';
import { MODE_CONFIGS } from './constants';
import { streamChatResponse, generateSingleResponse } from './services/geminiService';

const App = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOMEWORK);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setMessages([]); // Clear chat on mode switch for clean context
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const config = MODE_CONFIGS[mode];

      if (mode === AppMode.SHARK_TANK) {
        // Dual Mode Logic
        const assistantMsgId = (Date.now() + 1).toString();
        
        // Initialize empty placeholder
        setMessages(prev => [...prev, {
          id: assistantMsgId,
          role: 'model',
          content: 'Fetching Flash analysis...',
          secondaryContent: 'Fetching Pro reasoning...',
          timestamp: Date.now(),
          isMultiModel: true,
        }]);

        // Run parallel requests
        // 1. Flash (Fast)
        const flashPromise = generateSingleResponse(
          userMsg.content,
          'gemini-2.5-flash',
          "You are Blue Shark (Flash Mode). Provide a concise, rapid overview."
        );

        // 2. Pro (Deep)
        const proPromise = generateSingleResponse(
          userMsg.content,
          'gemini-3-pro-preview',
          "You are Blue Shark (Deep Mode). Provide comprehensive, reasoned analysis."
        );

        const [flashRes, proRes] = await Promise.all([flashPromise, proPromise]);

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId 
            ? { ...msg, content: flashRes, secondaryContent: proRes }
            : msg
        ));

      } else {
        // Standard Streaming Logic
        const assistantMsgId = (Date.now() + 1).toString();
        
        // Add placeholder
        setMessages(prev => [...prev, {
          id: assistantMsgId,
          role: 'model',
          content: '',
          timestamp: Date.now(),
        }]);

        // Prepare history for API (convert internal ChatMessage to API format)
        // We limit history to last 10 messages to save tokens
        const history = messages.slice(-10).map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));

        const stream = streamChatResponse(
          history,
          userMsg.content,
          config.model,
          config.systemInstruction
        );

        let fullText = '';
        for await (const chunk of stream) {
          fullText += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
          ));
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Error: Something went wrong in the deep ocean. Please check your connection or API key.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, mode, messages]);

  return (
    <div className="flex h-screen bg-shark-deep text-slate-200 font-sans selection:bg-shark-cyan selection:text-shark-900">
      
      <Sidebar 
        currentMode={mode} 
        onSelectMode={handleModeChange} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col relative h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-shark-700 bg-shark-900/80 backdrop-blur z-20">
          <span className="font-bold text-lg text-shark-cyan tracking-wider">BLUE SHARK</span>
          <button onClick={toggleSidebar} className="p-2 text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
           {/* Background Elements */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-shark-blue rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-shark-cyan rounded-full blur-[100px]" />
           </div>

           <ChatArea 
             messages={messages}
             input={input}
             isLoading={isLoading}
             currentMode={mode}
             onInputChange={(e) => setInput(e.target.value)}
             onSend={handleSend}
           />
        </main>
      </div>
    </div>
  );
};

export default App;