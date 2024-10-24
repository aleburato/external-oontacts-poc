import { useLiveQuery } from "dexie-react-hooks";
import {
  createExternalContactsDbRepo,
  QueryContactsParams,
  QueryContactsResult,
} from "../repo/externalContactsDbRepo";

export function useContactsDbQuery({
  search,
  start,
  limit,
}: QueryContactsParams): QueryContactsResult | undefined {
  const cleanSearch = search.trim().toLowerCase();

  return useLiveQuery(() => {
    const dbRepo = createExternalContactsDbRepo();
    return dbRepo.queryContacts({ search: cleanSearch, start, limit });
  }, [cleanSearch, start, limit]);
}
