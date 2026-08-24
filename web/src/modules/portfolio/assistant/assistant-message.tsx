"use client";
import { Volume2, Square } from "lucide-react";
import { useSpeechPlayback } from "../avatar/use-speech-playback";

interface AssistantMessageProps {
  role: "user" | "model"
  content: string
}

export function AssistantMessage({ role, content }: AssistantMessageProps) {
  const isUser = role === "user"
  const { playText, stopPlaying, isPlaying } = useSpeechPlayback()

  return (
    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-neutral-900/80 border border-neutral-800 text-neutral-200"
        }`}
      >
        {content}
      </div>
      {!isUser && (
        <button
          onClick={() => (isPlaying ? stopPlaying() : playText(content))}
          className="text-xs flex items-center gap-1 text-neutral-400 hover:text-white transition-colors px-2 py-1"
          title={isPlaying ? "Parar áudio" : "Ouvir"}
        >
          {isPlaying ? <Square size={14} /> : <Volume2 size={14} />}
          <span>{isPlaying ? "Parar" : "Ouvir"}</span>
        </button>
      )}
    </div>
  )
}
