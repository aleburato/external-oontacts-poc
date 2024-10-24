import { vi } from "vitest";
import { ExternalContactsDbRepo } from "./externalContactsDbRepo";

export function givenAMockExternalContactsDbRepo() {
  return {
    clearDb: vi.fn<ExternalContactsDbRepo["clearDb"]>().mockName("clearDb"),
    getContactsImportStatus: vi
      .fn<ExternalContactsDbRepo["getContactsImportStatus"]>()
      .mockName("getContactsImportStatus")
      .mockRejectedValue("getContactsImportStatus: Not implemented"),
    addContacts: vi
      .fn<ExternalContactsDbRepo["addContacts"]>()
      .mockName("addContacts"),
    queryContacts: vi
      .fn<ExternalContactsDbRepo["queryContacts"]>()
      .mockName("queryContacts"),
    updateApiTotal: vi
      .fn<ExternalContactsDbRepo["updateApiTotal"]>()
      .mockName("updateTotal"),
    updateNextOffset: vi
      .fn<ExternalContactsDbRepo["updateNextOffset"]>()
      .mockName("updateNextOffset"),
    updateOrgId: vi
      .fn<ExternalContactsDbRepo["updateOrgId"]>()
      .mockName("updateOrgId"),
  } satisfies ExternalContactsDbRepo;
}
