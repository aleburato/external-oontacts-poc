// db.ts
import Dexie, { type Table } from "dexie";
import { DbContact } from "../model/dbContact";

export type ContactsDbMeta = {
  lastRetrievedApiTotal: number;
  failedContactInsertionAttempts: number;
  nextContactOffset: number;
  timestamp: string;
};

export type DexieExternalContactsDb = Dexie & {
  contacts: Table<DbContact, "id">;
  meta: Table<ContactsDbMeta, "lastMeta">;
};

export const externalContactsDb = new Dexie(
  "ExternalContactsDatabase"
) as DexieExternalContactsDb;

// Schema declaration:
externalContactsDb.version(1).stores({
  contacts:
    "id, displayName, companyName, givenName, familyName, *phoneNumbers", // primary key "id" (for the runtime!)
  meta: "", // this will actually have only one row
});
