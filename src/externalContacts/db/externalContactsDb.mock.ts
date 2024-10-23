import { vi } from "vitest";

export function givenAnExternalContactDb() {
  return {
    transaction: vi
      .fn()
      .mockName("transaction")
      .mockImplementation(
        async <U>(
          _mode: "r" | "rw",
          _tables: string[],
          fn: () => U | PromiseLike<U>
        ) => {
          return fn();
        }
      ),
    contacts: {
      bulkAdd: vi.fn().mockName("contacts.bulkAdd"),
      count: vi.fn().mockName("contacts.count"),
      clear: vi.fn().mockName("contacts.clear"),
    },
    meta: {
      get: vi.fn().mockName("meta.get"),
      put: vi.fn().mockName("meta.put"),
      update: vi.fn().mockName("meta.update"),
    },
  };
}
