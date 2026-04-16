import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCityData, findCountryByValue } from "@/lib/countryCityUtils";

type Props = {
  country: string;
  city: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
};

const CountryCitySelect = ({
  country,
  city,
  onCountryChange,
  onCityChange,
}: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const selectedCountry = useMemo(
    () => findCountryByValue(country),
    [country],
  );

  const cities = selectedCountry?.cities || [];

  const getCountryLabel = (item: (typeof countryCityData)[number]) =>
    isArabic ? item.nameAr : item.name;

  const getCityLabel = (item: (typeof cities)[number]) =>
    isArabic ? item.nameAr : item.name;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <div className="space-y-1">
        <p className="text-sm font-medium text-jadwa-muted">
          {t("profile.country")}
        </p>
        <Select
          value={selectedCountry?.name || ""}
          onValueChange={(value) => {
            onCountryChange(value);
            onCityChange("");
          }}
        >
          <SelectTrigger className="h-11 rounded-2xl bg-muted/20 focus:bg-background transition">
            <SelectValue placeholder={t("profile.select_country")} />
          </SelectTrigger>
          <SelectContent>
            {countryCityData.map((item) => (
              <SelectItem key={item.code} value={item.name}>
                {getCountryLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-jadwa-muted">
          {t("profile.city")}
        </p>
        <Select
          value={city || ""}
          onValueChange={onCityChange}
          disabled={!selectedCountry}
        >
          <SelectTrigger className="h-11 rounded-2xl bg-muted/20 focus:bg-background transition">
            <SelectValue placeholder={t("profile.select_city")} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {getCityLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CountryCitySelect;
