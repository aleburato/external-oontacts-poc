import { useLiveQuery } from "dexie-react-hooks";
import { externalContactsDb } from "./db/externalContactsDb";
import { DbContact } from "./model/dbContact";

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
    // YES, you have to build the query twice
    // or after the count query there won't be no results.
    // NO, Collection.clone() won't work.
    const query = buildSearchQuery(search);
    const countQuery = buildSearchQuery(search);

    const [totalContacts, contacts] = await Promise.all([
      countQuery.count(),
      query.offset(start).limit(limit).toArray(),
    ]);

    // console.log(">>> liveQuery", {
    //   search,
    //   start,
    //   limit,
    //   totalContacts,
    //   resNum: contacts.length,
    // });

    return { contacts, totalContacts };
  }, [cleanSearch, start, limit]);
}

function buildSearchQuery(search: string) {
  return search
    ? externalContactsDb.contacts
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
    : externalContactsDb.contacts.toCollection();
}
