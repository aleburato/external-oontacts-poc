// db.ts
import Dexie from "dexie";
import { ExternalContactsDb } from "./externalContactsDb.types";

export const externalContactsDb = new Dexie(
  "ExternalContactsDatabase"
) as ExternalContactsDb;

// Schema declaration:
externalContactsDb.version(1).stores({
  contacts:
    "id, displayName, companyName, givenName, familyName, *phoneNumbers", // primary key "id" (for the runtime!)
  meta: "", // this will actually have only one row
});
