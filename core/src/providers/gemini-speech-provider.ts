import { GoogleGenAI } from "@google/genai";
import { ISpeechProvider, SpeechSynthesizeOptions } from "../@types/speech-provider";
import { GeminiRequestBudget, buildGeminiHttpOptions } from "./gemini-request-options";
import { getUpstreamStatus } from "./gemini-error";

export class GeminiSpeechProvider implements ISpeechProvider {
  private readonly ai: GoogleGenAI;
  private readonly budget?: GeminiRequestBudget;

  constructor(apiKey: string, budget?: GeminiRequestBudget) {
    this.budget = budget;
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: budget ? buildGeminiHttpOptions(budget) : undefined,
    });
  }

  async *synthesizeStreaming(text: string, options: SpeechSynthesizeOptions): AsyncIterable<Uint8Array> {
    const model = process.env.SPEECH_MODEL_CHAIN?.split(',')[0] || 'gemini-3.1-flash-tts-preview';
    
    // Configura style tags se existirem
    const prompt = options.styleTags && options.styleTags.length > 0 
      ? `[${options.styleTags.join('][')}] ${text}` 
      : text;

      const stream = await this.ai.interactions.create({
        model,
        response_format: { type: "audio", mime_type: "audio/l16", sample_rate: 24000 },
        generation_config: {
          speech_config: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: options.voice,
              },
            },
          } as any,
        },
        input: prompt,
      }, {
        stream: true,
        signal: options.signal,
      } as any);

      for await (const event of stream as any) {
        if (event.event_type === 'step.delta' && event.delta?.type === 'audio') {
          // The audio might come in as base64 or Uint8Array, based on genai sdk
          if (event.delta.audio?.data) {
             const base64Data = event.delta.audio.data;
             const binaryStr = atob(base64Data);
             const bytes = new Uint8Array(binaryStr.length);
             for (let i = 0; i < binaryStr.length; i++) {
               bytes[i] = binaryStr.charCodeAt(i);
             }
             yield bytes;
          }
        }
      }
  }

  async synthesize(text: string, options: SpeechSynthesizeOptions): Promise<Uint8Array> {
    const model = process.env.SPEECH_MODEL_CHAIN?.split(',').pop() || 'gemini-2.5-flash-preview-tts';
    
    const prompt = options.styleTags && options.styleTags.length > 0 
      ? `[${options.styleTags.join('][')}] ${text}` 
      : text;

      const response = await this.ai.interactions.create({
        model,
        response_format: { type: "audio", mime_type: "audio/l16", sample_rate: 24000 },
        generation_config: {
          speech_config: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: options.voice,
              },
            },
          } as any,
        },
        input: prompt,
      }, {
        signal: options.signal,
      } as any);

      // Extract the audio from the response. This is likely in a property
      // like response.parts or response.output... Let's assume interactions returns
      // it in some form, perhaps response.candidates[0].content.parts
      // or similar. Wait, the docs say for interactions.create non-streaming,
      // it returns a GoogleGenAIInteraction.
      
      const interaction = response as any;
      if (interaction.output?.parts) {
        for (const part of interaction.output.parts) {
          if (part.audio) { // Or part.inlineData
             const base64Data = part.audio.data || part.inlineData?.data;
             if (base64Data) {
               const binaryStr = atob(base64Data);
               const bytes = new Uint8Array(binaryStr.length);
               for (let i = 0; i < binaryStr.length; i++) {
                 bytes[i] = binaryStr.charCodeAt(i);
               }
               return bytes;
             }
          }
        }
      }
      
      // se não encontrou em interactions, talvez gere empty
      return new Uint8Array(0);
  }
}
