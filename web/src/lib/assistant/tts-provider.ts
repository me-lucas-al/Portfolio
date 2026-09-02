import { GoogleGenAI } from "@google/genai";
import { isUpstreamOverloaded, isAbortError } from "@portfolio/core/src/providers/gemini-error";

const DEFAULT_MODEL = "gemini-2.5-flash-preview-tts";
const DEFAULT_VOICE = "Achird";

const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 300;

export interface SynthesizedSpeech {
  pcm: Buffer;
  sampleRate: number;
}

export function resolveModel(): string {
  return process.env.ASSISTANT_TTS_MODEL || DEFAULT_MODEL;
}

export function resolveVoice(): string {
  return process.env.ASSISTANT_TTS_VOICE || DEFAULT_VOICE;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RawAudioContent {
  type: "audio";
  data?: string;
  sample_rate?: number;
  mime_type?: string;
}

function extractAudioContent(response: unknown): RawAudioContent | undefined {
  const steps = (response as { steps?: Array<{ content?: unknown[] }> })?.steps;
  const content = steps?.[0]?.content?.[0] as RawAudioContent | undefined;
  return content?.type === "audio" ? content : undefined;
}

export async function synthesizeSpeech(apiKey: string, text: string, signal: AbortSignal): Promise<SynthesizedSpeech> {
  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown;

  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    if (signal.aborted) {
      throw new DOMException("Speech synthesis aborted", "AbortError");
    }

    try {
      const response = await ai.interactions.create(
        {
          model: resolveModel(),
          input: text,
          generation_config: {
            speech_config: [{ voice: resolveVoice() }],
          },
          response_format: { type: "audio" },
        } as Parameters<typeof ai.interactions.create>[0],
        { fetchOptions: { signal } } as Parameters<typeof ai.interactions.create>[1],
      );

      const audio = extractAudioContent(response);
      if (!audio?.data) {
        throw new Error("Gemini TTS response did not include audio content");
      }

      return { pcm: Buffer.from(audio.data, "base64"), sampleRate: audio.sample_rate ?? 24000 };
    } catch (error) {
      lastError = error;

      if (isAbortError(error)) throw error;

      const isLastAttempt = attempt === RETRY_ATTEMPTS - 1;
      if (isLastAttempt || !isUpstreamOverloaded(error)) throw error;

      await sleep(RETRY_BASE_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError;
}

export function pcmToWav(pcm: Buffer, sampleRate: number, channels = 1): Buffer {
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}
