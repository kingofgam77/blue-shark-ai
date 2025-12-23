
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AppMode, ChatMessage, ChatSession } from './types';
import { MODE_CONFIGS, ShareIcon, PlusIcon } from './constants';
import { streamChatResponse } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'blue_shark_ai_sessions';

const App = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PRO_CHAT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // iOS and Standalone Detection
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  // Lazy initialization for sessions to ensure reliable loading and prevent overwrite race conditions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Migration: Map FAST_CHAT (deprecated) to SHARK_TANK
          return parsed.map((s: any) => ({
             ...s,
             mode: s.mode === 'FAST_CHAT' ? AppMode.SHARK_TANK : s.mode
          }));
        }
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Handle PWA Checks & Events
  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Detect Standalone (Installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(standalone);

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      // Android / Chrome Desktop
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // iOS Instruction
      setShowIOSHint(true);
      setSidebarOpen(false); // Close sidebar so user sees modal
    }
  }, [deferredPrompt, isIOS]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getActiveMessages = (): ChatMessage[] => {
    if (!currentSessionId) return [];
    const session = sessions.find(s => s.id === currentSessionId);
    return session ? session.messages : [];
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setInput('');
    setPendingImage(null);
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setCurrentSessionId(null);
    setPendingImage(null);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setMode(session.mode);
      setCurrentSessionId(sessionId);
      setPendingImage(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
      setSessions([]);
      setCurrentSessionId(null);
      setPendingImage(null);
      setInput('');
    }
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1];
      setPendingImage({
        data: base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !pendingImage) || isLoading) return;

    const userInput = input.trim();
    const currentPendingImage = pendingImage;
    setInput('');
    setPendingImage(null);
    setIsLoading(true);

    let sessionId = currentSessionId;
    let newSessions = [...sessions];

    // Create a new session if none is active
    if (!sessionId) {
      sessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: sessionId,
        title: userInput ? (userInput.slice(0, 30) + (userInput.length > 30 ? '...' : '')) : "New Chat",
        messages: [],
        mode: mode,
        timestamp: Date.now(),
      };
      newSessions = [newSession, ...newSessions];
      setCurrentSessionId(sessionId);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput || (currentPendingImage ? "[Image provided]" : ""),
      timestamp: Date.now(),
      image: currentPendingImage || undefined
    };

    // Update sessions with user message
    newSessions = newSessions.map(s => 
      s.id === sessionId ? { ...s, messages: [...s.messages, userMsg] } : s
    );
    setSessions(newSessions);

    const config = MODE_CONFIGS[mode];
    const assistantMsgId = (Date.now() + 1).toString();

    try {
      // --- Standard Chat (Fast, Pro, Homework, Coding, etc) ---
      
      // Setup initial empty message for streaming
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { 
          ...s, 
          messages: [...s.messages, { id: assistantMsgId, role: 'model', content: '', timestamp: Date.now() }] 
        } : s
      ));

      const currentSess = newSessions.find(s => s.id === sessionId);
      const history = (currentSess?.messages.slice(-10) || []).map(m => ({
        role: m.role,
        parts: [
          ...(m.image ? [{ inlineData: { data: m.image.data, mimeType: m.image.mimeType } }] : []),
          { text: m.content }
        ]
      }));

      const stream = streamChatResponse(history as any, userInput, config.model, config.systemInstruction);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { 
            ...s, 
            messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m) 
          } : s
        ));
      }

    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: `Error: ${error.message || "The deep ocean is turbulent. Check your API key or connection."}`,
        timestamp: Date.now()
      };
      // If we already added a placeholder message, replace it, otherwise add new
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { 
            ...s, 
            messages: s.messages.some(m => m.id === assistantMsgId) 
              ? s.messages.map(m => m.id === assistantMsgId ? errorMsg : m)
              : [...s.messages, errorMsg]
          } : s
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, mode, sessions, currentSessionId, pendingImage]);

  // Logic to determine if "Install App" button should appear
  // Shows if: (Browser supports it directly) OR (It's iOS and NOT already installed)
  const installable = !!deferredPrompt || (isIOS && !isStandalone);

  return (
    <div className="flex h-screen bg-shark-deep text-slate-200 font-sans selection:bg-shark-cyan selection:text-shark-900">
      
      <Sidebar 
        currentMode={mode} 
        onSelectMode={handleModeChange} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        installable={installable}
        onInstall={handleInstallClick}
      />

      {/* iOS Installation Instructions Modal */}
      {showIOSHint && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowIOSHint(false)}
        >
          <div 
            className="bg-shark-900 rounded-2xl p-6 max-w-sm w-full border border-shark-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowIOSHint(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-shark-800 rounded-xl flex items-center justify-center border border-shark-700">
                <ShareIcon className="w-6 h-6 text-shark-blue" />
              </div>
              <h3 className="text-xl font-bold text-white">Install for iOS</h3>
              <p className="text-slate-400 text-sm">
                Install this app on your iPhone or iPad for the best experience.
              </p>
              
              <div className="w-full space-y-3 mt-2 text-sm text-left bg-shark-950/50 p-4 rounded-lg border border-shark-800">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-shark-800 rounded-full flex items-center justify-center text-xs font-bold text-shark-cyan">1</span>
                  <span>Tap the <span className="font-bold text-shark-blue">Share</span> button in your browser bar.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-shark-800 rounded-full flex items-center justify-center text-xs font-bold text-shark-cyan">2</span>
                  <span>Scroll down and select <span className="font-bold text-white">Add to Home Screen</span>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col relative h-full">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-shark-700 bg-shark-900/80 backdrop-blur z-20">
          <span className="font-bold text-lg text-shark-cyan tracking-wider">BLUE SHARK AI</span>
          <button onClick={toggleSidebar} className="p-2 text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <main className="flex-1 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-shark-blue rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-shark-cyan rounded-full blur-[100px]" />
           </div>

           <ChatArea 
             messages={getActiveMessages()}
             input={input}
             isLoading={isLoading}
             currentMode={mode}
             pendingImage={pendingImage}
             sessionId={currentSessionId}
             onInputChange={(e) => setInput(e.target.value)}
             onInputSet={setInput}
             onSend={handleSend}
             onImageSelect={handleImageSelect}
             onClearPendingImage={() => setPendingImage(null)}
           />
        </main>
      </div>
    </div>
  );
};

export default App;
