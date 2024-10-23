import { BulkError } from "dexie";
import { DexieExternalContactsDb } from "../db/externalContactsDb";
import { DbContact } from "../model/dbContact";
import { ExternalContactsDbRepo } from "./externalContactsDbRepo";

/**
 * For UNIT TESTING use only, use the `createExternalContactsDbRepo` factory instead.
 */

export class ExternalContactsDbRepoImpl implements ExternalContactsDbRepo {
  constructor(private db: DexieExternalContactsDb) {}

  clearDb = async () => {
    await this.db.contacts.clear();
    await this.db.meta.put(
      {
        lastRetrievedApiTotal: -1,
        nextContactOffset: 0,
        failedContactInsertionAttempts: 0,
        timestamp: new Date().toISOString(),
      },
      "lastMeta"
    );
  };
  getContactsImportStatus = async () =>
    await this.db.transaction(
      "r",
      [this.db.contacts, this.db.meta],
      async () => {
        const dbMeta = await this.db.meta.get("lastMeta");

        return {
          lastRetrievedApiTotal: dbMeta?.lastRetrievedApiTotal ?? -1,
          contactsCount: await this.db.contacts.count(),
          nextOffset: dbMeta?.nextContactOffset ?? 0,
          insertionErrors: dbMeta?.failedContactInsertionAttempts ?? 0,
        };
      }
    );
  addContacts = async (contacts: DbContact[]) => {
    await this.db.transaction(
      "rw",
      [this.db.contacts, this.db.meta],
      async () => {
        try {
          await this.db.contacts.bulkAdd(contacts);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error?.name === "BulkError") {
            const bulkError = error as BulkError;
            const currentFailedAttempts =
              (await this.db.meta.get("lastMeta"))
                ?.failedContactInsertionAttempts || 0;
            await this.db.meta.update("lastMeta", {
              failedContactInsertionAttempts:
                currentFailedAttempts + bulkError.failures?.length || 0,
            });
            this.logBulkError(bulkError);
          }
        }
      }
    );
    console.log(">>> addContacts: transaction complete");
  };
  updateApiTotal = async (lastRetrievedApiTotal: number) => {
    await this.db.meta.update("lastMeta", {
      lastRetrievedApiTotal,
    });
  };
  updateNextOffset = async (offset: number) => {
    await this.db.meta.update("lastMeta", {
      nextContactOffset: offset,
    });
  };
  private logBulkError = (err: BulkError) => {
    console.error(err.failures?.length + " insertions failed!");
    err.failures?.forEach((failure) => {
      console.error(failure.message);
    });
    // If on dexie@>3.1.0-alpha.6:
    for (const [pos, error] of Object.entries(err.failuresByPos)) {
      console.error(`Operation ${pos} failed with ${error}`);
    }
  };
}
