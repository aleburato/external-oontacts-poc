import { memo } from "react";
import { useContactsDbQuery } from "../hooks/useContactsDbQuery";
import { ContactListHeader } from "./ContactListHeader";

import "./ContactList.css";
import { ContactListTable } from "./ContactListTable";

export const QUERY_PAGE_SIZE = 1000;

export interface ContactListProps {
  searchTerm: string;
  page: number;
}

export const ContactList = memo(({ searchTerm, page }: ContactListProps) => {
  const startOffset = (page - 1) * QUERY_PAGE_SIZE;
  const queryResults = useContactsDbQuery({
    search: searchTerm,
    start: startOffset,
    limit: QUERY_PAGE_SIZE,
  });

  console.log(">>> render contacts list", queryResults, searchTerm);

  return (
    <div className="contactsListWrapper">
      {queryResults && searchTerm === queryResults.search ? (
        <ContactListHeader
          queryResults={queryResults}
          searchTerm={searchTerm}
          page={page}
        />
      ) : (
        <h3>Loading...</h3>
      )}
      {queryResults?.contacts && (
        <ContactListTable
          contacts={queryResults?.contacts}
          startOffset={startOffset}
        />
      )}
    </div>
  );
});

ContactList.displayName = "ContactList";
