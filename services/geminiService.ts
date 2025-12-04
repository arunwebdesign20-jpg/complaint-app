import { GoogleGenAI, Type } from "@google/genai";
import { Complaint } from "../types";

// Helper to get the AI instance
const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeComplaint = async (complaint: Complaint): Promise<{ summary: string; priority: string; advice: string } | null> => {
  const ai = getAiInstance();
  if (!ai) return null;

  try {
    const prompt = `
      Analyze the following student complaint from a college environment.
      Student Branch: ${complaint.branch}
      Semester: ${complaint.semester}
      Description: "${complaint.description}"

      Provide a JSON response with:
      1. summary: A concise 1-sentence summary.
      2. priority: Recommended priority (Low, Medium, or High).
      3. advice: A brief suggestion for the teacher on how to handle this.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            priority: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["summary", "priority", "advice"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing complaint with Gemini:", error);
    return null;
  }
};
