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
    const numeric = e.target.value.replace(/\D/g, "");
    onPhoneChange(numeric);
  };

  return (
    <div className={/*isMobile ? "space-y-2" :*/ "flex gap-2"} dir="ltr">
      {/* Country */}
      <CountrySelect
        classes={isMobile ? "w-1/3" : "w-1/2"}
        countries={countries}
        value={country}
        onChange={onCountryChange}
      />

      {/* Phone */}
      <div className={isMobile ? "relative w-2/3" : "relative w-1/2"}>
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        {/* Dial code */}
        <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
          {selectedCountry.dialCode}
        </div>

        <Input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handlePhoneNumberChange}
          placeholder="5XXXXXXXX"
          className="
            h-11
            pl-20
            text-left
            tabular-nums
          "
          required
        />
      </div>
    </div>
  );
}
