import { expect, it } from "vitest";
import { createExternalContactsDbRepo } from "./contactsDbRepo";

it("creates the repo object only once", () => {
  const repo1 = createExternalContactsDbRepo({} as never);
  const repo2 = createExternalContactsDbRepo({} as never);

  expect(repo1).toBe(repo2);
});
