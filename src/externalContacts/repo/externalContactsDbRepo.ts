import { externalContactsDb } from "../db/externalContactsDb";
import {
  ExternalContactsDb,
  ExternalContactsDbContact,
} from "../db/externalContactsDb.types";
import { ExternalContactsDbRepoImpl } from "./externalContactsDbRepoImpl";

export type ContactsImportStatus = {
  orgId: string;
  lastRetrievedApiTotal: number;
  contactsCount: number;
  nextOffset: number;
  insertionErrors: number;
};

export type QueryContactsParams = {
  search: string;
  start: number;
  limit: number;
};

export type QueryContactsResult = {
  contacts: ExternalContactsDbContact[];
  totalContacts: number;
};

export interface ExternalContactsDbRepo {
  clearDb(): Promise<void>;
  queryContacts(params: QueryContactsParams): Promise<QueryContactsResult>;
  addContacts(contacts: ExternalContactsDbContact[]): Promise<void>;
  updateApiTotal(total: number): Promise<void>;
  updateNextOffset(offset: number): Promise<void>;
  updateOrgId(orgId: string): Promise<void>;
  getContactsImportStatus(): Promise<ContactsImportStatus>;
}

let _repo: ExternalContactsDbRepo | undefined = undefined;

export function createExternalContactsDbRepo(
  _db: ExternalContactsDb = externalContactsDb
): ExternalContactsDbRepo {
  if (!_repo) {
    _repo = new ExternalContactsDbRepoImpl(_db);
  }

  return _repo;
}
