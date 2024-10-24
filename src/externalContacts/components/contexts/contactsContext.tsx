import { createContext } from "react";

export const ContactsContext = createContext<{
  setMaxPage: React.Dispatch<React.SetStateAction<number>>;
}>({
  setMaxPage: () => {},
});
