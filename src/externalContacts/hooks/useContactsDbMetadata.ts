import { useLiveQuery } from "dexie-react-hooks";
import { ContactsDbMeta, externalContactsDb } from "../db/externalContactsDb";

export type UseContactsDbMetadataResult = ContactsDbMeta & {
  contactsCount: number;
};

export function useContactsDbMetadata():
  | UseContactsDbMetadataResult
  | undefined {
  return useLiveQuery(async () => {
    const contactsCount = await externalContactsDb.contacts.count();
    const lastMeta = await externalContactsDb.meta.get("lastMeta");
    return lastMeta ? { contactsCount, ...lastMeta } : undefined;
  });
}
