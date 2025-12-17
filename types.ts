export type Role = 'user' | 'model';

export enum AppMode {
  HOMEWORK = 'HOMEWORK',
  CODING = 'CODING',
  SECURITY = 'SECURITY',
  SHARK_TANK = 'SHARK_TANK', // Dual model mode
}

export interface MessagePart {
  text: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  // For Shark Tank mode (multi-result)
  secondaryContent?: string; 
  isMultiModel?: boolean;
}

export interface ModelConfig {
  modelName: string;
  systemInstruction: string;
  temperature?: number;
}