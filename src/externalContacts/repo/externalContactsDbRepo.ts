import {
  DexieExternalContactsDb,
  externalContactsDb,
} from "../db/externalContactsDb";
import { DbContact } from "../model/dbContact";
import { ExternalContactsDbRepoImpl } from "./externalContactsDbRepoImpl";

export type ContactsImportStatus = {
  lastRetrievedApiTotal: number;
  contactsCount: number;
  nextOffset: number;
  insertionErrors: number;
};

export interface ExternalContactsDbRepo {
  clearDb(): Promise<void>;
  addContacts(contacts: DbContact[]): Promise<void>;
  updateApiTotal(total: number): Promise<void>;
  updateNextOffset(offset: number): Promise<void>;
  getContactsImportStatus(): Promise<ContactsImportStatus>;
}

let _repo: ExternalContactsDbRepo | undefined = undefined;

export function createExternalContactsDbRepo(
  _db: DexieExternalContactsDb = externalContactsDb
): ExternalContactsDbRepo {
  if (!_repo) {
    _repo = new ExternalContactsDbRepoImpl(_db);
  }

  return _repo;
}
