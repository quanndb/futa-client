/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  vi: () => import("./vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return (dictionaries as any)[locale]?.() ?? dictionaries.en();
};
