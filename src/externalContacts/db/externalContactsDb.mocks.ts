import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { ExternalContactsDbContact } from "./externalContactsDb.types";

export function givenADbContact(): ExternalContactsDbContact {
  return {
    id: faker.string.uuid(),
    displayName: faker.person.fullName(),
    phoneNumbers: faker.helpers.multiple(
      () =>
        `${faker.phone.number({ style: "national" })};${faker.helpers.arrayElement(["work", "mobile", "other"])}`,
      { count: { min: 1, max: 3 } }
    ),
    companyName: faker.company.name(),
    familyName: faker.helpers.maybe(() => faker.person.lastName()),
    givenName: faker.helpers.maybe(() => faker.person.firstName()),
  };
}

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
