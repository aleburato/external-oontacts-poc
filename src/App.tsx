import { useState } from "react";
import { ContactList } from "./externalContacts/components/ContactList";
import { useInitializeContactsDb } from "./externalContacts/hooks/useInitializeContactsDb";

import { version } from "../package.json";

import "./App.css";
import { ContactSearch } from "./externalContacts/components/ContactSearch";

function App() {
  useInitializeContactsDb();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="mainContainer">
      <ContactSearch onSearchChange={setSearch} onPageChange={setPage} />
      <ContactList searchTerm={search} page={page} />
      <span id="version-tag">Version: {version}</span>
    </div>
  );
}

export default App;
