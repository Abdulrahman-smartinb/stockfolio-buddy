import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { isMobile } from "@/hooks/helpers";

/* ================= Types ================= */

type Country = {
  code: string;
  name: string;
  nameAr?: string;
  flag: string;
  dialCode: string;
};

type Props = {
  classes?: string;
  countries: Country[];
  value: string;
  onChange: (country: Country) => void;
};

/* ================= Component ================= */

export function CountrySelect({ classes, countries, value, onChange }: Props) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = countries.find((c) => c.code === value);

  const getCountryName = (c: Country) =>
    isRtl && c.nameAr ? c.nameAr : c.name;

  const filtered = useMemo(() => {
    if (!search) return countries;

    const q = search.toLowerCase();

    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr?.toLowerCase().includes(q) ||
        c.dialCode.includes(search),
    );
  }, [countries, search]);

  return (
    <div dir="ltr" className={cn("relative", classes)}>
      {/* ===== Trigger ===== */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "h-11 w-full flex items-center justify-between",
          "rounded-lg border border-input bg-background px-3",
          "text-sm text-start py-0",
          "hover:bg-muted/30 transition",
        )}
      >
        <span className={isMobile ? "truncate pt-1" : "truncate"}>
          {selected
            ? `${selected.flag} ${selected.dialCode}`
            : isRtl
              ? "اختر الدولة"
              : "Select country"}
        </span>

        {open ? (
          <ChevronUp
            className={cn(
              "h-4 w-4 text-muted-foreground transition",
              isRtl && "rotate-180",
            )}
          />
        ) : (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition",
              isRtl && "rotate-180",
            )}
          />
        )}
      </button>

      {/* ===== Dropdown ===== */}
      {open && (
        <div
          className={cn(
            isMobile ? "w-[80vw]" : "w-full",
            "absolute z-50 mt-1 rounded-lg border bg-background shadow-lg overflow-hidden",
          )}
        >
          {/* Search */}
          <input
            autoFocus
            placeholder={
              isRtl ? "ابحث عن الدولة أو الرمز" : "Search country or code"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "h-10 w-full border-b px-3 text-sm",
              "focus:outline-none text-start",
            )}
          />

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                {isRtl ? "لا توجد نتائج" : "No results"}
              </p>
            )}

            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2",
                  "text-sm text-start hover:bg-muted/40 transition",
                  value === c.code && "bg-muted/30",
                )}
              >
                <span>{c.flag}</span>

                <span className="flex-1 truncate">{getCountryName(c)}</span>

                <span className="text-xs text-muted-foreground">
                  {c.dialCode}
                </span>

                {value === c.code && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
