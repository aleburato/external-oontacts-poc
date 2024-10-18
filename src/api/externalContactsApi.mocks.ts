import { vi } from "vitest";
import { ExternalContactsApi } from "./externalContactsApi.types";

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
