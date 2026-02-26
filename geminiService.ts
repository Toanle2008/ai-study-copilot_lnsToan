
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Message, StudentProfile, SubjectGrades } from "./types";

// --- Constants ---
const STABLE_MODEL = "gemini-3-flash-preview";
const MAX_RETRIES = 2;
const TIMEOUT_MS = 30000;
const HISTORY_LIMIT = 3;

export enum GeminiErrorType {
  API_KEY_MISSING = "API_KEY_MISSING",
  RATE_LIMIT = "RATE_LIMIT",
  TIMEOUT = "TIMEOUT",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  EMPTY_RESPONSE = "EMPTY_RESPONSE"
}

export class GeminiError extends Error {
  constructor(public type: GeminiErrorType, message: string) {
    super(message);
    this.name = "GeminiError";
  }
}

// --- Factory ---
const getAIClient = (keyName: "GEMINI_API_KEY" | "GEMINI_API_KEY2" = "GEMINI_API_KEY") => {
  const apiKey = process.env[keyName];
  if (!apiKey) {
    throw new GeminiError(GeminiErrorType.API_KEY_MISSING, `Environment variable ${keyName} is missing.`);
  }
  return new GoogleGenAI({ apiKey });
};

// --- Helpers ---

/**
 * Exponential backoff retry logic with timeout protection
 */
async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new GeminiError(GeminiErrorType.TIMEOUT, "Request timed out")), TIMEOUT_MS)
      );
      return (await Promise.race([fn(), timeoutPromise])) as T;
    } catch (error: any) {
      lastError = error;
      if (error.type === GeminiErrorType.TIMEOUT || error.message?.includes("429") || error.message?.includes("500")) {
        if (i < retries) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

const calculateAvg = (grades: SubjectGrades) => {
  let totalPoints = 0;
  let totalWeight = 0;
  grades.frequent.filter(g => g !== null).forEach(g => { totalPoints += Number(g); totalWeight += 1; });
  if (grades.midterm !== null) { totalPoints += Number(grades.midterm) * 2; totalWeight += 2; }
  if (grades.final !== null) { totalPoints += Number(grades.final) * 3; totalWeight += 3; }
  return totalWeight === 0 ? 0 : parseFloat((totalPoints / totalWeight).toFixed(2));
};

const minimizeProfile = (profile: StudentProfile) => {
  return {
    grade: profile.grade,
    focus: profile.focusSubject,
    subjects: profile.subjects
      .filter(s => s.isActive)
      .map(s => ({ n: s.name, a: calculateAvg(s.grades) })),
    errors: profile.recentErrors.slice(0, 3).map(e => ({ t: e.topic, r: e.reason }))
  };
};

const safeJsonParse = (text: string, fallback: any) => {
  try {
    // Clean potential markdown code blocks
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return fallback;
  }
};

// --- Exported Services ---

export const generateProfileAnalysis = async (profile: StudentProfile) => {
  return withRetry(async () => {
    const ai = getAIClient("GEMINI_API_KEY");
    const minimized = minimizeProfile(profile);

    const prompt = `
      Phân tích học bạ: ${minimized.grade}, Mục tiêu: ${minimized.focus}
      Điểm TBM: ${JSON.stringify(minimized.subjects)}
      Lỗi: ${JSON.stringify(minimized.errors)}

      Yêu cầu JSON:
      { "status": string, "overview": string, "gaps": string, "strategy": string[] }
    `;

    const response = await ai.models.generateContent({
      model: STABLE_MODEL,
      contents: prompt,
      config: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            overview: { type: Type.STRING },
            gaps: { type: Type.STRING },
            strategy: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["status", "overview", "gaps", "strategy"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new GeminiError(GeminiErrorType.EMPTY_RESPONSE, "AI returned empty content");
    return safeJsonParse(text, null);
  }).catch(err => {
    console.error("Analysis failed:", err);
    return null;
  });
};

export const chatWithAI = async (
  messages: Message[],
  profile: StudentProfile,
  attachments?: { data: string; mimeType: string }[]
) => {
  return withRetry(async () => {
    const ai = getAIClient("GEMINI_API_KEY2");
    const history = messages.slice(-HISTORY_LIMIT - 1, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];
    const currentParts: any[] = [{ text: lastMessage.text }];
    
    if (attachments) {
      attachments.forEach(att => {
        currentParts.push({ inlineData: { data: att.data, mimeType: att.mimeType } });
      });
    }

    const response = await ai.models.generateContent({
      model: STABLE_MODEL,
      contents: [...history, { role: 'user', parts: currentParts }],
      config: {
        systemInstruction: `Bạn là AI Study Copilot cho học sinh Việt Nam. Hỗ trợ giải bài, phân tích tài liệu. Dùng LaTeX $...$ cho công thức. Thông tin: ${JSON.stringify(minimizeProfile(profile))}.`,
      },
    });

    return response.text || "Hệ thống không phản hồi.";
  }).catch(() => "Hệ thống đang bận, thử lại sau nhé! 🚀");
};

export const chatWithAIStream = async (
  messages: Message[],
  profile: StudentProfile,
  onChunk: (incrementalText: string) => void,
  attachments?: { data: string; mimeType: string }[]
) => {
  try {
    const ai = getAIClient("GEMINI_API_KEY2");
    const history = messages.slice(-HISTORY_LIMIT - 1, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];
    const currentParts: any[] = [{ text: lastMessage.text }];
    
    if (attachments) {
      attachments.forEach(att => {
        currentParts.push({ inlineData: { data: att.data, mimeType: att.mimeType } });
      });
    }

    const response = await ai.models.generateContentStream({
      model: STABLE_MODEL,
      contents: [...history, { role: 'user', parts: currentParts }],
      config: {
        systemInstruction: `Bạn là AI Study Copilot cho học sinh Việt Nam. Hỗ trợ giải bài, phân tích tài liệu. Dùng LaTeX $...$ cho công thức. Thông tin: ${JSON.stringify(minimizeProfile(profile))}.`,
      },
    });

    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        onChunk(chunkText); // Sending incremental text
      }
    }
  } catch (error: any) {
    console.error("Streaming error:", error);
    onChunk("Hệ thống đang bận, thử lại sau nhé! 🚀");
  }
};

export const analyzeDocument = async (base64Data: string, mimeType: string) => {
  return withRetry(async () => {
    const ai = getAIClient("GEMINI_API_KEY");
    const response = await ai.models.generateContent({
      model: STABLE_MODEL,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Tóm tắt tài liệu này. Công thức dùng LaTeX $...$." },
        ],
      },
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "Không thể phân tích tài liệu.";
  }).catch(() => "Không thể phân tích tài liệu.");
};
