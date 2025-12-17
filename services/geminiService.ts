import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AppMode } from '../types';

const getAiClient = () => {
  // Assuming process.env.API_KEY is available
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Streaming chat generator for standard modes
 */
export async function* streamChatResponse(
  history: { role: string; parts: [{ text: string }] }[],
  message: string,
  modelName: string,
  systemInstruction: string
): AsyncGenerator<string, void, unknown> {
  const ai = getAiClient();
  
  const chat: Chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction,
    },
    history: history,
  });

  const result = await chat.sendMessageStream({ message });

  for await (const chunk of result) {
    const response = chunk as GenerateContentResponse;
    if (response.text) {
      yield response.text;
    }
  }
}

/**
 * Single shot generation (used for Shark Tank parallel requests)
 */
export async function generateSingleResponse(
  message: string,
  modelName: string,
  systemInstruction: string
): Promise<string> {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: modelName,
    contents: message,
    config: {
      systemInstruction,
    }
  });
  
  return response.text || "No response generated.";
}