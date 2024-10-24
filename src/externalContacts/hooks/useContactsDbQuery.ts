import { PromiseExtended } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { externalContactsDb } from "../db/externalContactsDb";
import { DbContact } from "../model/dbContact";

export type UseContactsDbQueryParams = {
  search: string;
  start: number;
  limit: number;
};

export type UseContactsDbQueryResult = {
  contacts: DbContact[];
  totalContacts: number;
};

export function useContactsDbQuery({
  search,
  start,
  limit,
}: UseContactsDbQueryParams): UseContactsDbQueryResult | undefined {
  const cleanSearch = search.trim().toLowerCase();

  return useLiveQuery(async () => {
    const table = externalContactsDb.contacts;

    const query = cleanSearch
      ? table
          .where("displayName")
          .startsWithIgnoreCase(cleanSearch)
          .or("companyName")
          .startsWithIgnoreCase(cleanSearch)
          .or("givenName")
          .startsWithIgnoreCase(cleanSearch)
          .or("familyName")
          .startsWithIgnoreCase(cleanSearch)
          .or("phoneNumbers")
          .startsWithIgnoreCase(cleanSearch)
          .distinct()
      : table.toCollection();

    // Record all primary keys of the entire result into a Set (hashmap)
    const ids = new Set(await query.primaryKeys());

    const contactPromises: PromiseExtended<DbContact>[] = []; // to collect ids sorted by index;
    let skipped = 0; // to account for the offset
    // Use a sort index to query data:
    await table
      .orderBy("givenName")
      .until(() => contactPromises.length >= limit)
      .eachPrimaryKey((id) => {
        if (ids.has(id)) {
          if (skipped >= start) {
            contactPromises.push(table.get(id) as PromiseExtended<DbContact>);
          } else {
            skipped++;
          }
        }
      });

    return {
      contacts: await Promise.all(contactPromises),
      totalContacts: ids.size,
    };
  }, [cleanSearch, start, limit]);
}
