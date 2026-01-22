import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const getClient = () => {
    if (!apiKey) {
        console.warn("API Key not found in environment variables");
        return null;
    }
    return new GoogleGenAI({ apiKey });
}

export type CoachMode = 'standard' | 'expert';

export const streamCoachResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  userMessage: string,
  mode: CoachMode,
  onChunk: (text: string) => void
) => {
  const client = getClient();
  if (!client) {
    onChunk("Error: API Key is missing. Please check your configuration.");
    return;
  }

  const isExpert = mode === 'expert';
  
  // Expert Mode uses Gemini 3 Pro with Thinking for complex reasoning
  // Standard Mode uses Gemini 3 Flash for speed and fluidity
  const modelName = isExpert ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  let systemInstruction = `
    You are Dr. Fit, an expert Sports Medicine Physician, Strength & Conditioning Coach, and Nutritionist.
    You are coaching Gaurav (24M, 60kg, 5'7", Goal: Bone Strength & Lean Muscle).
    
    YOUR PERSONA:
    - Professional, clinical, yet motivating.
    - Evidence-based advice only. No "bro-science".
    - Safety first. If a user mentions pain, suggest seeing a doctor.
    - Focus on his specific stats: Low bone mass (needs impact/loading), good protein rate, low BMR (needs metabolic boost).

    CORE KNOWLEDGE:
    - Bone Strength: Wolff's Law, axial loading, calcium/vitamin D, impact training.
    - Lookmaxing: Posture correction, skin health (hydration/sleep), stress management. No dangerous mewing.
    - Kegels: Pelvic floor strength for core stability and health.

    Be concise. Use bullet points for steps.
  `;

  if (isExpert) {
      systemInstruction += `
      \n*** EXPERT MODE ACTIVE ***
      You are now operating in Deep Reasoning Mode. 
      - Analyze the biomechanics of the user's query in depth.
      - If asking about pain/injury, consider kinematic chains (e.g., ankle mobility affecting knee pain).
      - Provide highly specific, step-by-step programming logic.
      - Think before you speak to ensure maximum accuracy.
      `;
  }

  try {
    const config: any = {
        systemInstruction: systemInstruction,
    };

    if (isExpert) {
        // Thinking mode configuration for complex queries
        config.thinkingConfig = { thinkingBudget: 32768 }; 
    } else {
        // Standard config for chat
        config.temperature = 0.7;
    }

    const chat = client.chats.create({
      model: modelName,
      config: config,
      history: history.map(h => ({
          role: h.role,
          parts: h.parts
      })),
    });

    const result = await chat.sendMessageStream({ message: userMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    onChunk("\n\n*Connection error or thinking timeout. Please try again later.*");
  }
};

export const getDailyTip = async (): Promise<string> => {
    const client = getClient();
    if (!client) return "Stay consistent!";

    try {
        // Use flash-lite for a quick, cheap daily tip
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-lite-latest',
            contents: "Give me one single sentence, high-impact health tip for a 24-year-old male trying to increase bone density and muscle mass.",
        });
        return response.text || "Drink water and prioritize sleep.";
    } catch (e) {
        return "Consistency is key to progress.";
    }
}