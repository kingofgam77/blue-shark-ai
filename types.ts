
export type Role = 'user' | 'model';

export enum AppMode {
  HOMEWORK = 'HOMEWORK',
  CODING = 'CODING',
  SECURITY = 'SECURITY',
  SHARK_TANK = 'SHARK_TANK', // Dual Mode replacing Fast Chat
  PRO_CHAT = 'PRO_CHAT', // Gemini 3 Pro
}

export interface MessagePart {
  text: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  image?: {
    data: string; // base64
    mimeType: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: AppMode;
  timestamp: number;
}

export interface ModelConfig {
  modelName: string;
  systemInstruction: string;
  temperature?: number;
}
