import { faker } from "@faker-js/faker";
import { DbContact } from "./dbContact";

export function givenADbContact(): DbContact {
  return {
    id: faker.string.uuid(),
    displayName: faker.person.fullName(),
    phoneNumbers: faker.helpers.multiple(
      () =>
        `${faker.phone.number({ style: "national" })};${faker.helpers.arrayElement(["work", "mobile", "other"])}`,
      { count: { min: 1, max: 3 } }
    ),
    companyName: faker.company.name(),
    familyName: faker.helpers.maybe(() => faker.person.lastName()),
    givenName: faker.helpers.maybe(() => faker.person.firstName()),
  };
}
