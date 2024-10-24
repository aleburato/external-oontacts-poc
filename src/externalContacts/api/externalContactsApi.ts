import { ExternalContactsDbContact } from "../db/externalContactsDb.types";
import { ExternalContactsApiImpl } from "./externalContactsApiImpl";

export interface GetExternalContactsParams {
  start: number;
  limit: number;
}
export interface GetExternalContactsResult {
  total: number;
  start: number;
  limit: number;
  contacts: ExternalContactsDbContact[];
}

export interface ExternalContactsApi {
  readonly orgId: string;
  readonly getTotalContactsCount: () => Promise<number>;
  readonly getExternalContacts: ({
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
