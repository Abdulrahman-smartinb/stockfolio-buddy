import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
};

type Props = {
  countries: Country[];
  value: string;
  onChange: (country: any) => void;
};

export function CountrySelect({ countries, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = countries.find((c) => c.code === value);

  const filtered = useMemo(() => {
    if (!search) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dialCode.includes(search),
    );
  }, [countries, search]);

  return (
    <div className="relative w-full max-w-[50%]">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="h-11 w-full flex items-center justify-between rounded-lg border border-input bg-background px-3 text-sm"
      >
        <span className="truncate">
          {selected ? `${selected.flag} ${selected.name}` : "Select country"}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-background shadow-lg">
          {/* SEARCH — INSIDE DROPDOWN */}
          <input
            autoFocus
            placeholder="Search country or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full border-b px-3 text-sm focus:outline-none"
          />

          {/* LIST */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No results
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
                  "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted",
                  value === c.code && "bg-muted",
                )}
              >
                <span>{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  {c.dialCode}
                </span>
                {value === c.code && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
