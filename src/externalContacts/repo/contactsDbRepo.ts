import { BulkError } from "dexie";
import {
  DexieExternalContactsDb,
  externalContactsDb,
} from "../db/externalContactsDb";
import { DbContact } from "../model/dbContact";

let _repo: ExternalContactsDbRepo | undefined = undefined;

export interface ExternalContactsDbRepo {
  clearDb(): Promise<void>;
  addContacts(contacts: DbContact[]): Promise<void>;
  updateApiTotal(total: number): Promise<void>;
  updateNextOffset(offset: number): Promise<void>;
  getContactsImportStatus(): Promise<{
    lastRetrievedApiTotal: number;
    contactsCount: number;
    nextOffset: number;
    insertionErrors: number;
  }>;
}

export function createExternalContactsDbRepo(
  db: DexieExternalContactsDb = externalContactsDb
): ExternalContactsDbRepo {
  if (!_repo) {
    _repo = {
      clearDb: async () => {
        await db.contacts.clear();
        await db.meta.put(
          {
            lastRetrievedApiTotal: -1,
            nextContactOffset: 0,
            failedContactInsertionAttempts: 0,
            timestamp: new Date().toISOString(),
          },
          "lastMeta"
        );
      },
      getContactsImportStatus: async () =>
        await db.transaction("r", [db.contacts, db.meta], async () => {
          const dbMeta = await db.meta.get("lastMeta");

          return {
            lastRetrievedApiTotal: dbMeta?.lastRetrievedApiTotal ?? -1,
            contactsCount: await db.contacts.count(),
            nextOffset: dbMeta?.nextContactOffset ?? 0,
            insertionErrors: dbMeta?.failedContactInsertionAttempts ?? 0,
          };
        }),
      addContacts: async (contacts: DbContact[]) => {
        await db.transaction("rw", [db.contacts, db.meta], async () => {
          try {
            await db.contacts.bulkAdd(contacts);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error?.name === "BulkError") {
              const bulkError = error as BulkError;
              const currentFailedAttempts =
                (await db.meta.get("lastMeta"))
                  ?.failedContactInsertionAttempts || 0;
              await db.meta.update("lastMeta", {
                failedContactInsertionAttempts:
                  currentFailedAttempts + bulkError.failures?.length || 0,
              });
              logBulkError(bulkError);
            }
          }
        });
        console.log(">>> addContacts: transaction complete");
      },
      updateApiTotal: async (lastRetrievedApiTotal: number) => {
        await db.meta.update("lastMeta", {
          lastRetrievedApiTotal,
        });
      },
      updateNextOffset: async (offset: number) => {
        await db.meta.update("lastMeta", {
          nextContactOffset: offset,
        });
      },
    };
  }
  return _repo;
}

function logBulkError(err: BulkError) {
  console.error(err.failures?.length + " insertions failed!");
  err.failures?.forEach((failure) => {
    console.error(failure.message);
  });
  // If on dexie@>3.1.0-alpha.6:
  for (const [pos, error] of Object.entries(err.failuresByPos)) {
    console.error(`Operation ${pos} failed with ${error}`);
  }
}
