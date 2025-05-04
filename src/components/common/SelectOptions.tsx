import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export type Option = {
  label: string;
  value: string;
};

type Props = {
  selectedOption: Option;
  onChangeOption: (option: Option) => void;
  options: Option[];
};

export default function SelectOptions({
  selectedOption,
  onChangeOption,
  options,
}: Props) {
  const t = useTranslations();

  const handleChange = (val: string) => {
    const found = options.find((o) => o.value === val);
    if (found) {
      onChangeOption(found);
    } else {
      onChangeOption({ label: t("all"), value: "all" });
    }
  };

  return (
    <Select value={selectedOption?.value} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder={t("all")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("all")}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
