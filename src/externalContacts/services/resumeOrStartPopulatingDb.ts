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
  let numOfCalls = 0;

  let apiTotal = await _contactsApi.getTotalContactsCount();

  while (true) {
    if (numOfCalls++ > MAX_NUM_CALLS) {
      throw new Error("Max number of calls exceeded");
    }
    let {
      lastRetrievedApiTotal,
      contactsCount,
      insertionErrors,
      nextOffset,
      // eslint-disable-next-line prefer-const
      orgId,
    } = await _dbRepo.getContactsImportStatus();

    const currentOrgId = _contactsApi.orgId;

    console.log(`>>> resumeOrStartPopulatingDb (${numOfCalls}): `, {
      lastRetrievedApiTotal,
      apiTotal,
      contactsCount,
      insertionErrors,
      nextOffset,
      orgId,
    });

    if (lastRetrievedApiTotal !== apiTotal || orgId !== currentOrgId) {
      // need to clear db
      await _dbRepo.clearDb();
      await _dbRepo.updateNextOffset(0);
      await _dbRepo.updateApiTotal(apiTotal);
      await _dbRepo.updateOrgId(currentOrgId);

      lastRetrievedApiTotal = apiTotal;
      insertionErrors = 0;
      contactsCount = 0;
      nextOffset = 0;
      console.log(
        `>>> resumeOrStartPopulatingDb (${numOfCalls}): clearing DB for API/DB mismatch`,
        { lastRetrievedApiTotal, apiTotal, orgId, currentOrgId }
      );
    }

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

    apiTotal = res.total;

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
