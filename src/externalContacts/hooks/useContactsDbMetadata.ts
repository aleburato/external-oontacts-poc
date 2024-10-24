import { useLiveQuery } from "dexie-react-hooks";
import { externalContactsDb } from "../db/externalContactsDb";
import { ExternalContactsDbMeta } from "../db/externalContactsDb.types";

export type UseContactsDbMetadataResult = ExternalContactsDbMeta & {
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
