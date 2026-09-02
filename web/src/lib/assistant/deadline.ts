
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
