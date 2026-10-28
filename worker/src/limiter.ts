export interface Env {
  MESSAGES: KVNamespace;
  DEEPSEEK_API_KEY: string;
  ADMIN_TOKEN: string;
  CHAT_DAILY_LIMIT?: string;
  MESSAGE_DAILY_LIMIT?: string;
  MAX_TOKENS?: string;
}

interface Bucket {
  day: string;
  used: number;
}

const buckets = new Map<string, Bucket>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function consume(key: string, limit: number): boolean {
  const day = today();
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) {
      if (b.day !== day) buckets.delete(k);
    }
  }
  let bucket = buckets.get(key);
  if (!bucket || bucket.day !== day) {
    bucket = { day, used: 0 };
    buckets.set(key, bucket);
  }
  if (bucket.used >= limit) return false;
  bucket.used += 1;
  return true;
}

export function remaining(key: string, limit: number): number {
  const bucket = buckets.get(key);
  if (!bucket || bucket.day !== today()) return limit;
  return Math.max(0, limit - bucket.used);
}
