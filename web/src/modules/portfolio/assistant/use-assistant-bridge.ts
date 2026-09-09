"use client"

import { useSyncExternalStore } from "react"
import { getAssistantBridgeSnapshot, subscribeAssistantBridge } from "./phase-context-state"

function getServerAssistantBridgeSnapshot() {
  return getAssistantBridgeSnapshot()
}

export function useAssistantBridge() {
  return useSyncExternalStore(subscribeAssistantBridge, getAssistantBridgeSnapshot, getServerAssistantBridgeSnapshot)
}
