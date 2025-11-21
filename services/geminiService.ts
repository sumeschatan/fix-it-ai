import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIAnalysisResult {
  diagnosis: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  troubleshootingSteps: string[];
}

export const analyzeTicketIssue = async (
  description: string,
  imageBase64?: string
): Promise<AIAnalysisResult> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    const promptText = `
      You are an expert IT Support Technician. Analyze the following computer problem description (and image if provided) submitted by a user in Thai.
      
      User Description: "${description}"
      
      Please provide:
      1. A short technical diagnosis (in Thai).
      2. An estimated urgency level (LOW, MEDIUM, HIGH, CRITICAL).
      3. A category (Hardware, Software, Network, Peripheral, User Error).
      4. A list of 3 simple troubleshooting steps the user can try immediately (in Thai).

      Return the response in JSON format.
    `;

    const parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      // Extract base64 data if it contains the prefix
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming JPEG for simplicity, or detect from string
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                diagnosis: { type: Type.STRING },
                urgency: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                category: { type: Type.STRING },
                troubleshootingSteps: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ["diagnosis", "urgency", "category", "troubleshootingSteps"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing ticket with Gemini:", error);
    // Fallback in case of error
    return {
      diagnosis: "ไม่สามารถวิเคราะห์ได้ในขณะนี้ (AI Unavailable)",
      urgency: "MEDIUM",
      category: "Unknown",
      troubleshootingSteps: ["โปรดรอเจ้าหน้าที่ติดต่อกลับ"]
    };
  }
};