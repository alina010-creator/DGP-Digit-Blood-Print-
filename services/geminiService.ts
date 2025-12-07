import { GoogleGenAI, Type } from "@google/genai";
import { BloodGroupAnalysis } from "../types";

const parseJSON = (text: string): any => {
    try {
        return JSON.parse(text);
    } catch (e) {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
            try {
                return JSON.parse(match[1]);
            } catch (e2) {
                console.error("Failed to parse extracted JSON", e2);
            }
        }
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            try {
                return JSON.parse(text.substring(start, end + 1));
            } catch (e3) {
                 console.error("Failed to parse substring JSON", e3);
            }
        }
        throw new Error("Could not parse JSON response from Gemini");
    }
};

export const analyzeFingerprint = async (file: File): Promise<BloodGroupAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please configuration environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const schema = {
    type: Type.OBJECT,
    properties: {
      bloodGroup: {
        type: Type.STRING,
        description: "The predicted blood group (e.g., A+, A-, B+, B-, O+, O-, AB+, AB-).",
      },
      confidence: {
        type: Type.INTEGER,
        description: "Confidence percentage (0-100) based on ridge clarity and pattern distinctiveness.",
      },
      patternType: {
        type: Type.STRING,
        description: "Precise dermatoglyphic pattern (e.g., Ulnar Loop, Radial Loop, Plain Whorl, Double Loop Whorl, Plain Arch, Tented Arch).",
      },
      reasoning: {
        type: Type.STRING,
        description: "Detailed technical analysis of ridge count, delta points, and core location leading to the conclusion.",
      },
      personalityTraits: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 professional personality descriptors associated with this blood type.",
      },
      rarity: {
        type: Type.STRING,
        description: "Statistical rarity of this specific pattern-blood type combination.",
      },
    },
    required: ["bloodGroup", "confidence", "patternType", "reasoning", "personalityTraits", "rarity"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: file.type || 'image/png',
                    data: base64Data
                }
            },
            {
                text: `Perform a professional forensic dermatoglyphic analysis on this fingerprint. 
                1. Identify the specific pattern type (Arch, Loop, Whorl) by locating the core and delta points.
                2. Analyze the ridge density and curvature.
                3. Based on anthropometric statistical models (and cultural Ketsuekigata theory), predict the most probable blood group.
                4. Be decisive and precise. 
                
                Output strictly strictly valid JSON matching the schema.`
            }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // Lower temperature for more consistent/analytical results
      },
    });

    const text = response.text;
    if (!text) throw new Error("Analysis failed: No data returned.");

    return parseJSON(text) as BloodGroupAnalysis;

  } catch (error) {
    console.error("DGP Analysis Error:", error);
    throw new Error("Unable to process fingerprint. Ensure image is clear and try again.");
  }
};