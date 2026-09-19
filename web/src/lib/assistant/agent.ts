import { GoogleGenAI, Content, Part, GenerateContentResponse, GenerateContentParameters, ThinkingLevel, createPartFromFunctionResponse } from "@google/genai";
import { buildGeminiHttpOptions } from "@portfolio/core/src/providers/gemini-request-options";
import { ASSISTANT_FUNCTION_DECLARATIONS, dispatchAssistantTool } from "./tools";
import { buildSystemInstruction } from "./system-instruction";
import { resolveModelChain } from "./model-chain";
import { generateContentWithFallback, GenerateContentWithFallbackDeps } from "./generate-content-with-fallback";
import type { Deadline } from "./deadline";

const MAX_TOOL_ROUNDS = 3;
const MAX_OUTPUT_TOKENS = 2048;
const TEMPERATURE = 0.3;
const THINKING_LEVEL = ThinkingLevel.LOW;
const RETRY_THINKING_LEVEL = ThinkingLevel.MINIMAL;

const GENERATION_BUDGET = {
  attempts: 3,
  perAttemptTimeoutMs: 11_000,
  initialDelaySeconds: 0.4,
  maxDelaySeconds: 2,
};

const FALLBACK_MESSAGE = {
  pt: "Não consegui encontrar uma resposta fundamentada para essa pergunta agora. Tente reformular ou pergunte sobre a trajetória ou os projetos do Lucas.",
  en: "I couldn't find a well-grounded answer for that right now. Try rephrasing, or ask about Lucas's background or projects.",
};

export interface AssistantHistoryMessage {
  role: "user" | "model";
  content: string;
}

export interface RunAssistantOptions {
  apiKey: string;
  message: string;
  history: AssistantHistoryMessage[];
  locale: "pt" | "en";
  deadline: Deadline;
  phaseContext?: string;
}

function wrapPhaseContext(phaseContext: string): string {
  return `<fase_atual>\n${phaseContext.replaceAll("</fase_atual>", "")}\n</fase_atual>`;
}

function toInitialContents(history: AssistantHistoryMessage[], message: string, phaseContext?: string): Content[] {
  const contents: Content[] = history.map((entry) => ({ role: entry.role, parts: [{ text: entry.content }] }));
  const messageParts: Part[] = phaseContext
    ? [{ text: wrapPhaseContext(phaseContext) }, { text: message }]
    : [{ text: message }];
  contents.push({ role: "user", parts: messageParts });
  return contents;
}

function logGenerationMetric(round: string, response: GenerateContentResponse): void {
  const model = response.modelVersion;
  const finishReason = response.candidates?.[0]?.finishReason;
  const thoughtsTokenCount = response.usageMetadata?.thoughtsTokenCount;
  const candidatesTokenCount = response.usageMetadata?.candidatesTokenCount;
  console.log(
    `[assistant][generation] round=${round} model=${model} finishReason=${finishReason} thoughtsTokenCount=${thoughtsTokenCount} candidatesTokenCount=${candidatesTokenCount}`,
  );
}

function isTruncatedEmpty(response: GenerateContentResponse): boolean {
  const finishReason = response.candidates?.[0]?.finishReason;
  return finishReason === "MAX_TOKENS" && !response.text?.trim();
}

async function generateWithThinkingRetry(
  fallbackDeps: GenerateContentWithFallbackDeps,
  params: Omit<GenerateContentParameters, "model">,
  round: string,
): Promise<GenerateContentResponse> {
  const response = await generateContentWithFallback(fallbackDeps, params);
  logGenerationMetric(round, response);

  if (!isTruncatedEmpty(response)) return response;

  const retryParams = {
    ...params,
    config: { ...params.config, thinkingConfig: { thinkingLevel: RETRY_THINKING_LEVEL } },
  };
  const retryResponse = await generateContentWithFallback(fallbackDeps, retryParams);
  logGenerationMetric(`${round}-retry`, retryResponse);
  return retryResponse;
}

export interface RunAssistantResult {
  text: string;
  toolCallRounds: number;
  grounded: boolean;
}

export async function runAssistant(options: RunAssistantOptions): Promise<RunAssistantResult> {
  const ai = new GoogleGenAI({ apiKey: options.apiKey, httpOptions: buildGeminiHttpOptions(GENERATION_BUDGET) });
  const contents = toInitialContents(options.history, options.message, options.phaseContext);
  const systemInstruction = buildSystemInstruction(options.locale);
  const fallbackDeps = { ai, models: resolveModelChain(), remainingMs: options.deadline.remainingMs };

  const baseConfig = {
    systemInstruction,
    temperature: TEMPERATURE,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    thinkingConfig: { thinkingLevel: THINKING_LEVEL },
    abortSignal: options.deadline.signal,
  };

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const response = await generateWithThinkingRetry(
      fallbackDeps,
      {
        contents,
        config: { ...baseConfig, tools: [{ functionDeclarations: ASSISTANT_FUNCTION_DECLARATIONS }] },
      },
      String(round),
    );

    const functionCalls = response.functionCalls ?? [];
    if (functionCalls.length === 0) {
      const text = response.text?.trim();
      return { text: text || FALLBACK_MESSAGE[options.locale], toolCallRounds: round, grounded: Boolean(text) };
    }

    const modelParts: Part[] = response.candidates?.[0]?.content?.parts ?? functionCalls.map((call) => ({ functionCall: call }));
    contents.push({ role: "model", parts: modelParts });

    const functionResponseParts: Part[] = [];
    for (const call of functionCalls) {
      const name = call.name ?? "";
      const args = (call.args ?? {}) as Record<string, unknown>;
      const result = await dispatchAssistantTool(name, args, options.locale, options.deadline.signal);
      functionResponseParts.push(createPartFromFunctionResponse(call.id ?? name, name, result));
    }
    contents.push({ role: "user", parts: functionResponseParts });
  }

  const finalResponse = await generateWithThinkingRetry(fallbackDeps, { contents, config: baseConfig }, "final");
  const finalText = finalResponse.text?.trim();

  return {
    text: finalText || FALLBACK_MESSAGE[options.locale],
    toolCallRounds: MAX_TOOL_ROUNDS,
    grounded: Boolean(finalText),
  };
}
