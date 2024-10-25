import { memo } from "react";
import { useContactsDbMetadata } from "../hooks/useContactsDbMetadata";

import "./DbInfo.css";

export const DbInfo = memo(() => {
  const dbMeta = useContactsDbMetadata();

  return (
    dbMeta && (
      <div className="dbInfoWrapper">
        Last update: <b>{new Date(dbMeta.timestamp).toLocaleString()}</b>. Total
        contacts: DB:&nbsp;<b>{dbMeta.contactsCount}</b> / API:&nbsp;
        <b>{dbMeta.lastRetrievedApiTotal}</b>
        &nbsp;(
        <span className="insertionErrors">
          {dbMeta.failedContactInsertionAttempts} errors
        </span>
        )
      </div>
    )
  );
});

DbInfo.displayName = "DbInfo";
