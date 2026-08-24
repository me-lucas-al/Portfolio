import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock the Web Audio API Context
class AudioContextMock {
  destination = {};
  state = "suspended";
  createAnalyser = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    fftSize: 2048,
  }));
  createBuffer = vi.fn((channels, length, sampleRate) => ({
    length,
    duration: length / sampleRate,
    sampleRate,
    numberOfChannels: channels,
    getChannelData: vi.fn(() => new Float32Array(length)),
  }));
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }));
  decodeAudioData = vi.fn((data, success, error) => {
    const buffer = this.createBuffer(1, 1, 24000);
    if (success) success(buffer);
    return Promise.resolve(buffer);
  });
  resume = vi.fn(() => Promise.resolve());
  close = vi.fn(() => Promise.resolve());
}

global.AudioContext = AudioContextMock as any;
global.window.AudioContext = AudioContextMock as any;
