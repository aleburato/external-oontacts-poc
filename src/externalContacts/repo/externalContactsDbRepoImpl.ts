import { BulkError, PromiseExtended } from "dexie";
import {
  ExternalContactsDb,
  ExternalContactsDbContact,
  ExternalContactsDbMeta,
} from "../db/externalContactsDb.types";
import {
  ExternalContactsDbRepo,
  QueryContactsParams,
  QueryContactsResult,
} from "./externalContactsDbRepo";

/**
 * For UNIT TESTING use only, use the `createExternalContactsDbRepo` factory instead.
 */

export class ExternalContactsDbRepoImpl implements ExternalContactsDbRepo {
  constructor(private db: ExternalContactsDb) {}

  clearDb = async ({
    lastRetrievedApiTotal,
    orgId,
  }: Pick<ExternalContactsDbMeta, "lastRetrievedApiTotal" | "orgId">) => {
    await this.db.contacts.clear();
    await this.db.meta.put(
      {
        orgId,
        lastRetrievedApiTotal,
        nextContactOffset: 0,
        failedContactInsertionAttempts: 0,
        timestamp: new Date().toISOString(),
      },
      "lastMeta"
    );
  };
  getImportStatus = async () =>
    await this.db.transaction(
      "r",
      [this.db.contacts, this.db.meta],
      async () => {
        const dbMeta = await this.db.meta.get("lastMeta");

        return {
          orgId: dbMeta?.orgId || "",
          lastRetrievedApiTotal: dbMeta?.lastRetrievedApiTotal ?? -1,
          contactsCount: await this.db.contacts.count(),
          nextOffset: dbMeta?.nextContactOffset ?? 0,
          insertionErrors: dbMeta?.failedContactInsertionAttempts ?? 0,
        };
      }
    );
  addContacts = async (contacts: ExternalContactsDbContact[]) => {
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
  };
  queryContacts = async ({
    search,
    limit,
    start,
  }: QueryContactsParams): Promise<QueryContactsResult> => {
    const table = this.db.contacts;

    const query = search
      ? table
          .where("displayName")
          .startsWithIgnoreCase(search)
          .or("companyName")
          .startsWithIgnoreCase(search)
          .or("givenName")
          .startsWithIgnoreCase(search)
          .or("familyName")
          .startsWithIgnoreCase(search)
          .or("phoneNumbers")
          .startsWithIgnoreCase(search)
          .distinct()
      : table.toCollection();

    // Record all primary keys of the entire result into a Set (hashmap)
    const queryIds = new Set(await query.primaryKeys());

    const contactPromises: PromiseExtended<ExternalContactsDbContact>[] = []; // to collect ids sorted by index;
    let skipped = 0; // to account for the offset
    // Use a sort index to query data:
    await table
      .orderBy("givenName")
      .until(() => contactPromises.length >= limit)
      .eachPrimaryKey((id) => {
        if (queryIds.has(id)) {
          if (skipped >= start) {
            contactPromises.push(
              table.get(id) as PromiseExtended<ExternalContactsDbContact>
            );
          } else {
            skipped++;
          }
        }
      });

    return {
      contacts: await Promise.all(contactPromises),
      totalContacts: queryIds.size,
    };
  };

  updateNextOffset = async (offset: number) => {
    await this.db.meta.update("lastMeta", {
      nextContactOffset: offset,
    });
  };

  private logBulkError = (err: BulkError) => {
    try {
      console.error(err.failures?.length + " insertions failed!");
      err.failures?.forEach((failure) => {
        console.error(failure.message);
      });
      // If on dexie@>3.1.0-alpha.6:
      for (const [pos, error] of Object.entries(err.failuresByPos)) {
        console.error(`Operation ${pos} failed with ${error}`);
      }
    } catch {
      // mhe
    }
  };
}
