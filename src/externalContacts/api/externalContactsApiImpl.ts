import {
  generateRandomCompanyName,
  generateRandomPhoneNumberType,
} from "../../common/randomDataHelpers";
import {
  ExternalContactsApi,
  GetExternalContactsParams,
  GetExternalContactsResult,
} from "./externalContactsApi";
import {
  ExternalContactDTO,
  SearchExternalContactsResultDTO,
} from "./externalContactsApi.dto";

/**
 * FOR UNIT TESTING ONLY, use `createExternalContactsApi` factory instead.
 */
export class ExternalContactsApiImpl implements ExternalContactsApi {
  constructor(
    public readonly orgId: string,
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
      `https://webexapis.com/v1/contacts/organizations/${this.orgId}/contacts/search?${params}`,
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
        displayName: `${c.firstName} ${c.lastName}`,
        companyName: generateRandomCompanyName(),
        phoneNumbers:
          c.phoneNumbers?.map(
            (pn) => `${pn.value};${generateRandomPhoneNumberType()}`
          ) || [],
      })),
      total: data.total,
      limit: data.limit,
    };
  };
}
