export type DbContact = {
  id: string;
  displayName: string;
  phoneNumbers: string[]; // FORMAT: "number;type"
  givenName?: string;
  familyName?: string;
  companyName?: string;
};
