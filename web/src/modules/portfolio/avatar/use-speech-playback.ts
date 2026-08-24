import { useRef, useCallback, useState, useEffect } from "react";
import { splitSentences } from "./split-sentences";
import { detectTone } from "./detect-tone";

let activeStopFunction: (() => void) | null = null;

export function useSpeechPlayback() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<"neutral" | "happy" | "sad" | "surprised" | "relaxed">("neutral");
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
    setCurrentEmotion("neutral");
    if (activeStopFunction === stopPlaying) {
      activeStopFunction = null;
    }
    
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
    setCurrentEmotion("neutral");

    for (const sentence of sentences) {
      if (!isPlayingRef.current) break;

      const { emotion, styleTag } = detectTone(sentence);
      setCurrentEmotion(emotion);

      try {
        const body = { 
          text: sentence,
          styleTags: styleTag ? [styleTag] : undefined
        };
        
        const response = await fetch("/api/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!isPlayingRef.current) break;

        if (!response.ok) {
          console.error("Speech request failed", response.status);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!isPlayingRef.current) break;

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
        
        // Wait until this sentence is mostly done before fetching next
        // For prefetching we could overlap fetches, but let's keep it simple and wait for current to finish
        // To overlap fetches, we should resolve promises but this sequentially awaits fetch and playback
        // Let's at least play sequentially
        nextStartTimeRef.current += audioBuffer.duration;
        
        const durationMs = audioBuffer.duration * 1000;
        await new Promise(r => setTimeout(r, durationMs - 500)); // slight overlap / prefetch buffer
        
      } catch (err) {
        console.error("Failed to fetch/play speech", err);
      }
    }

    const checkEnd = setInterval(() => {
      if (!isPlayingRef.current || ctx.state === "closed" || ctx.currentTime >= nextStartTimeRef.current) {
        if (isPlayingRef.current) {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setCurrentEmotion("neutral");
        }
        clearInterval(checkEnd);
      }
    }, 100);

  }, [initAudio, stopPlaying]);

  return { playText, stopPlaying, isPlaying, analyserNode: analyserNodeRef.current, currentEmotion };
}
