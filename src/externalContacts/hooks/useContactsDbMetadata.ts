import { useLiveQuery } from "dexie-react-hooks";
import { externalContactsDb } from "../db/externalContactsDb";

export function useContactsDbMetadata() {
  return useLiveQuery(async () => {
    const contactsCount = await externalContactsDb.contacts.count();
    const lastMeta = await externalContactsDb.meta.get("lastMeta");
    return lastMeta ? { contactsCount, ...lastMeta } : undefined;
  });
}
