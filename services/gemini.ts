import { GoogleGenAI, Modality } from "@google/genai";
import { PassportData, PassportCheckResponse } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the passport profile to provide travel insights and risk assessment.
 */
export const analyzePassportProfile = async (
  inputData: PassportData,
  processedData: PassportCheckResponse
): Promise<string> => {
  try {
    const prompt = `
      You are an expert Senior Global Mobility Consultant and Former Immigration Officer.
      Analyze this passport profile.
      
      User Profile:
      ${JSON.stringify({ ...inputData, stats: processedData }, null, 2)}

      Provide a structured Markdown report:
      
      ## 🌍 Global Mobility Score: [Score]/100
      
      ### 🛡️ Visa Portfolio Strength
      [Analyze the mix of approved/pending visas. Are they Tier 1 countries?]

      ### ✈️ Travel Freedom Analysis
      [Comment on the travel history. Does it show positive travel behavior?]

      ### 🚀 Strategic Recommendation
      [Recommend exactly ONE specific visa to apply for next that would drastically improve their mobility score. Explain why.]

      Tone: Professional, authoritative, yet encouraging. Keep it under 200 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a government-grade travel analyst.",
      }
    });

    return response.text || "Analysis could not be generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "## System Error\n\nUnable to connect to the Global Mobility Database. Please verify your API configuration.";
  }
};

/**
 * Generates AI Voice audio from the provided text using Gemini TTS.
 */
export const generateAudioSummary = async (text: string): Promise<AudioBuffer | null> => {
  try {
    // Clean text for better speech synthesis (remove excessive markdown symbols)
    const speechPrompt = `Please read this report clearly and professionally: ${text.replace(/[*#]/g, '')}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: speechPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Using a deep, authoritative voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    // Decode PCM Data
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const pcmBytes = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(pcmBytes, audioContext, 24000, 1);
    
    return audioBuffer;

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// --- Audio Helper Functions ---

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
