import { createHash } from "node:crypto";
import { makeSpeechCacheService } from "@portfolio/core/src/factories/_index";
import { getStorageProvider } from "@/factories/storage-factory";
import { synthesizeSpeech, pcmToWav, resolveModel, resolveVoice } from "@/lib/assistant/tts-provider";

export function computeSpeechCacheHash(text: string, voice: string, model: string): string {
  const normalized = text.trim();
  return createHash("sha256").update(`${normalized}|${voice}|${model}`).digest("hex");
}

export interface SpeechCacheHit {
  audioUrl: string;
}

export async function findCachedSpeech(text: string): Promise<SpeechCacheHit | null> {
  const hash = computeSpeechCacheHash(text, resolveVoice(), resolveModel());
  const entry = await makeSpeechCacheService().findByHash(hash);
  return entry ? { audioUrl: entry.audioUrl } : null;
}

export interface SynthesizeAndCacheResult {
  wav: Buffer;
  audioUrl: string;
}

export async function synthesizeAndCacheSpeech(apiKey: string, text: string, signal: AbortSignal): Promise<SynthesizeAndCacheResult> {
  const voice = resolveVoice();
  const model = resolveModel();
  const hash = computeSpeechCacheHash(text, voice, model);

  const { pcm, sampleRate } = await synthesizeSpeech(apiKey, text, signal);
  const wav = pcmToWav(pcm, sampleRate, 1);

  const storage = getStorageProvider();
  const audioUrl = await storage.uploadRaw(wav, hash, "portfolio/speech");

  await makeSpeechCacheService().save({
    textHash: hash,
    audioUrl,
    voice,
    model,
    byteLength: wav.length,
  });

  return { wav, audioUrl };
}
