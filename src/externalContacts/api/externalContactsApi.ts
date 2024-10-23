import { DbContact } from "../model/dbContact";
import { ExternalContactsApiImpl } from "./externalContactsApiImpl";

export interface GetExternalContactsParams {
  start: number;
  limit: number;
}
export interface GetExternalContactsResult {
  total: number;
  start: number;
  limit: number;
  contacts: DbContact[];
}

export interface ExternalContactsApi {
  getTotalContactsCount: () => Promise<number>;
  getExternalContacts: ({
    start,
    limit,
  }: GetExternalContactsParams) => Promise<GetExternalContactsResult>;
}

let _api: ExternalContactsApi | undefined = undefined;

export function createExternalContactsApi(): ExternalContactsApi {
  if (!_api) {
    _api = new ExternalContactsApiImpl(
      import.meta.env.VITE_ORG_ID,
      import.meta.env.VITE_AUTH_TOKEN
    );
  }
  return _api;
}
