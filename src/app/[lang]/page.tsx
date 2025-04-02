import { getDictionary } from "@/app/dictionaries/dictionaries";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { languages } from "@/middleware";

// Xác định các tham số động hợp lệ
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  // Lấy từ điển cho ngôn ngữ hiện tại
  const dictionary = await getDictionary(lang);

  return (
    <div
      className="container"
      style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <LanguageSwitcher
        currentLang={lang}
        dictionary={dictionary.languageSwitch}
      />

      <div style={{ marginTop: "2rem" }}>
        <h1>{dictionary.title}</h1>
        <p>{dictionary.description}</p>
        <p style={{ fontWeight: "bold" }}>{dictionary.greeting}</p>
      </div>
    </div>
  );
}
