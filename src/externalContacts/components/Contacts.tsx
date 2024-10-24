import { useMemo, useState } from "react";
import { useInitializeContactsDb } from "../hooks/useInitializeContactsDb";
import { ContactList } from "./ContactList";
import { ContactSearch } from "./ContactSearch";
import { ContactsContext } from "./contexts/contactsContext";

export function Contacts() {
  useInitializeContactsDb();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const context = useMemo(() => ({ setMaxPage }), []);

  return (
    <ContactsContext.Provider value={context}>
      <ContactSearch
        onSearchChange={setSearch}
        onPageChange={setPage}
        maxPage={maxPage}
      />
      <ContactList searchTerm={search} page={page} />
    </ContactsContext.Provider>
  );
}
