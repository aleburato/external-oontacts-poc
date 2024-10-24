import { memo } from "react";
import { ExternalContactsDbContact } from "../db/externalContactsDb.types";

import "./ContactListTable.css";

export interface ContactListTableProps {
  contacts: ExternalContactsDbContact[];
  startOffset: number;
}

export const ContactListTable = memo(
  ({ startOffset, contacts }: ContactListTableProps) => {
    return (
      <div className="contactListTableWrapper">
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
            {contacts.map((c, i) => (
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
    );
  }
);

ContactListTable.displayName = "ContactListTable";
