
import React from 'react';
import { AppMode } from './types';

export const SharkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export const BookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const CodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const HistoryIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export const MicIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

export const StopIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/>
  </svg>
);

export const TankIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Tank Container */}
    <path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" className="transition-all duration-300 group-hover:stroke-shark-cyan" />
    {/* Water Surface */}
    <path d="M5 11c2.5-1 5-1 7-1s4.5 0 7 1" className="transition-all duration-700 ease-in-out group-hover:translate-y-1" />
    {/* Bubbles */}
    <circle cx="9" cy="16" r="1.5" className="fill-current opacity-0 group-hover:opacity-100 group-hover:animate-float text-shark-cyan/80" />
    <circle cx="14" cy="15" r="1" className="fill-current opacity-0 group-hover:opacity-100 group-hover:animate-float text-shark-cyan/60 [animation-delay:1000ms]" />
  </svg>
);

export const ChatIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01" strokeWidth="3" className="animate-[bounce_1.4s_infinite_.2s]" />
    <path d="M12 10h.01" strokeWidth="3" className="animate-[bounce_1.4s_infinite_.4s]" />
    <path d="M16 10h.01" strokeWidth="3" className="animate-[bounce_1.4s_infinite_.6s]" />
  </svg>
);

export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const ShareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);


export const MODE_CONFIGS = {
  [AppMode.PRO_CHAT]: {
    label: "Pro Chat (Gemini 3)",
    description: "Complex reasoning and in-depth analysis.",
    icon: <ChatIcon className="w-5 h-5 group-hover:text-shark-cyan transition-colors" />,
    model: "gemini-3-pro-preview",
    systemInstruction: "You are Blue Shark, a helpful and highly intelligent AI assistant."
  },
  [AppMode.SHARK_TANK]: {
    label: "Shark Tank (Dual Mode)",
    description: "Compare results from Flash (Speed) and Pro (Depth).",
    icon: <TankIcon className="w-5 h-5" />,
    model: "shark-tank-dual",
    systemInstruction: "You are a dual-model AI system."
  },
  [AppMode.HOMEWORK]: {
    label: "Homework Helper",
    description: "Clear explanations for academic queries.",
    icon: <BookIcon className="w-5 h-5" />,
    model: "gemini-3-flash-preview",
    systemInstruction: "You are a patient academic tutor named Blue Shark. Provide step-by-step explanations."
  },
  [AppMode.CODING]: {
    label: "Code Master",
    description: "Expert full-stack engineering and debugging.",
    icon: <CodeIcon className="w-5 h-5" />,
    model: "gemini-3-pro-preview",
    systemInstruction: "You are a senior software engineer named Blue Shark. Provide clean, performant, type-safe code."
  },
  [AppMode.SECURITY]: {
    label: "Ethical Hacking",
    description: "Security analysis and CTF strategies.",
    icon: <ShieldIcon className="w-5 h-5" />,
    model: "gemini-3-pro-preview",
    systemInstruction: "You are an ethical cybersecurity expert named Blue Shark. Assist with CTF challenges and remediation. Refuse illegal requests."
  },
};
