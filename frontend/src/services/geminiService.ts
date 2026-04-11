import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, AnalysisResult } from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY!
});

const MODEL = "gemini-2.0-flash-lite";




export const getSmartSuggestions = async (section: string, text: string) => {
  const r = await ai.models.generateContent({
    model: MODEL,
    contents: `Improve this ${section}: ${text}`
  });

  return r.text || text;
};



export const generateSummary = async (data: Partial<ResumeData>) => {
  const r = await ai.models.generateContent({
    model: MODEL,
    contents: `Write a resume summary from: ${JSON.stringify(data)}`
  });

  return r.text || "";
};



export const analyzeResumeStrength = async (
  data: ResumeData
): Promise<AnalysisResult> => {

  const r = await ai.models.generateContent({
    model: MODEL,
    contents: `Analyze resume: ${JSON.stringify(data)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordsMatch: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(r.text || "{}");
};



export const getQuantificationSuggestions = async (
  experience: ResumeData["experience"]
): Promise<string[]> => {
  if (!experience || experience.length === 0) return [];

  const r = await ai.models.generateContent({
    model: MODEL,
    contents: `You are a professional resume coach. Review these work experience descriptions and suggest 3 specific ways to add quantifiable metrics (numbers, percentages, dollar amounts) to make them more impactful. Return ONLY a JSON array of strings, each a concrete suggestion.\n\nExperience:\n${JSON.stringify(experience)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(r.text || "[]");
};



export const generateAuditReport = async (
  data: ResumeData
): Promise<string> => {
  const r = await ai.models.generateContent({
    model: MODEL,
    contents: `You are a senior resume expert. Generate a comprehensive, professional audit report for the following resume. Structure it with these sections:
1. EXECUTIVE SUMMARY
2. CONTENT STRENGTH ANALYSIS
3. ATS COMPATIBILITY
4. KEYWORD GAPS
5. FORMATTING & STRUCTURE
6. TOP 5 ACTIONABLE RECOMMENDATIONS

Resume data:
${JSON.stringify(data, null, 2)}`
  });

  return r.text || "Unable to generate audit report.";
};

