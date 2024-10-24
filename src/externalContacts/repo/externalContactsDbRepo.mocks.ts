import { vi } from "vitest";
import { ExternalContactsDbRepo } from "./externalContactsDbRepo";

export function givenAMockExternalContactsDbRepo() {
  return {
    clearDb: vi.fn<ExternalContactsDbRepo["clearDb"]>().mockName("clearDb"),
    getImportStatus: vi
      .fn<ExternalContactsDbRepo["getImportStatus"]>()
      .mockName("getImportStatus")
      .mockRejectedValue("getImportStatus: Not implemented"),
    addContacts: vi
      .fn<ExternalContactsDbRepo["addContacts"]>()
      .mockName("addContacts"),
    queryContacts: vi
      .fn<ExternalContactsDbRepo["queryContacts"]>()
      .mockName("queryContacts"),
    updateNextOffset: vi
      .fn<ExternalContactsDbRepo["updateNextOffset"]>()
      .mockName("updateNextOffset"),
  } satisfies ExternalContactsDbRepo;
}
