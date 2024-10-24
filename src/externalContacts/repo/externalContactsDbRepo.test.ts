/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { afterEach, describe, expect, it, vitest } from "vitest";
import {
  givenADbContact,
  givenAnExternalContactDb,
} from "../db/externalContactsDb.mocks";
import {
  ContactsImportStatus,
  createExternalContactsDbRepo,
  ExternalContactsDbRepo,
} from "./externalContactsDbRepo";
import { ExternalContactsDbRepoImpl } from "./externalContactsDbRepoImpl";

afterEach(() => {
  vitest.useRealTimers();
});

describe("factory", () => {
  it("creates the repo object only once", () => {
    const repo1 = createExternalContactsDbRepo({} as never);
    const repo2 = createExternalContactsDbRepo({} as never);

    expect(repo1).toBe(repo2);
  });
});

describe("implementation", () => {
  it("clearDb clears the `contacts` table and resets the metadata", async () => {
    vitest.useFakeTimers();
    const mockDb = givenAnExternalContactDb();
    const repo: ExternalContactsDbRepo = new ExternalContactsDbRepoImpl(
      mockDb as any
    );

    await repo.clearDb({ lastRetrievedApiTotal: 111, orgId: "myOrgId" });
    expect(mockDb.contacts.clear).toHaveBeenCalledOnce();
    expect(mockDb.meta.put).toHaveBeenCalledOnce();
    expect(mockDb.meta.put).toHaveBeenCalledWith(
      {
        orgId: "myOrgId",
        lastRetrievedApiTotal: 111,
        nextContactOffset: 0,
        failedContactInsertionAttempts: 0,
        timestamp: new Date().toISOString(),
      },
      "lastMeta"
    );
  });

  it("updateNextOffset updates the metadata", async () => {
    const mockDb = givenAnExternalContactDb();
    const repo = new ExternalContactsDbRepoImpl(mockDb as any);

    const testValue = faker.number.int();
    await repo.updateNextOffset(testValue);
    expect(mockDb.meta.update).toHaveBeenCalledOnce();
    expect(mockDb.meta.update).toHaveBeenCalledWith("lastMeta", {
      nextContactOffset: testValue,
    });
  });

  it("getImportStatus initiates a transaction with the proper parameters", async () => {
    const mockDb = givenAnExternalContactDb();
    const repo = new ExternalContactsDbRepoImpl(mockDb as any);
    mockDb.contacts.count.mockReturnValueOnce(84);
    mockDb.meta.get.mockResolvedValueOnce({
      orgId: "foffo",
      lastRetrievedApiTotal: 199,
      nextContactOffset: 88,
      failedContactInsertionAttempts: 4,
      timestamp: new Date().toISOString(),
    });

    const result = await repo.getImportStatus();
    expect(mockDb.transaction).toHaveBeenCalledOnce();
    expect(mockDb.transaction).toHaveBeenCalledWith(
      "r",
      [mockDb.contacts, mockDb.meta],
      expect.anything()
    );
    expect(mockDb.meta.get).toHaveBeenCalledOnce();
    expect(mockDb.meta.get).toHaveBeenCalledWith("lastMeta");
    expect(result).toEqual<ContactsImportStatus>({
      orgId: "foffo",
      contactsCount: 84,
      insertionErrors: 4,
      lastRetrievedApiTotal: 199,
      nextOffset: 88,
    });
  });

  it("addContacts initiates a transaction with the proper parameters", async () => {
    const mockDb = givenAnExternalContactDb();
    const repo = new ExternalContactsDbRepoImpl(mockDb as any);

    const contactsToAdd = faker.helpers.multiple(givenADbContact);
    await repo.addContacts(contactsToAdd);
    expect(mockDb.transaction).toHaveBeenCalledOnce();
    expect(mockDb.transaction).toHaveBeenCalledWith(
      "rw",
      [mockDb.contacts, mockDb.meta],
      expect.anything()
    );
    expect(mockDb.contacts.bulkAdd).toHaveBeenCalledOnce();
    expect(mockDb.contacts.bulkAdd).toHaveBeenCalledWith(contactsToAdd);
  });

  it("addContacts updates meta in case of BulkError", async () => {
    const mockDb = givenAnExternalContactDb();
    mockDb.contacts.bulkAdd.mockRejectedValueOnce({
      name: "BulkError",
      failures: { length: 5, forEach: () => {} },
    });
    mockDb.meta.get.mockResolvedValueOnce({
      lastRetrievedApiTotal: 199,
      nextContactOffset: 88,
      failedContactInsertionAttempts: 7,
      timestamp: new Date().toISOString(),
    });

    const repo = new ExternalContactsDbRepoImpl(mockDb as any);

    const contactsToAdd = faker.helpers.multiple(givenADbContact);
    await repo.addContacts(contactsToAdd);
    expect(mockDb.contacts.bulkAdd).toHaveBeenCalledOnce();
    expect(mockDb.contacts.bulkAdd).toHaveBeenCalledWith(contactsToAdd);
    expect(mockDb.meta.get).toHaveBeenCalledOnce();
    expect(mockDb.meta.update).toHaveBeenCalledOnce();
    expect(mockDb.meta.update).toHaveBeenCalledWith("lastMeta", {
      failedContactInsertionAttempts: 7 + 5,
    });
  });
});
