import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Generates a LinkedIn post based on a topic and target audience.
 */
export const generateLinkedInPost = async (
  topic: string,
  audience: 'student' | 'professional',
  tone: 'casual' | 'professional' | 'excited'
): Promise<string> => {
  try {
    const systemInstruction = `You are an expert LinkedIn content creator. 
    Create engaging, viral-worthy, yet professional posts. 
    Structure the post with a hook, body, and call to action. 
    Add relevant hashtags at the end.`;

    const prompt = `Create a LinkedIn post for a ${audience} audience.
    Topic: ${topic}
    Tone: ${tone}
    
    Keep it under 200 words.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Failed to generate post.";
  } catch (error) {
    console.error("Error generating post:", error);
    return "Error generating post. Please check your API key.";
  }
};

/**
 * Parses a natural language string (voice transcript) into structured data.
 */
export const parseVoiceCommand = async (transcript: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Parse the following text which is a voice note from a user.
      Determine if they are talking about a "job" application they just made/updated, or a new "connection" they met.
      
      User Input: "${transcript}"
      
      Extract the relevant details into JSON. 
      For 'status', do NOT default to 'Applied' unless explicitly stated. 
      Instead, capture the specific action or state described (e.g., 'Emailed recruiter', 'Met for coffee', 'First Round Interview', 'Sent Resume').
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: ["job", "connection", "unknown"],
              description: "The type of entry detected from the text."
            },
            jobData: {
              type: Type.OBJECT,
              nullable: true,
              description: "If type is job, populate this.",
              properties: {
                company: { type: Type.STRING, nullable: true },
                role: { type: Type.STRING, nullable: true },
                status: { type: Type.STRING, nullable: true, description: "The actual status or action taken (e.g. 'Emailed', 'Interview Scheduled')." },
                notes: { type: Type.STRING, nullable: true }
              }
            },
            connectionData: {
              type: Type.OBJECT,
              nullable: true,
              description: "If type is connection, populate this.",
              properties: {
                name: { type: Type.STRING, nullable: true },
                role: { type: Type.STRING, nullable: true },
                company: { type: Type.STRING, nullable: true },
                email: { type: Type.STRING, nullable: true },
                status: { type: Type.STRING, nullable: true, description: "Current status of relationship (e.g. 'Met', 'Scheduled Call')." },
                notes: { type: Type.STRING, nullable: true }
              }
            },
            message: {
              type: Type.STRING,
              description: "A short confirmation message to show the user."
            }
          },
          required: ["type", "message"]
        }
      }
    });

    let text = response.text;
    if (!text) return { type: 'unknown', message: 'Could not parse response.' };

    // Robustly clean markdown code blocks if present
    text = text.trim();
    if (text.startsWith('```')) {
        // Remove opening ```json or ```
        text = text.replace(/^```(json)?\s*/i, '');
        // Remove closing ```
        text = text.replace(/\s*```$/, '');
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Error parsing voice command:", error);
    return { type: 'unknown', message: 'Error processing AI request.' };
  }
};