import { renderHook, act } from "@testing-library/react";
import { useSpeechPlayback } from "./use-speech-playback";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("useSpeechPlayback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with isPlaying false", () => {
    const { result } = renderHook(() => useSpeechPlayback());
    expect(result.current.isPlaying).toBe(false);
  });

  it("should change isPlaying when playText is called", async () => {
    const { result } = renderHook(() => useSpeechPlayback());
    
    // Mock fetch for the API call
    global.fetch = vi.fn(() => 
      Promise.resolve({
        ok: true,
        body: {
          getReader: () => {
            let done = false;
            return {
              read: () => {
                if (!done) {
                  done = true;
                  return Promise.resolve({ done: false, value: new Uint8Array(10) });
                }
                return Promise.resolve({ done: true });
              }
            };
          }
        },
      } as any)
    );

    await act(async () => {
      // Don't await playText entirely because it streams
      result.current.playText("Hello");
    });
    
    // State should update to true
    expect(result.current.isPlaying).toBe(true);

    // Stop playback
    act(() => {
      result.current.stopPlaying();
    });

    expect(result.current.isPlaying).toBe(false);
  });
});
