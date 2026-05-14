import { randomUUID } from "crypto";
export function newRequestId(): string { return randomUUID(); }

import { logger } from "./logger";
interface RetryOpts { maxAttempts?: number; baseDelayMs?: number; factor?: number; maxDelayMs?: number; label?: string; }
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOpts = {}): Promise<T> {
  const { maxAttempts=3, baseDelayMs=500, factor=2, maxDelayMs=8000, label="op" } = opts;
  let lastErr: unknown;
  for (let i = 1; i <= maxAttempts; i++) {
    try { return await fn(); } catch (err) {
      lastErr = err;
      if (i === maxAttempts) break;
      const base = Math.min(baseDelayMs * factor**(i-1), maxDelayMs);
      const delay = Math.max(0, Math.round(base + base*(Math.random()*.5-.25)));
      logger.warn({ label, attempt: i, delay }, `${label} retrying`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
