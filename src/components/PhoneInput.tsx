import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "./CountrySelect";

export function PhoneInput({
  countries,
  country,
  phone,
  isRtl,
  isMobile,
  onCountryChange,
  onPhoneChange,
}) {
  const selectedCountry = countries.find((c) => c.code === country)!;

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    onPhoneChange(numeric);
  };

  return (
    <div className={`${isMobile ? "space-y-2" : "flex"} gap-2`}>
      <CountrySelect
        classes={isMobile ? "w-[100%]" : "w-[50%]"}
        countries={countries}
        value={country}
        onChange={onCountryChange}
      />

      <div className="relative flex-1">
        <Phone className="absolute ms-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        <div className="absolute top-1/2 -translate-y-1/2 ms-9 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
          {selectedCountry.dialCode}
        </div>

        <Input
          type="tel"
          value={phone}
          onChange={handlePhoneNumberChange}
          placeholder="5XXXXXXXX"
          className={`h-11 ${isRtl ? "pr-20" : "pl-20"}`}
          required
        />
      </div>
    </div>
  );
}
