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

export const performATSAnalysis = async (data: ResumeData): Promise<import('../types').ATSResult> => {
  const resumeText = `
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
LinkedIn: ${data.linkedin}
Website: ${data.website}
Location: ${data.location}

SUMMARY:
${data.summary}

EXPERIENCE (${data.experience?.length || 0} entries):
${(data.experience || []).map(e => `- ${e.position} at ${e.company} (${e.startDate} - ${e.endDate})\n  ${e.description}`).join('\n')}

EDUCATION (${data.education?.length || 0} entries):
${(data.education || []).map(e => `- ${e.degree} in ${e.field} from ${e.institution} (${e.graduationDate})`).join('\n')}

SKILLS (${data.skills?.length || 0}):
${(data.skills || []).join(', ')}

PROJECTS (${data.projects?.length || 0}):
${(data.projects || []).map(p => `- ${p.title}: ${p.description}`).join('\n')}

CERTIFICATIONS (${data.certifications?.length || 0}):
${(data.certifications || []).map(c => `- ${c.name} from ${c.issuer}`).join('\n')}
`.trim();

  const r = await ai.models.generateContent({
    model: MODEL,
    contents: `You are a world-class ATS (Applicant Tracking System) expert and resume coach. Analyze this resume thoroughly and return a structured JSON result.

RESUME:
${resumeText}

SCORING METHODOLOGY:
- completeness: Does resume have name + email + phone + linkedin + summary + experience + skills + education? (0-100)
- summary: Is the summary present, detailed (3+ sentences), and keyword-rich? (0-100)
- experience: Does it have quantified achievements (numbers, %, $)? Multiple entries? Clear job titles? (0-100)
- skills: Does it have 8+ relevant skills? Are they industry-standard keywords? (0-100)
- education: Is institution, degree, field, graduation date all present? (0-100)
- overallScore: Weighted average: completeness*0.10 + summary*0.15 + experience*0.25 + skills*0.20 + education*0.10 + (projects present ? 10 : 0) + (certifications present ? 10 : 0)

Write suggestions like a friendly career coach — use "you", be specific, mention exactly what is missing. Examples:
"Your summary is only 1 line — a 3-line punchy intro can really help recruiters remember you!"
"You have great experience but no numbers — adding metrics like '40% faster delivery' or 'team of 6' makes it much more impactful."

PRESENT KEYWORDS: List actual skills/technologies found in the resume.
MISSING KEYWORDS: Suggest 8-12 in-demand keywords for this career domain that should be added.
STRENGTHS: Write 2-4 specific things that are genuinely good about this resume.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          sectionScores: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.NUMBER },
              experience: { type: Type.NUMBER },
              skills: { type: Type.NUMBER },
              education: { type: Type.NUMBER },
              completeness: { type: Type.NUMBER },
            }
          },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          presentKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                detail: { type: Type.STRING },
                impact: { type: Type.STRING },
                section: { type: Type.STRING },
              }
            }
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(r.text || '{}');
};
