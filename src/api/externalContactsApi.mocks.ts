import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { ExternalContactsApi } from "./externalContactsApi";
import { SearchExternalContactsResultDTO } from "./externalContactsApi.dto";

export function givenAMockExternalContactsApi() {
  return {
    getTotalContactsCount: vi
      .fn<ExternalContactsApi["getTotalContactsCount"]>()
      .mockName("getTotalContactsCount")
      .mockRejectedValue("getTotalContactsCount: Not implemented"),
    getExternalContacts: vi
      .fn<ExternalContactsApi["getExternalContacts"]>()
      .mockName("getExternalContacts")
      .mockRejectedValue("getExternalContacts: Not implemented"),
  } satisfies ExternalContactsApi;
}

export function givenAMockSearchExternalContactsResultDTO(
  override: Partial<SearchExternalContactsResultDTO> = {}
): SearchExternalContactsResultDTO {
  return {
    limit: faker.number.int({ min: 100, max: 10000 }),
    result: [],
    start: faker.number.int({ min: 0, max: 99 }),
    total: faker.number.int({ min: 100, max: 200000 }),
    ...override,
  };
}
