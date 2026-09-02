"use client"

import { useEffect, useState } from "react"
import { AssistantDialogueBar } from "./assistant-dialogue-bar"
import { useAssistantChat } from "./use-assistant-chat"
import {
  AvatarStage,
  classifyTone,
  setAvatarOverlayState,
  setAvatarThinking,
  setAvatarTone,
  useSpeechPlayer,
  useTypingSpeech,
} from "@/modules/portfolio/avatar/contract"
import type { Dictionary, Locale } from "@/i18n"

interface AssistantWidgetProps {
  dict: Dictionary["assistant"]
  locale: Locale
}

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
  const { isSpeaking, isPreparingVoice, speak, stopSpeaking } = useSpeechPlayer()
  const { startTypingSpeech, stopTypingSpeech } = useTypingSpeech()
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    canRetry,
    handleSend,
    handleRetry,
    handleKeyDown,
    cancelPending,
    clearChat,
  } = useAssistantChat(dict, locale, {

    onModelMessage: (message, messageId) => {
      if (message.speech) speak(message.speech.url)
      setAvatarTone(classifyTone(message.text, locale))
      startTypingSpeech(messageId, message.text)
    },

    onBeforeSend: () => {
      stopSpeaking()
      stopTypingSpeech()
    },
  })

  useEffect(() => {
    if (!open) {
      cancelPending()
      stopSpeaking()
    }
  }, [open, cancelPending, stopSpeaking])

  useEffect(() => {
    setAvatarThinking(loading)
  }, [loading])

  useEffect(() => {
    if (error) setAvatarTone(classifyTone(error, locale))
  }, [error, locale])

  useEffect(() => {
    setAvatarOverlayState(open)
    return () => setAvatarOverlayState(false)
  }, [open])

  return (
    <>
      <AvatarStage dict={dict} open={open} onOpenChange={setOpen} />
      <AssistantDialogueBar
        dict={dict}
        open={open}
        onOpenChange={setOpen}
        clearChat={clearChat}
        isSpeaking={isSpeaking}
        isPreparingVoice={isPreparingVoice}
        onStopSpeaking={stopSpeaking}
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        error={error}
        canRetry={canRetry}
        handleSend={handleSend}
        handleRetry={handleRetry}
        handleKeyDown={handleKeyDown}
      />
    </>
  )
}
