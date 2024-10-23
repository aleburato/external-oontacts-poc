import { vi } from "vitest";

const originalFetch = global.fetch;

export function mockFetchWithResponse<T>(data: T) {
  const mockedFetch = vi
    .fn()
    .mockName("mockedFetch")
    .mockResolvedValue({ json: () => new Promise((resolve) => resolve(data)) });
  global.fetch = mockedFetch;
  return mockedFetch;
}

export function restoreOriginalFetch() {
  global.fetch = originalFetch;
}
