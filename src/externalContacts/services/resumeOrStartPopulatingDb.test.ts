import { describe, expect, it } from "vitest";

import { faker } from "@faker-js/faker";
import { givenAMockExternalContactsApi } from "../api/externalContactsApi.mocks";
import { givenADbContact } from "../db/externalContactsDb.mocks";
import { givenAMockExternalContactsDbRepo } from "../repo/externalContactsDbRepo.mocks";
import { resumeOrStartPopulatingDb } from "./resumeOrStartPopulatingDb";

const setupSut = () => {
  const mockApi = givenAMockExternalContactsApi();
  const mockDbRepo = givenAMockExternalContactsDbRepo();

  return {
    mockDbRepo,
    mockApi,
    invokeSut: (pageSize: number = 100) =>
      resumeOrStartPopulatingDb({
        _dbRepo: mockDbRepo,
        _contactsApi: mockApi,
        _pageSize: pageSize,
      }),
  };
};

describe("resumeOrStartPopulatingDb", () => {
  it("should throw if api.getTotalContactsCount returns error", async () => {
    const { mockDbRepo, invokeSut, mockApi } = setupSut();

    mockApi.getTotalContactsCount.mockRejectedValueOnce(new Error("OMG!"));

    mockDbRepo.getContactsImportStatus.mockResolvedValueOnce({
      orgId: "an_org_id",
      lastRetrievedApiTotal: 10,
      contactsCount: 2,
      insertionErrors: 0,
      nextOffset: 0,
    });

    await expect(() => invokeSut()).rejects.toThrowError("OMG!");

    expect(mockDbRepo.getContactsImportStatus).not.toBeCalled();
    expect(mockDbRepo.clearDb).not.toBeCalled();
    expect(mockApi.getTotalContactsCount).toHaveBeenCalledOnce();
  });

  it("should succeed and do nothing if next offset is greater or equal than api total", async () => {
    const { mockDbRepo, mockApi, invokeSut } = setupSut();

    mockApi.getTotalContactsCount.mockResolvedValueOnce(10);
    mockDbRepo.getContactsImportStatus.mockResolvedValueOnce({
      orgId: mockApi.orgId,
      lastRetrievedApiTotal: 10,
      contactsCount: 10,
      insertionErrors: 0,
      nextOffset: 10,
    });

    await invokeSut();

    expect(mockApi.getTotalContactsCount).toHaveBeenCalledOnce();
    expect(mockDbRepo.getContactsImportStatus).toHaveBeenCalledOnce();
    expect(mockDbRepo.clearDb).not.toBeCalled();
  });

  it("should clear the db and update its stored total if api returns a different total than the db", async () => {
    const { mockDbRepo, mockApi, invokeSut } = setupSut();

    mockDbRepo.getContactsImportStatus.mockResolvedValue({
      orgId: mockApi.orgId,
      lastRetrievedApiTotal: 10,
      contactsCount: 0,
      insertionErrors: 0,
      nextOffset: 0,
    });
    mockApi.getTotalContactsCount.mockResolvedValueOnce(0);

    await invokeSut();

    expect(mockApi.getTotalContactsCount).toHaveBeenCalledOnce();
    expect(mockDbRepo.getContactsImportStatus).toHaveBeenCalledOnce();
    expect(mockDbRepo.clearDb).toHaveBeenCalledOnce();
    expect(mockDbRepo.updateApiTotal).toHaveBeenCalledOnce();
    expect(mockDbRepo.updateApiTotal).toBeCalledWith(0);
  });

  it("should clear the db if orgId is different", async () => {
    const { mockDbRepo, mockApi, invokeSut } = setupSut();

    mockDbRepo.getContactsImportStatus.mockResolvedValue({
      orgId: mockApi.orgId + "_NOPE",
      lastRetrievedApiTotal: 0,
      contactsCount: 0,
      insertionErrors: 0,
      nextOffset: 0,
    });
    mockApi.getTotalContactsCount.mockResolvedValueOnce(0);

    await invokeSut();

    expect(mockApi.getTotalContactsCount).toHaveBeenCalledOnce();
    expect(mockDbRepo.getContactsImportStatus).toHaveBeenCalledOnce();
    expect(mockDbRepo.clearDb).toHaveBeenCalledOnce();
    expect(mockDbRepo.updateOrgId).toHaveBeenCalledOnce();
    expect(mockDbRepo.updateOrgId).toBeCalledWith(mockApi.orgId);
  });

  it("should throw if fetching external contacts returns error", async () => {
    const { mockDbRepo, invokeSut, mockApi } = setupSut();

    mockApi.getTotalContactsCount.mockResolvedValueOnce(15);
    mockDbRepo.getContactsImportStatus.mockResolvedValueOnce({
      orgId: mockApi.orgId,
      lastRetrievedApiTotal: 15,
      contactsCount: 2,
      insertionErrors: 0,
      nextOffset: 7,
    });
    mockApi.getExternalContacts.mockRejectedValueOnce(new Error("OMG!"));

    await expect(() => invokeSut()).rejects.toThrowError("OMG!");

    expect(mockDbRepo.getContactsImportStatus).toHaveBeenCalledOnce();
    expect(mockDbRepo.clearDb).not.toBeCalled();
    expect(mockApi.getExternalContacts).toHaveBeenCalledOnce();
    expect(mockApi.getExternalContacts).toHaveBeenCalledWith({
      limit: 100,
      start: 7,
    });
  });

  it("should keep on fetching contacts and adding to the db until total is reached", async () => {
    const { mockDbRepo, mockApi, invokeSut } = setupSut();

    const givenAContactsResultSet = () =>
      faker.helpers.multiple(givenADbContact, { count: 4 });

    const contactResultSets = [
      givenAContactsResultSet(),
      givenAContactsResultSet(),
      givenAContactsResultSet(),
    ];

    mockApi.getTotalContactsCount.mockResolvedValue(10);
    let getExternalContactsCounter = -1;
    mockApi.getExternalContacts.mockImplementation(async () => {
      getExternalContactsCounter++;
      return {
        contacts: contactResultSets[getExternalContactsCounter],
        total: 10,
        limit: 4,
        start: getExternalContactsCounter * 4,
      };
    });

    let getContactsImportStatusCounter = -1;
    mockDbRepo.getContactsImportStatus.mockImplementation(async () => {
      getContactsImportStatusCounter++;
      return {
        orgId: mockApi.orgId,
        lastRetrievedApiTotal: 10,
        contactsCount: Math.min(getContactsImportStatusCounter * 4, 10),
        insertionErrors: 0,
        nextOffset: getContactsImportStatusCounter * 4,
      };
    });

    await invokeSut(4);

    expect(mockApi.getExternalContacts).toHaveBeenCalledTimes(3);
    expect(mockApi.getExternalContacts).toHaveBeenNthCalledWith(1, {
      limit: 4,
      start: 0,
    });
    expect(mockApi.getExternalContacts).toHaveBeenNthCalledWith(2, {
      limit: 4,
      start: 4,
    });
    expect(mockApi.getExternalContacts).toHaveBeenNthCalledWith(3, {
      limit: 4,
      start: 8,
    });

    expect(mockDbRepo.getContactsImportStatus).toHaveBeenCalledTimes(3 + 1);
    expect(mockApi.getTotalContactsCount).toHaveBeenCalledTimes(1);

    expect(mockDbRepo.clearDb).not.toBeCalled();

    expect(mockDbRepo.addContacts).toHaveBeenCalledTimes(3);
    expect(mockDbRepo.addContacts).toHaveBeenNthCalledWith(
      1,
      contactResultSets[0]
    );
    expect(mockDbRepo.addContacts).toHaveBeenNthCalledWith(
      2,
      contactResultSets[1]
    );
    expect(mockDbRepo.addContacts).toHaveBeenNthCalledWith(
      3,
      contactResultSets[2]
    );
  });
});
