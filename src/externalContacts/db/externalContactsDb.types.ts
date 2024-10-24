import Dexie, { type Table } from "dexie";

export type ExternalContactsDbContact = {
  id: string;
  displayName: string;
  phoneNumbers: string[]; // FORMAT: "number;type"
  givenName?: string;
  familyName?: string;
  companyName?: string;
};

export type ExternalContactsDbMeta = {
  orgId: string;
  lastRetrievedApiTotal: number;
  failedContactInsertionAttempts: number;
  nextContactOffset: number;
  timestamp: string;
};

export type ExternalContactsDb = Dexie & {
  contacts: Table<ExternalContactsDbContact, "id">;
  meta: Table<ExternalContactsDbMeta, "lastMeta">;
};
