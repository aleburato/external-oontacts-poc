export type ExternalContactDTO = {
  contactId: string;
  emails?:
    | {
        value: string;
      }[]
    | undefined;
  phoneNumbers?: {
    type: string;
    value: string;
    primary?: boolean;
  }[];
  displayName?: string;
  firstName?: string;
  lastName?: string;
  sipAddresses?: {
    type: string;
    value: string;
    primary?: boolean;
  }[];
  companyName?: string;
};

export type SearchExternalContactsResultDTO = {
  result: ExternalContactDTO[];
  limit: number;
  start: number;
  total: number;
};
