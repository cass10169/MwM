import { AsyncLocalStorage } from "node:async_hooks";

export type RuntimeBindings = {
  DB?: D1Database;
  BUCKET?: R2Bucket;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
};

const registryKey = Symbol.for("memories-with-mike.runtime-bindings");
const registry = globalThis as unknown as { [registryKey]: AsyncLocalStorage<RuntimeBindings> | undefined };
const storage = registry[registryKey] ?? new AsyncLocalStorage<RuntimeBindings>();
registry[registryKey] = storage;

export function runWithRuntimeBindings<T>(bindings: RuntimeBindings, callback: () => T): T {
  return storage.run(bindings, callback);
}

export function runtimeBindings(): RuntimeBindings {
  return storage.getStore() ?? {};
}
