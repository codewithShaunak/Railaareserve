
import { GoogleGenAI } from "@google/genai";

export const getTravelAssistance = async (query: string, trainContext?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are a RailReserve assistant for Amaravati Railway Station.
    Help users with train timings and travel tips.
    The network now covers major destinations: Pune, Nagpur, Akola, Mumbai, Delhi, Hyderabad, Bangalore, Chennai, Ahmedabad, Surat, Jabalpur, Raipur, Indore, Bhopal, and Varanasi.
    Be concise and professional.
    Context of trains currently in system: ${trainContext || 'Available routes: All major Indian cities from Amaravati'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the network. Please try again in a moment.";
  }
};
