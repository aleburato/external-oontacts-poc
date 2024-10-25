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
}: QueryContactsParams):
  | (QueryContactsResult & { search: string })
  | undefined {
  return useLiveQuery(
    async () => {
      const dbRepo = createExternalContactsDbRepo();
      const result = await dbRepo.queryContacts({ search, start, limit });
      return { ...result, search };
    },
    [search, start, limit],
    undefined
  );
}
