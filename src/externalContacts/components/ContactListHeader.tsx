import { memo, useContext, useEffect } from "react";
import { UseContactsDbMetadataResult } from "../hooks/useContactsDbMetadata";
import { QUERY_PAGE_SIZE } from "./ContactList";

import { QueryContactsResult } from "../repo/externalContactsDbRepo";
import "./ContactListHeader.css";
import { ContactsContext } from "./contexts/contactsContext";

export interface ContactListHeaderProps {
  dbMeta: UseContactsDbMetadataResult;
  queryResults: QueryContactsResult;
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
    const maxPage = Math.ceil(queryResults.totalContacts / QUERY_PAGE_SIZE);

    const { setMaxPage } = useContext(ContactsContext);

    useEffect(() => {
      setMaxPage(maxPage);
    }, [maxPage, setMaxPage]);

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
