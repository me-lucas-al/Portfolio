import { useRef, useCallback, useState, useEffect } from "react";
import { splitSentences } from "./split-sentences";

let activeStopFunction: (() => void) | null = null;

export function useSpeechPlayback() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(ctx.destination);
      analyserNodeRef.current = analyser;
      
      nextStartTimeRef.current = ctx.currentTime;
    }
  }, []);

  const stopPlaying = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (activeStopFunction === stopPlaying) {
      activeStopFunction = null;
    }
    
    // Para limpar a playhead atual, podemos simplesmente fechar o contexto e recriar
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        nextStartTimeRef.current = 0;
      }).catch(console.error);
    }
  }, []);

  const playText = useCallback(async (text: string) => {
    if (activeStopFunction && activeStopFunction !== stopPlaying) {
      activeStopFunction();
    }
    activeStopFunction = stopPlaying;

    initAudio();
    const ctx = audioContextRef.current!;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const sentences = splitSentences(text);
    setIsPlaying(true);
    isPlayingRef.current = true;

    for (const sentence of sentences) {
      if (!isPlayingRef.current) break; // Parou

      try {
        const response = await fetch("/api/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: sentence }),
        });

        if (!isPlayingRef.current) break; // Check if stopped during fetch

        if (!response.ok) {
          console.error("Speech request failed", response.status);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!isPlayingRef.current) break; // Check if stopped during buffer read

        const int16Array = new Int16Array(arrayBuffer);
        const float32Array = new Float32Array(int16Array.length);

        for (let i = 0; i < int16Array.length; i++) {
          let sample = int16Array[i];
          float32Array[i] = sample < 0 ? sample / 32768 : sample / 32767;
        }

        const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
        audioBuffer.copyToChannel(float32Array, 0);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyserNodeRef.current!);

        if (nextStartTimeRef.current < ctx.currentTime) {
          nextStartTimeRef.current = ctx.currentTime;
        }

        source.start(nextStartTimeRef.current);
        
        // Se quisermos poder parar a frase atual no meio, precisamos armazenar o `source`
        // Mas por simplicidade de agendamento:
        nextStartTimeRef.current += audioBuffer.duration;
      } catch (err) {
        console.error("Failed to fetch/play speech", err);
      }
    }

    // Monitora quando termina de tocar a última frase
    const checkEnd = setInterval(() => {
      if (ctx.currentTime >= nextStartTimeRef.current) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        clearInterval(checkEnd);
      }
    }, 100);

  }, [initAudio, stopPlaying]);

  return { playText, stopPlaying, isPlaying, analyserNode: analyserNodeRef.current };
}
