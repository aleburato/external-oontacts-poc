import { DbContact } from "../externalContacts/model/dbContact";

export type GetExternalContactsResult = {
  total: number;
  start: number;
  limit: number;
  contacts: DbContact[];
};

export type GetExternalContactsParams = {
  start: number;
  limit: number;
};

export interface ExternalContactsApi {
  getTotalContactsCount: () => Promise<number>;
  getExternalContacts: ({
    start,
    limit,
  }: GetExternalContactsParams) => Promise<GetExternalContactsResult>;
}
