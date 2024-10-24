import { createExternalContactsApi } from "../api/externalContactsApi";
import { createExternalContactsDbRepo } from "../repo/externalContactsDbRepo";

const MAX_NUM_CALLS = 1000;
const INGESTION_PAGE_SIZE = 10000;

export async function resumeOrStartPopulatingDb(
  { _dbRepo, _contactsApi, _pageSize } = {
    _dbRepo: createExternalContactsDbRepo(),
    _contactsApi: createExternalContactsApi(),
    _pageSize: INGESTION_PAGE_SIZE,
  }
): Promise<void> {
  console.log(">>> resumeOrStartPopulatingDb: BEGIN");

  const apiTotal = await _contactsApi.getTotalContactsCount();
  const currentOrgId = _contactsApi.orgId;

  const { lastRetrievedApiTotal, orgId } = await _dbRepo.getImportStatus();

  if (lastRetrievedApiTotal !== apiTotal || orgId !== currentOrgId) {
    console.log(
      `>>> resumeOrStartPopulatingDb: clearing DB for API/DB mismatch`,
      { lastRetrievedApiTotal, apiTotal, orgId, currentOrgId }
    );

    // need to clear db
    await _dbRepo.clearDb({
      lastRetrievedApiTotal: apiTotal,
      orgId: currentOrgId,
    });
  }

  let numOfCalls = 0;

  while (true) {
    if (++numOfCalls > MAX_NUM_CALLS) {
      throw new Error("Max number of calls exceeded");
    }
    const { contactsCount, insertionErrors, nextOffset } =
      await _dbRepo.getImportStatus();

    console.log(`>>> resumeOrStartPopulatingDb (${numOfCalls}): `, {
      apiTotal,
      contactsCount,
      insertionErrors,
      nextOffset,
    });

    if (nextOffset >= apiTotal) {
      console.log(
        `>>> resumeOrStartPopulatingDb (${numOfCalls}): offset exceeded total, ${contactsCount}/${apiTotal} contacts have been ingested`,
        { contactsCount, apiTotal, nextOffset }
      );
      break;
    }

    const res = await _contactsApi.getExternalContacts({
      limit: _pageSize,
      start: nextOffset,
    });

    console.log(
      `>>> resumeOrStartPopulatingDb (${numOfCalls}), called getExternalContacts: `,
      {
        limit: _pageSize,
        start: nextOffset,
      },
      res
    );

    await _dbRepo.addContacts(res.contacts);

    console.log(
      `>>> resumeOrStartPopulatingDb (${numOfCalls}), added contacts to repo`
    );

    await _dbRepo.updateNextOffset(nextOffset + _pageSize);
  }

  console.log(`>>> resumeOrStartPopulatingDb: OVER`);
}
