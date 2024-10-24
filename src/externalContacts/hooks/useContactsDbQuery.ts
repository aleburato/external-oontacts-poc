import { PromiseExtended, Table } from "dexie";
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

    const query = buildSearchQuery(search, table);

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

    // YES, you have to build the query twice
    // or after the count query there won't be no results.
    // NO, Collection.clone() won't work.
    const countQuery = buildSearchQuery(search, table);

    const [totalContacts, contacts] = await Promise.all([
      countQuery.count(),
      await Promise.all(contactPromises),
    ]);

    return { contacts, totalContacts };
  }, [cleanSearch, start, limit]);
}

function buildSearchQuery(search: string, table: Table) {
  return search
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
}
