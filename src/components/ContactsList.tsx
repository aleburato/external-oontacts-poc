import { memo } from "react";
import { useContactsDbMetadata } from "../externalContacts/useContactsDbMetadata";
import { useContactsDbQuery } from "../externalContacts/useContactsDbQuery";

import "./ContactsList.css";

const QUERY_PAGE_SIZE = 1000;

export interface ContactsListProps {
  searchTerm: string;
  page: number;
}

export const ContactsList = memo(function ContactsList({
  searchTerm,
  page,
}: ContactsListProps) {
  const dbMeta = useContactsDbMetadata();

  const startOffset = (page - 1) * QUERY_PAGE_SIZE;
  const queryResult = useContactsDbQuery({
    search: searchTerm,
    start: startOffset,
    limit: QUERY_PAGE_SIZE,
  });

  // console.log(">>> render contacts list", queryResult);

  return (
    <div className="contactsList">
      <div className="contactListHeader">
        {queryResult && dbMeta ? (
          <ContactListHeader
            apiTotal={dbMeta.lastRetrievedApiTotal}
            dbContactsCount={dbMeta.contactsCount}
            dbErrors={dbMeta.failedContactInsertionAttempts}
            queryContactsLength={queryResult.contacts.length}
            queryTotalContacts={queryResult.totalContacts}
            searchTerm={searchTerm}
            page={page}
            timestamp={dbMeta.timestamp}
          />
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
      <div className="tableWrapper">
        <table>
          <thead>
            <tr key="thead">
              <th className="rightAlign">#</th>
              <th>Display Name</th>
              <th>Given Name</th>
              <th>Family Name</th>
              <th>Company Name</th>
              <th>Phone Numbers</th>
              <th>Contact ID</th>
            </tr>
          </thead>
          <tbody>
            {queryResult?.contacts.map((c, i) => (
              <tr key={c.id}>
                <td className="rightAlign">{startOffset + i + 1}</td>
                <td>{c.displayName}</td>
                <td>{c.givenName}</td>
                <td>{c.familyName}</td>
                <td>{c.companyName || ""}</td>
                <td>{c.phoneNumbers.map((p) => p.split(";")[0]).join(", ")}</td>
                <td>{c.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

interface ContactListHeaderProps {
  searchTerm: string;
  queryContactsLength: number;
  queryTotalContacts: number;
  timestamp: string;
  dbContactsCount: number;
  dbErrors: number;
  apiTotal: number;
  page: number;
}

function ContactListHeader({
  timestamp,
  dbContactsCount,
  queryTotalContacts,
  queryContactsLength,
  searchTerm,
  apiTotal,
  dbErrors,
  page,
}: ContactListHeaderProps) {
  const startOffset = (page - 1) * QUERY_PAGE_SIZE + 1;
  const endOffset = Math.min(
    startOffset + queryContactsLength - 1,
    queryTotalContacts
  );

  return (
    <>
      <h3>
        Query results {searchTerm ? `matching '${searchTerm}'` : ""} (
        {startOffset}...{endOffset}/ {queryTotalContacts})
      </h3>
      <span>
        Last update: <b>{new Date(timestamp).toLocaleString()}</b>. Total
        contacts stored in DB:&nbsp;<b>{dbContactsCount}</b> / API:&nbsp;
        <b>{apiTotal}</b>
        &nbsp;(
        <span className="insertionErrors">{dbErrors} errors</span>)
      </span>
    </>
  );
}
