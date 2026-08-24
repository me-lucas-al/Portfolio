export interface SpeechSynthesizeOptions {
  voice: string;
  styleTags?: string[];
  signal?: AbortSignal;
}

export interface ISpeechProvider {
  /**
   * Sintetiza o texto em áudio PCM 16-bit 24kHz mono e retorna um stream.
   */
  synthesizeStreaming(text: string, options: SpeechSynthesizeOptions): AsyncIterable<Uint8Array>;
  
  /**
   * Sintetiza o texto em áudio PCM 16-bit 24kHz mono e retorna o buffer completo (não-streaming).
   */
  synthesize(text: string, options: SpeechSynthesizeOptions): Promise<Uint8Array>;
}
