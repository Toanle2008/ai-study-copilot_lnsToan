
import { GoogleGenAI, Type } from "@google/genai";
import { Message, StudentProfile, Document, SubjectGrades } from "./types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

// Hàm phụ để tính TBM giúp AI có dữ liệu chính xác nhất
const calculateAvg = (grades: SubjectGrades) => {
  let totalPoints = 0;
  let totalWeight = 0;
  grades.frequent.filter(g => g !== null).forEach(g => { totalPoints += Number(g); totalWeight += 1; });
  if (grades.midterm !== null) { totalPoints += Number(grades.midterm) * 2; totalWeight += 2; }
  if (grades.final !== null) { totalPoints += Number(grades.final) * 3; totalWeight += 3; }
  return totalWeight === 0 ? 0 : parseFloat((totalPoints / totalWeight).toFixed(2));
};

export const generateProfileAnalysis = async (profile: StudentProfile) => {
  try {
    const ai = getAIClient();
    
    const subjectsSummary = profile.subjects
      .filter(s => s.isActive)
      .map(s => ({
        name: s.name,
        avg: calculateAvg(s.grades),
        frequent: s.grades.frequent,
        midterm: s.grades.midterm,
        final: s.grades.final
      }));

    const prompt = `
      PHÂN TÍCH HỌC BẠ HỌC SINH (Thời gian: ${new Date().toLocaleString()})
      Học sinh: ${profile.name} - Lớp: ${profile.grade}
      Mục tiêu: ${profile.focusSubject}
      
      Dữ liệu điểm số hiện tại (Đã tính toán TBM):
      ${JSON.stringify(subjectsSummary)}
      
      Lỗi sai gần đây: ${JSON.stringify(profile.recentErrors)}

      YÊU CẦU:
      1. Đưa ra nhận xét CÁ NHÂN HÓA.
      2. Status: Một câu cực ngắn về phong độ (VD: "Bứt phá ngoạn mục", "Cảnh báo sa sút", "Ổn định").
      3. Overview: Đánh giá dựa trên TBM các môn so với mục tiêu khối thi.
      4. Gaps: Chỉ ra môn nào có điểm thành phần thấp bất thường.
      5. Strategy: 3 hành động cụ thể để cải thiện TBM.

      Trả về định dạng JSON: { "status": string, "overview": string, "gaps": string, "strategy": string[] }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: prompt,
      config: {
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
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};

export const chatWithAI = async (
  messages: Message[],
  profile: StudentProfile,
  attachments?: { data: string; mimeType: string }[]
) => {
  try {
    const ai = getAIClient();
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1];
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
        systemInstruction: `Bạn là AI Study Copilot cho học sinh Việt Nam. 
Hỗ trợ giải bài qua hình ảnh, phân tích tài liệu. 
Công thức toán PHẢI dùng LaTeX $...$.
Thông tin: ${JSON.stringify(profile)}.`,
      },
    });
    return response.text;
  } catch (error: any) {
    return "Hệ thống đang bận, thử lại sau nhé! 🚀";
  }
};

export const analyzeDocument = async (base64Data: string, mimeType: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Tóm tắt tài liệu này. Công thức dùng LaTeX $...$." },
        ],
      },
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text;
  } catch (error) {
    return "Không thể phân tích tài liệu.";
  }
};
