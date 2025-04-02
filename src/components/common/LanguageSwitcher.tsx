"use client";

import Link from "next/link";

type LanguageSwitcherProps = {
  currentLang: string;
  dictionary: {
    en: string;
    vi: string;
  };
};

export default function LanguageSwitcher({
  currentLang,
  dictionary,
}: LanguageSwitcherProps) {
  // Lấy đường dẫn hiện tại không bao gồm phần ngôn ngữ
  const getPathWithoutLang = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const pathParts = pathname.split("/");

      // Loại bỏ phần ngôn ngữ và giữ lại phần còn lại của đường dẫn
      if (pathParts.length > 2) {
        return "/" + pathParts.slice(2).join("/");
      }
      return "/";
    }
    return "/";
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Link
        href={`/en${getPathWithoutLang()}`}
        style={{
          fontWeight: currentLang === "en" ? "bold" : "normal",
          textDecoration: currentLang === "en" ? "underline" : "none",
        }}
      >
        {dictionary.en}
      </Link>
      <Link
        href={`/vi${getPathWithoutLang()}`}
        style={{
          fontWeight: currentLang === "vi" ? "bold" : "normal",
          textDecoration: currentLang === "vi" ? "underline" : "none",
        }}
      >
        {dictionary.vi}
      </Link>
    </div>
  );
}
