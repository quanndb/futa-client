import { defineRouting } from "next-intl/routing";

export enum Locale {
  EN = "en",
  VI = "vi",
}

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [Locale.VI, Locale.EN],

  // Used when no locale matches
  defaultLocale: Locale.VI,
});
