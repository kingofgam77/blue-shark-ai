
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AppMode } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

async function ensureUserApiKey(modelName?: string) {
  const win = window as any;
  // Check if aistudio object exists
  if (win.aistudio) {
    // Check if we need to force selection based on model (Gemini 3 Pro)
    // Note: shark-tank-dual uses gemini-3-pro-preview internally
    const needsPaidKey = modelName?.includes('gemini-3-pro') || modelName === 'shark-tank-dual';

    if (needsPaidKey) {
      const hasKey = await win.aistudio.hasSelectedApiKey();
      if (!hasKey) {
         await win.aistudio.openSelectKey();
      }
    }
  }
}

// --- Text & Chat ---

export async function* streamChatResponse(
  history: { role: string; parts: [{ text: string }] }[],
  message: string,
  modelName: string,
  systemInstruction: string
): AsyncGenerator<string, void, unknown> {
  await ensureUserApiKey(modelName);

  const executeStream = async function* () {
    const ai = getAiClient();

    if (modelName === 'shark-tank-dual') {
      // SHARK TANK MODE: Dual Streams
      
      // 1. Flash Shark (Fast)
      yield "### ⚡ Flash Shark (Speed)\n\n";
      const chatFlash = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history,
        config: { systemInstruction: "You are Flash Shark, a fast, decisive, and efficient AI advisor. Be concise and get straight to the point." }
      });
      const resultFlash = await chatFlash.sendMessageStream({ message });
      for await (const chunk of resultFlash) {
        const response = chunk as GenerateContentResponse;
        if (response.text) yield response.text;
      }

      // Separator
      yield "\n\n---\n\n";

      // 2. Pro Shark (Smart)
      yield "### 🦈 Pro Shark (Strategy)\n\n";
      const chatPro = ai.chats.create({
        model: 'gemini-3-pro-preview',
        history: history,
        config: { systemInstruction: "You are Pro Shark, a highly analytical, strategic, and detailed AI advisor. Provide deep insights and comprehensive reasoning." }
      });
      const resultPro = await chatPro.sendMessageStream({ message });
      for await (const chunk of resultPro) {
         const response = chunk as GenerateContentResponse;
         if (response.text) yield response.text;
      }
      return;
    }

    // Standard Single Model Mode
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
  };

  try {
    yield* executeStream();
  } catch (error: any) {
    // Handle specific 404 Not Found regarding entity (API Key context lost or invalid project)
    if (error.message?.includes('Requested entity was not found')) {
      const win = window as any;
      if (win.aistudio) {
        // Reset/Open key selection
        await win.aistudio.openSelectKey();
        // Retry the stream with the new key
        yield* executeStream();
        return;
      }
    }
    throw error;
  }
}

export async function generateSingleResponse(
  message: string,
  modelName: string,
  systemInstruction: string
): Promise<string> {
  await ensureUserApiKey(modelName);
  
  const attemptCall = async () => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: modelName,
      contents: message,
      config: {
        systemInstruction,
      }
    });
    return response.text || "No response generated.";
  };

  try {
    return await attemptCall();
  } catch (error: any) {
    if (error.message?.includes('Requested entity was not found')) {
      const win = window as any;
      if (win.aistudio) {
        await win.aistudio.openSelectKey();
        return await attemptCall();
      }
    }
    throw error;
  }
}
