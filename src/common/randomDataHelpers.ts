import { getRandomElement } from "./arrayHelpers";

export function generateRandomUSPhoneNumber() {
  // Randomly generate the three parts of a US phone number
  const areaCode = Math.floor(Math.random() * 800 + 200); // Area codes don't start with 0 or 1
  const centralOfficeCode = Math.floor(Math.random() * 643 + 100); // Avoids 9 at the start
  const lineNumber = Math.floor(Math.random() * 10000); // 4-digit line number

  // Format the number as a standard US phone number
  return `(${areaCode}) ${centralOfficeCode}-${lineNumber.toString().padStart(4, "0")}`;
}

export function generateRandomPhoneNumberType() {
  return getRandomElement(["work", "mobile", "other"]);
}

export function generateRandomCompanyName() {
  return getRandomElement([
    "Gerhold Inc",
    "Dibbert Group",
    "Hane, Dicki and Borer",
    "Fritsch LLC",
    "Shields, Beatty and Zemlak",
    "Jaskolski, Luettgen and Zieme",
    "Hoeger Group",
    "Bins, Rice and Friesen",
    "Toy, Morissette and Bartell",
    "Larson and Sons",
    "Wisozk, O'Keefe and Wolff",
    "Von-Kreiger",
    "Nolan, Volkman and Nader",
    "Erdman-Wehner",
    "Beatty Inc",
    "Cremin PLC",
    "Douglas, Bailey and Gutkowski",
    "Quitzon LLC",
    "Batz and Sons",
    "Bode Inc",
    "Douglas-Schneider",
    "Powlowski, Lowe and Beer",
    "Kshlerin, Pagac and Hodkiewicz",
    "Connelly and Sons",
    "Smitham Ltd",
    "Crooks PLC",
    "Goldner PLC",
    "Corkery, Hodkiewicz and Huels",
    "Kovacek Inc",
    "Von-Marvin",
    "Gibson, Block and Dooley",
    "Flatley-Bernier",
    "Schumm Inc",
    "Ziemann PLC",
    "Mayer Ltd",
    "Okuneva, Parisian and Sporer",
    "Greenholt, Bradtke and Huel",
    "Medhurst and Sons",
    "Hermiston-Reichel",
    "Spencer, Bins and Thompson",
    "Raynor Inc",
    "Koelpin Group",
    "Schaden Group",
    "Maggio-Ernser",
    "Goodwin, Howe and Stamm",
    "O'Connell, Greenfelder and Feest",
    "Schneider, Marquardt and Beier",
    "D'Amore-Cormier",
    "Wunsch-Hamill",
    "Homenick Group",
  ]);
}
