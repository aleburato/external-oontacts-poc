import { faker } from "@faker-js/faker";
import {
  ExternalContactDTO,
  SearchExternalContactsResultDTO,
} from "./externalContactsApi.dto";
import {
  ExternalContactsApi,
  GetExternalContactsParams,
  GetExternalContactsResult,
} from "./externalContactsApi.types";

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const ORG_ID = import.meta.env.VITE_ORG_ID;

let _api: ExternalContactsApi | undefined = undefined;

export function createExternalContactsApi(): ExternalContactsApi {
  if (!_api) {
    _api = new ExternalContactsApiImpl(ORG_ID, AUTH_TOKEN);
  }
  return _api;
}

/**
 * FOR UNIT TESTING ONLY, use createExternalContactsApi() instead.
 */
export class ExternalContactsApiImpl implements ExternalContactsApi {
  constructor(
    private readonly _orgId: string,
    private readonly _authToken: string
  ) {}

  getTotalContactsCount = async (): Promise<number> => {
    return (await this.getExternalContacts({ start: 0, limit: 1 })).total;
  };
  getExternalContacts = async ({
    start,
    limit,
  }: GetExternalContactsParams): Promise<GetExternalContactsResult> => {
    const params = new URLSearchParams({
      start: `${start}`,
      limit: `${limit}`,
    });
    const response = await fetch(
      `https://webexapis.com/v1/contacts/organizations/${this._orgId}/contacts/search?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._authToken}`,
        },
      }
    );
    const data = (await response.json()) as SearchExternalContactsResultDTO;
    const resultContacts: ExternalContactDTO[] = data.result;

    return {
      start: data.start,
      contacts: resultContacts.map((c) => ({
        id: c.contactId,
        givenName: c.firstName,
        familyName: c.lastName,
        displayName: c.displayName || "",
        companyName: c.companyName || faker.company.name(),
        // phoneNumbers: c.phoneNumbers || [],
        phoneNumbers: faker.helpers.multiple(
          () =>
            `${faker.phone.number({ style: "national" })};${faker.helpers.arrayElement(["work", "mobile", "other"])}`,
          { count: { min: 1, max: 3 } }
        ),
        // companyName: c.companyName,
      })),
      total: data.total,
      limit: data.limit,
    };
  };
}
