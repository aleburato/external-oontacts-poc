import { useEffect, useRef, useState } from "react";
import { resumeOrStartPopulatingDb } from "./services/resumeOrStartPopulatingDb";

export function useInitializeContactsDb() {
  const contactsFetchStarted = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!contactsFetchStarted.current) {
      contactsFetchStarted.current = true;
      void resumeOrStartPopulatingDb().then(() => {
        setIsReady(true);
      });
    }
  }, []);

  return isReady;
}
