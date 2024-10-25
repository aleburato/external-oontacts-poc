import { memo, useContext, useEffect } from "react";
import { QUERY_PAGE_SIZE } from "./ContactList";

import { QueryContactsResult } from "../repo/externalContactsDbRepo";
import "./ContactListHeader.css";
import { ContactsContext } from "./contexts/contactsContext";

export interface ContactListHeaderProps {
  queryResults: QueryContactsResult;
  searchTerm: string;
  page: number;
}

export const ContactListHeader = memo(
  ({ queryResults, searchTerm, page }: ContactListHeaderProps) => {
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
      </div>
    );
  }
);

ContactListHeader.displayName = "ContactListHeader";
