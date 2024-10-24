import { Contacts } from "./externalContacts/components/Contacts";

import { version } from "../package.json";

import "./App.css";

function App() {
  return (
    <div className="mainContainer">
      <Contacts />

      <span id="version-tag">Version: {version}</span>
    </div>
  );
}

export default App;
