"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAssistantChat } from "@/modules/portfolio/assistant/use-assistant-chat";
import { AssistantMessage } from "@/modules/portfolio/assistant/assistant-message";
import { useSpeechPlayback } from "./use-speech-playback";
import { Send, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Dictionary, Locale } from "@/i18n";

const AvatarCanvas = dynamic(() => import("./avatar-canvas"), { ssr: false });

export function AvatarView({ dict, locale }: { dict: Dictionary["assistant"]; locale: Locale }) {
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    canRetry,
    bottomRef,
    handleSend,
    handleRetry,
    handleKeyDown,
    clearChat
  } = useAssistantChat(dict, locale);

  const { playText, stopPlaying, currentEmotion, analyserNode } = useSpeechPlayback();

  // Play audio when a new message from the model arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "model") {
      playText(lastMessage.content);
    }
  }, [messages, playText]);

  // Stop audio if page unmounts
  useEffect(() => {
    return () => {
      stopPlaying();
    };
  }, [stopPlaying]);

  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden bg-neutral-950">
      {/* 3D Canvas Background or Left Panel */}
      <div className="relative flex-1 h-1/2 md:h-full">
        <AvatarCanvas analyserNode={analyserNode} emotion={currentEmotion} />
      </div>

      {/* Chat UI overlay on right */}
      <div className="relative flex flex-col w-full md:w-[420px] h-1/2 md:h-full border-t md:border-l border-neutral-800 bg-neutral-950/80 backdrop-blur-md z-10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-900 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{dict.title} (Avatar)</p>
            <p className="text-xs text-neutral-500">{dict.subtitle}</p>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear chat"
                className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col min-h-0 p-4">
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="flex flex-col gap-3 py-2">
              {messages.length === 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {dict.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void handleSend(suggestion)}
                      className="text-left text-sm px-3 py-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message) => (
                <AssistantMessage key={message.id} role={message.role} content={message.content} />
              ))}

              {loading && (
                <div className="flex flex-col gap-2 max-w-[85%] text-sm text-neutral-400">
                  Pensando...
                </div>
              )}

              {error && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-red-400">{error}</p>
                  {canRetry && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="self-start text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      {dict.retry}
                    </button>
                  )}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="pt-3 border-t border-neutral-900 flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={dict.placeholder}
                maxLength={600}
                className="min-h-10 max-h-32 resize-none bg-neutral-900/60 border-neutral-800 text-sm text-white placeholder:text-neutral-600"
              />
              <Button
                size="icon"
                onClick={() => void handleSend()}
                disabled={loading || !input.trim()}
                aria-label={dict.send}
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="text-[11px] text-neutral-600">{dict.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
