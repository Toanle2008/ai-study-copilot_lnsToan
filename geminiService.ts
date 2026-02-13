
import { GoogleGenAI, Type } from "@google/genai";
import { Message, StudentProfile, Document } from "./types";

/**
 * Khởi tạo client AI.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const chatWithAI = async (
  messages: Message[],
  profile: StudentProfile,
  attachments?: { data: string; mimeType: string }[]
) => {
  try {
    const ai = getAIClient();
    
    // Xây dựng nội dung cho lượt chat hiện tại
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];
    
    // Chuẩn bị các phần của tin nhắn cuối cùng (Text + Attachments)
    const currentParts: any[] = [{ text: lastMessage.text }];
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        currentParts.push({
          inlineData: {
            data: att.data,
            mimeType: att.mimeType
          }
        });
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: `Bạn là **AI Study Copilot** – gia sư học tập cá nhân 24/7 cho học sinh THPT Việt Nam.
Bạn hỗ trợ giải bài tập qua hình ảnh, phân tích tài liệu và trả lời câu hỏi.
Mọi công thức toán học PHẢI sử dụng LaTeX $...$. 
Hãy trả lời bằng tiếng Việt thân thiện, dễ hiểu. 
Thông tin học sinh: ${JSON.stringify(profile)}.`,
      },
    });
    return response.text;
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      return "⚠️ **Lỗi cấu hình:** Chưa tìm thấy API Key.";
    }
    console.error("Gemini Error:", error);
    return "Hệ thống đang bận một chút, bạn thử lại sau nhé! 🚀";
  }
};

export const analyzeDocument = async (base64Data: string, mimeType: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          {
            text: "Trích xuất và tóm tắt nội dung chính từ tài liệu này. Chuyển mọi công thức sang định dạng LaTeX $...$.",
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error(error);
    return "Không thể phân tích tài liệu này. Vui lòng kiểm tra định dạng file.";
  }
};

export const generateGroundedStudyPlan = async (
  profile: StudentProfile,
  documents: Document[],
  selection: { subject: string; topic: string; weakness: string },
) => {
  try {
    const ai = getAIClient();
    const relevantDocs = documents
      .filter((d) => d.type === selection.subject)
      .map((d) => d.content)
      .join("\n\n");

    const prompt = `
      Dựa trên thông tin học sinh: ${profile.name}, lớp ${profile.grade}.
      Tài liệu tham khảo hiện có: ${relevantDocs.substring(0, 5000)}
      Hãy tạo lộ trình học tập chi tiết cho bài học "${selection.topic}" môn ${selection.subject}. 
      Học sinh đang gặp khó khăn cụ thể: "${selection.weakness}".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategicGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  sourceCitation: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text?.trim() || '{"strategicGoals": [], "tasks": []}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Planner AI Error:", error);
    return { strategicGoals: ["Lỗi kết nối AI"], tasks: [] };
  }
};

export const generateLessonSummary = async (
  selection: { subject: string; grade: string; series: string; lesson: string },
  documents: Document[],
) => {
  try {
    const ai = getAIClient();
    const prompt = `
      Tóm tắt bài học "${selection.lesson}" (${selection.subject} - ${selection.grade} - ${selection.series}).
      Yêu cầu tóm tắt logic theo phong cách NotebookLM, bao gồm sơ đồ tri thức.
      Mọi công thức toán/lý/hóa PHẢI dùng LaTeX $...$.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            briefing: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
              },
            },
            mindmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  node: { type: Type.STRING },
                  children: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            qa: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(error);
    return { title: "Lỗi kết nối", briefing: "Vui lòng thử lại sau." };
  }
};
