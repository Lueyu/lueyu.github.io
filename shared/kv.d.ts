declare const MESSAGES_KV: {
  get(key: string, options?: { type?: string }): Promise<unknown>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ complete: boolean; cursor: string | null; keys: { key: string }[] }>;
};
