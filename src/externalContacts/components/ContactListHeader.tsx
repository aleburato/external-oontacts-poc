import { memo } from "react";
import { UseContactsDbMetadataResult } from "../hooks/useContactsDbMetadata";
import { UseContactsDbQueryResult } from "../hooks/useContactsDbQuery";
import { QUERY_PAGE_SIZE } from "./ContactList";

import "./ContactListHeader.css";

export interface ContactListHeaderProps {
  dbMeta: UseContactsDbMetadataResult;
  queryResults: UseContactsDbQueryResult;
  searchTerm: string;
  page: number;
}

export const ContactListHeader = memo(
  ({ dbMeta, queryResults, searchTerm, page }: ContactListHeaderProps) => {
    const startOffset = (page - 1) * QUERY_PAGE_SIZE + 1;
    const endOffset = Math.min(
      startOffset + queryResults.contacts.length - 1,
      queryResults.totalContacts
    );

    return (
      <div className="contactListHeaderWrapper">
        <h3>
          Query results {searchTerm ? `matching '${searchTerm}'` : ""} (
          {startOffset}...{endOffset}/ {queryResults.totalContacts})
        </h3>
        <span>
          Last update: <b>{new Date(dbMeta.timestamp).toLocaleString()}</b>.
          Total contacts stored in DB:&nbsp;<b>{dbMeta.contactsCount}</b> /
          API:&nbsp;
          <b>{dbMeta.lastRetrievedApiTotal}</b>
          &nbsp;(
          <span className="insertionErrors">
            {dbMeta.failedContactInsertionAttempts} errors
          </span>
          )
        </span>
      </div>
    );
  }
);

ContactListHeader.displayName = "ContactListHeader";
