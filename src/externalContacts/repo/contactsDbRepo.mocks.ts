import { vi } from "vitest";
import { ExternalContactsDbRepo } from "./contactsDbRepo";

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
    updateApiTotal: vi
      .fn<ExternalContactsDbRepo["updateApiTotal"]>()
      .mockName("updateTotal"),
    updateNextOffset: vi
      .fn<ExternalContactsDbRepo["updateNextOffset"]>()
      .mockName("updateNextOffset"),
  } satisfies ExternalContactsDbRepo;
}
