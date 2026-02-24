import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "./CountrySelect";

/* ================= Types ================= */

type Country = {
  code: string;
  name: string;
  nameAr?: string;
  flag: string;
  dialCode: string;
};

type Props = {
  countries: Country[];
  country: string;
  phone: string;
  isRtl: boolean;
  isMobile: boolean;
  onCountryChange: (country: Country) => void; // 👈 full object
  onPhoneChange: (phone: string) => void;
};

/* ================= Component ================= */

export function PhoneInput({
  countries,
  country,
  phone,
  isRtl,
  isMobile,
  onCountryChange,
  onPhoneChange,
}: Props) {
  const selectedCountry = countries.find((c) => c.code === country);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    onPhoneChange(numeric);
  };

  return (
    <div
      className="flex gap-2 font-google"
      dir="ltr" // 👈 always LTR for numbers
    >
      {/* ================= Country Select ================= */}
      <CountrySelect
        classes={isMobile ? "w-1/3" : "w-1/2"}
        countries={countries}
        value={country}
        onChange={(c) => {
          onCountryChange(c); // 👈 forward full object
        }}
      />

      {/* ================= Phone Input ================= */}
      <div className={isMobile ? "relative w-2/3" : "relative w-1/2"}>
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 jadwa-icon-gold" />

        <Input
          type="tel"
          inputMode="numeric"
          dir="ltr"
          lang="en"
          value={phone}
          onChange={handlePhoneNumberChange}
          placeholder="5XXXXXXXX"
          className={
            isMobile
              ? "h-11 pl-9 text-left font-google tabular-nums"
              : "h-11 pl-9 text-left font-google tabular-nums"
          }
          required
        />
      </div>
    </div>
  );
}
