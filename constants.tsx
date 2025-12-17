import React from 'react';
import { AppMode } from './types';

// Icons as functional components
export const SharkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
); // Abstract poly shape for Shark/Future feel

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

export const LayersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const MODE_CONFIGS = {
  [AppMode.HOMEWORK]: {
    label: "Homework Helper",
    description: "Clear explanations for math, science, and history.",
    icon: <BookIcon className="w-5 h-5" />,
    model: "gemini-2.5-flash",
    systemInstruction: "You are a patient and clear academic tutor named Blue Shark. Provide step-by-step explanations for homework questions in Math, Science, and Humanities. Use markdown for formulas."
  },
  [AppMode.CODING]: {
    label: "Code Master",
    description: "Expert full-stack engineering and debugging.",
    icon: <CodeIcon className="w-5 h-5" />,
    model: "gemini-3-pro-preview",
    systemInstruction: "You are a senior software engineer named Blue Shark. Provide clean, performant, and type-safe code examples. Explain your logic concisely. Prefer TypeScript and modern patterns."
  },
  [AppMode.SECURITY]: {
    label: "Ethical Hacking",
    description: "Security analysis, CTF tips, and defense strategies.",
    icon: <ShieldIcon className="w-5 h-5" />,
    model: "gemini-3-pro-preview",
    systemInstruction: "You are an ethical cybersecurity expert named Blue Shark. You assist with Capture The Flag (CTF) challenges, vulnerability analysis, and defensive coding. IMPORTANT: You refuse to generate malicious payloads, ransomware, or assist in illegal cyberattacks. You focus on education, remediation, and theory."
  },
  [AppMode.SHARK_TANK]: {
    label: "Shark Tank (Dual View)",
    description: "Compare fast answers vs. deep reasoning side-by-side.",
    icon: <LayersIcon className="w-5 h-5" />,
    model: "gemini-2.5-flash", // Primary model, secondary handles Pro
    systemInstruction: "You are Blue Shark. Provide a concise summary." 
  }
};