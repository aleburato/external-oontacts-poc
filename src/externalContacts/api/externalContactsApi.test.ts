import { afterEach, describe, expect, it } from "vitest";
import {
  mockFetchWithResponse,
  restoreOriginalFetch,
} from "../../_testing/mockFetch";
import { createExternalContactsApi } from "./externalContactsApi";
import { SearchExternalContactsResultDTO } from "./externalContactsApi.dto";
import { givenAMockSearchExternalContactsResultDTO } from "./externalContactsApi.mocks";
import { ExternalContactsApiImpl } from "./externalContactsApiImpl";

afterEach(() => {
  restoreOriginalFetch();
});

describe("factory", () => {
  it("createExternalContactsApi returns a singleton", () => {
    const firstApi = createExternalContactsApi();
    const secondApi = createExternalContactsApi();

    expect(firstApi).toBe(secondApi);
  });
});

describe("api", () => {
  describe("getExternalContacts", () => {
    it("calls the proper endpoint with the proper parameters", async () => {
      const mockFetch = mockFetchWithResponse<SearchExternalContactsResultDTO>(
        givenAMockSearchExternalContactsResultDTO()
      );

      const api = new ExternalContactsApiImpl("myOrgId", "myAuthToken");

      api.getExternalContacts({ start: 5555, limit: 99 });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://webexapis.com/v1/contacts/organizations/myOrgId/contacts/search?start=5555&limit=99",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer myAuthToken",
          },
        }
      );
    });
  });

  describe("getTotalContactsCount", () => {
    it("calls the proper endpoint with the proper parameters and returns the result", async () => {
      const dto = givenAMockSearchExternalContactsResultDTO();
      const mockFetch =
        mockFetchWithResponse<SearchExternalContactsResultDTO>(dto);

      const api = new ExternalContactsApiImpl("myOrgId", "myAuthToken");

      const result = await api.getTotalContactsCount();

      expect(result).toBe(dto.total);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://webexapis.com/v1/contacts/organizations/myOrgId/contacts/search?start=0&limit=1",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer myAuthToken",
          },
        }
      );
    });
  });
});
