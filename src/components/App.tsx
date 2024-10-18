import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useInitializeContactsDb } from "../externalContacts/useInitializeContactsDb";
import { ContactsList } from "./ContactsList";

import { version } from "../../package.json";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(search, 300).trim();

  useInitializeContactsDb();

  return (
    <div className="mainContainer">
      <div>
        <label htmlFor="searchBox">Search </label>
        <input
          id="searchbox"
          type="text"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />

        <label htmlFor="pagesizebox">Page </label>
        <input
          id="pagebox"
          onChange={(ev) => setPage(Number(ev.target.value))}
          value={page}
          type="number"
          min="1"
          max="100"
        />
      </div>

      <ContactsList searchTerm={debouncedSearchTerm} page={page} />
      <span id="version-tag">Version: {version}</span>
    </div>
  );
}

export default App;
