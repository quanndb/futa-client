import { getDictionary } from "@/app/dictionaries/dictionaries";
import { DatePicker } from "@/components/common/DatePicker";
import Header from "@/components/Header";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
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
    <>
      <Header />
    </>
  );
}
