// Only bounds work that actually listens to `signal`: the Gemini SDK calls
// (generation, embeddings) do. Prisma/pgvector queries in the knowledge and
// rate-limit repositories don't accept an AbortSignal and aren't cancelled by
// this - a slow/hung database is only ever cut off by the route's own
// `maxDuration`, not by this deadline.
export interface Deadline {
  signal: AbortSignal;
  remainingMs(): number;
}

export function createDeadline(totalBudgetMs: number, callerSignal?: AbortSignal): Deadline {
  const deadlineAt = Date.now() + totalBudgetMs;
  const timeoutSignal = AbortSignal.timeout(totalBudgetMs);
  const signal = callerSignal ? AbortSignal.any([timeoutSignal, callerSignal]) : timeoutSignal;

  return {
    signal,
    remainingMs: () => Math.max(0, deadlineAt - Date.now()),
  };
}
